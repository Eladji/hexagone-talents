from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import HTTPException, Response, status

from app.core.database import get_connection
from app.schemas.staff import ManageAccountRequest, ManageOfferRequest, ModerateSkillRequest


def list_pending_skills() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id AS skill_id, name, suggested_by AS suggested_by_student_id
            FROM skill
            WHERE status = 'PENDING'
            ORDER BY id
            """
        ).fetchall()
    return [dict(row) for row in rows]


def list_staff_overview() -> dict[str, int]:
    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT
                (SELECT COUNT(*) FROM users WHERE status = 'ACTIVE') AS active_accounts,
                (SELECT COUNT(*) FROM users WHERE status = 'SUSPENDED') AS suspended_accounts,
                (SELECT COUNT(*) FROM offer WHERE status = 'ACTIVE') AS active_offers,
                (SELECT COUNT(*) FROM offer WHERE status = 'ARCHIVED') AS archived_offers,
                (SELECT COUNT(*) FROM skill WHERE status = 'PENDING') AS pending_skills
            """
        ).fetchone()
    return dict(row)


def list_all_offers() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                o.id,
                o.company_id,
                o.company_name,
                o.title,
                o.description,
                o.contact_email,
                o.contact_phone,
                o.status,
                o.created_at,
                o.closed_at,
                COUNT(am.id) AS interaction_count,
                COALESCE(SUM(CASE WHEN am.is_match = 1 THEN 1 ELSE 0 END), 0) AS match_count
            FROM offer o
            LEFT JOIN application_match am ON am.offer_id = o.id
            GROUP BY o.id
            ORDER BY CASE o.status WHEN 'ACTIVE' THEN 0 ELSE 1 END, o.id DESC
            """
        ).fetchall()
    return [dict(row) for row in rows]


def manage_offer(offer_id: int, payload: ManageOfferRequest) -> dict[str, Any]:
    with get_connection() as conn:
        offer = conn.execute("SELECT * FROM offer WHERE id = ?", (offer_id,)).fetchone()
        if not offer:
            raise HTTPException(status_code=404, detail={"message": "Offre introuvable."})

        if payload.action == "ARCHIVE":
            conn.execute(
                "UPDATE offer SET status = 'ARCHIVED', closed_at = ? WHERE id = ?",
                (datetime.utcnow().isoformat(timespec="seconds"), offer_id),
            )
            status_value = "ARCHIVED"
        else:
            conn.execute("UPDATE offer SET status = 'ACTIVE', closed_at = '' WHERE id = ?", (offer_id,))
            status_value = "ACTIVE"

    return {"offer_id": offer_id, "status": status_value}


def list_accounts() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                u.id,
                u.username,
                u.role,
                u.status,
                u.linked_id,
                CASE
                    WHEN u.role = 'ETUDIANT' THEN TRIM(COALESCE(s.firstname, '') || ' ' || COALESCE(s.lastname, ''))
                    WHEN u.role = 'ENTREPRISE' THEN c.name
                    WHEN u.role = 'STAFF' THEN TRIM(COALESCE(st.firstname, '') || ' ' || COALESCE(st.lastname, ''))
                    ELSE u.username
                END AS display_name,
                CASE
                    WHEN u.role = 'ETUDIANT' THEN s.email
                    WHEN u.role = 'ENTREPRISE' THEN c.email
                    WHEN u.role = 'STAFF' THEN st.email
                    ELSE ''
                END AS email
            FROM users u
            LEFT JOIN student s ON u.role = 'ETUDIANT' AND s.id = u.linked_id
            LEFT JOIN company c ON u.role = 'ENTREPRISE' AND c.id = u.linked_id
            LEFT JOIN staff st ON u.role = 'STAFF' AND st.id = u.linked_id
            ORDER BY u.role, u.username
            """
        ).fetchall()
    return [dict(row) for row in rows]


def manage_account(user_id: int, payload: ManageAccountRequest) -> dict[str, Any]:
    with get_connection() as conn:
        account = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if not account:
            raise HTTPException(status_code=404, detail={"message": "Compte introuvable."})
        if account["role"] == "STAFF":
            raise HTTPException(status_code=400, detail={"message": "Un compte staff ne peut pas etre suspendu ici."})

        status_value = "SUSPENDED" if payload.action == "SUSPEND" else "ACTIVE"
        conn.execute("UPDATE users SET status = ? WHERE id = ?", (status_value, user_id))

    return {"user_id": user_id, "status": status_value}


def moderate_skill(skill_id: int, payload: ModerateSkillRequest, response: Response) -> dict[str, Any] | None:
    with get_connection() as conn:
        skill = conn.execute("SELECT * FROM skill WHERE id = ?", (skill_id,)).fetchone()
        if not skill:
            raise HTTPException(status_code=404, detail={"message": "Competence introuvable."})

        if payload.action == "APPROVE":
            conn.execute("UPDATE skill SET status = 'APPROVED' WHERE id = ?", (skill_id,))
            return {"skill_id": skill_id, "name": skill["name"], "status": "APPROVED"}

        conn.execute("DELETE FROM skill WHERE id = ?", (skill_id,))

    response.status_code = status.HTTP_204_NO_CONTENT
    return None
