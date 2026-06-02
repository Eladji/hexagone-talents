from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException

from app.core.database import get_connection
from app.schemas.matching import SwipeRequest
from app.services.guards import ensure_company_owns_offer, ensure_offer, ensure_student


def suggested_students(offer_id: int, auth: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    with get_connection() as conn:
        ensure_company_owns_offer(conn, auth["user_id"], offer_id)
        offer_skills = {
            row["skill_id"] for row in conn.execute("SELECT skill_id FROM offer_skill WHERE offer_id = ?", (offer_id,))
        }
        swiped_student_ids = {
            row["student_id"]
            for row in conn.execute(
                "SELECT student_id FROM application_match WHERE offer_id = ? AND company_decision IS NOT NULL",
                (offer_id,),
            )
        }

        candidates = []
        for student in conn.execute("SELECT * FROM student ORDER BY id").fetchall():
            if student["id"] not in swiped_student_ids:
                candidates.append(_build_candidate_card(conn, student, offer_skills))

    candidates.sort(key=lambda candidate: candidate["alignment_score"], reverse=True)
    return {"candidates": candidates}


def submit_swipe(payload: SwipeRequest, auth: dict[str, Any]) -> dict[str, Any]:
    if auth["role"] != payload.actor_role:
        raise HTTPException(status_code=403, detail={"message": "actor_role ne correspond pas au role authentifie."})

    now = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        ensure_offer(conn, payload.offer_id)
        ensure_student(conn, payload.student_id)

        if payload.actor_role == "ENTREPRISE":
            ensure_company_owns_offer(conn, auth["user_id"], payload.offer_id)
            decision_column = "company_decision"
        elif payload.actor_role == "ETUDIANT":
            decision_column = "student_decision"
        else:
            raise HTTPException(status_code=400, detail={"message": "Seuls les etudiants et entreprises peuvent swiper."})

        _create_interaction_if_needed(conn, payload, now)

        conn.execute(
            f"UPDATE application_match SET {decision_column} = ?, updated_at = ? WHERE offer_id = ? AND student_id = ?",
            (payload.decision, now, payload.offer_id, payload.student_id),
        )

        match_row = conn.execute(
            "SELECT * FROM application_match WHERE offer_id = ? AND student_id = ?",
            (payload.offer_id, payload.student_id),
        ).fetchone()
        is_match = match_row["company_decision"] == "LIKE" and match_row["student_decision"] == "LIKE"
        conn.execute("UPDATE application_match SET is_match = ? WHERE id = ?", (1 if is_match else 0, match_row["id"]))
        details = _get_match_details(conn, payload.offer_id, payload.student_id) if is_match else None

    response: dict[str, Any] = {
        "is_match": is_match,
        "message": "It's a Match !" if is_match else "Swipe enregistre avec succes.",
    }
    if details:
        response["match_details"] = details
    return response


def student_likes(student_id: int) -> list[dict[str, Any]]:
    with get_connection() as conn:
        ensure_student(conn, student_id)
        rows = conn.execute(
            """
            SELECT am.id AS interaction_id, o.id AS offer_id, o.company_name, o.title AS offer_title, o.description
            FROM application_match am
            JOIN offer o ON o.id = am.offer_id
            WHERE am.student_id = ? AND am.company_decision = 'LIKE' AND am.student_decision IS NULL
            ORDER BY am.updated_at DESC
            """,
            (student_id,),
        ).fetchall()
    return [dict(row) for row in rows]


def student_matches(student_id: int) -> list[dict[str, Any]]:
    with get_connection() as conn:
        ensure_student(conn, student_id)
        rows = conn.execute(
            """
            SELECT am.id AS match_id, o.company_name, o.title AS offer_title, o.contact_email, o.contact_phone
            FROM application_match am
            JOIN offer o ON o.id = am.offer_id
            WHERE am.student_id = ? AND am.is_match = 1
            ORDER BY am.updated_at DESC
            """,
            (student_id,),
        ).fetchall()
    return [dict(row) for row in rows]


def offer_matches(offer_id: int, auth: dict[str, Any]) -> list[dict[str, Any]]:
    with get_connection() as conn:
        ensure_company_owns_offer(conn, auth["user_id"], offer_id)
        rows = conn.execute(
            """
            SELECT am.id AS match_id, s.id AS student_id, s.firstname, s.lastname, s.email, s.phone, s.avatar_url
            FROM application_match am
            JOIN student s ON s.id = am.student_id
            WHERE am.offer_id = ? AND am.is_match = 1
            ORDER BY am.updated_at DESC
            """,
            (offer_id,),
        ).fetchall()
    return [dict(row) for row in rows]


def _create_interaction_if_needed(conn: sqlite3.Connection, payload: SwipeRequest, now: str) -> None:
    existing = conn.execute(
        "SELECT 1 FROM application_match WHERE offer_id = ? AND student_id = ?",
        (payload.offer_id, payload.student_id),
    ).fetchone()
    if existing:
        return

    conn.execute(
        """
        INSERT INTO application_match(offer_id, student_id, created_at, updated_at)
        VALUES (?, ?, ?, ?)
        """,
        (payload.offer_id, payload.student_id, now, now),
    )


def _build_candidate_card(conn: sqlite3.Connection, student: sqlite3.Row, offer_skill_ids: set[int]) -> dict[str, Any]:
    skill_rows = conn.execute(
        """
        SELECT sk.id, sk.name, ss.weight
        FROM student_skill ss
        JOIN skill sk ON sk.id = ss.skill_id
        WHERE ss.student_id = ?
        ORDER BY ss.weight DESC
        """,
        (student["id"],),
    ).fetchall()
    project_skill_ids = {
        row["skill_id"]
        for row in conn.execute(
            """
            SELECT DISTINCT ps.skill_id
            FROM project p
            JOIN project_skill ps ON ps.project_id = p.id
            WHERE p.student_id = ?
            """,
            (student["id"],),
        ).fetchall()
    }

    matching_rows = [row for row in skill_rows if row["id"] in offer_skill_ids]
    base_score = sum(row["weight"] for row in matching_rows)
    project_malus = 10 * sum(row["id"] not in project_skill_ids for row in matching_rows)

    return {
        "student_id": student["id"],
        "firstname": student["firstname"],
        "lastname": student["lastname"],
        "avatar_url": student["avatar_url"] if "avatar_url" in student.keys() else "",
        "alignment_score": max(0, min(100, base_score - project_malus)),
        "skills": [f"{row['name']} ({row['weight']}pts)" for row in skill_rows],
        "bio": student["bio"],
    }


def _get_match_details(conn: sqlite3.Connection, offer_id: int, student_id: int) -> dict[str, str]:
    row = conn.execute(
        """
        SELECT s.firstname, s.lastname, o.company_name
        FROM student s, offer o
        WHERE o.id = ? AND s.id = ?
        """,
        (offer_id, student_id),
    ).fetchone()
    return {
        "student_name": f"{row['firstname']} {row['lastname']}",
        "company_name": row["company_name"],
    }
