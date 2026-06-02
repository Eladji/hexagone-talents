from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import HTTPException

from app.core.database import get_connection
from app.schemas.offer import CreateOfferRequest
from app.services.guards import ensure_company, ensure_skills


def list_offers(auth: dict[str, Any]) -> list[dict[str, Any]]:
    return _list_offers_by_status(auth, "ACTIVE")


def list_offer_history(auth: dict[str, Any]) -> list[dict[str, Any]]:
    return _list_offers_by_status(auth, "ARCHIVED")


def _list_offers_by_status(auth: dict[str, Any], status: str) -> list[dict[str, Any]]:
    company_id = auth["user_id"]
    with get_connection() as conn:
        ensure_company(conn, company_id)
        rows = conn.execute(
            """
            SELECT id, company_id, company_name, title, description, contact_email, contact_phone, status, created_at, closed_at
            FROM offer
            WHERE company_id = ? AND status = ?
            ORDER BY id DESC
            """,
            (company_id, status),
        ).fetchall()
    return [dict(row) for row in rows]


def create_offer(payload: CreateOfferRequest, auth: dict[str, Any]) -> dict[str, Any]:
    if not payload.required_skill_ids:
        raise HTTPException(status_code=400, detail={"message": "Une offre doit cibler au moins une competence."})

    company_id = auth["user_id"]
    skill_ids = sorted(set(payload.required_skill_ids))

    with get_connection() as conn:
        company = conn.execute("SELECT name, email, phone FROM company WHERE id = ?", (company_id,)).fetchone()
        if not company:
            raise HTTPException(status_code=404, detail={"message": "Entreprise introuvable."})

        ensure_skills(conn, skill_ids, approved_only=True)
        cursor = conn.execute(
            """
            INSERT INTO offer(company_id, company_name, title, description, contact_email, contact_phone, status, created_at, closed_at)
            VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', ?, '')
            """,
            (
                company_id,
                company["name"],
                payload.title,
                payload.description,
                payload.contact_email or company["email"] or "",
                payload.contact_phone or company["phone"] or "",
                datetime.utcnow().isoformat(timespec="seconds"),
            ),
        )
        offer_id = cursor.lastrowid
        conn.executemany(
            "INSERT INTO offer_skill(offer_id, skill_id) VALUES (?, ?)",
            [(offer_id, skill_id) for skill_id in skill_ids],
        )

    return {
        "offer_id": offer_id,
        "company_id": company_id,
        "company_name": company["name"],
        "title": payload.title,
        "description": payload.description,
        "status": "ACTIVE",
    }
