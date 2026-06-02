from __future__ import annotations

from typing import Any

from fastapi import HTTPException

from app.core.database import get_connection
from app.schemas.offer import CreateOfferRequest
from app.services.guards import ensure_skills


def list_offers() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, company_name, title, description, contact_email, contact_phone
            FROM offer
            ORDER BY id DESC
            """
        ).fetchall()
    return [dict(row) for row in rows]


def create_offer(payload: CreateOfferRequest) -> dict[str, Any]:
    if not payload.required_skill_ids:
        raise HTTPException(status_code=400, detail={"message": "Une offre doit cibler au moins une competence."})

    skill_ids = sorted(set(payload.required_skill_ids))
    with get_connection() as conn:
        ensure_skills(conn, skill_ids, approved_only=True)
        cursor = conn.execute(
            """
            INSERT INTO offer(company_name, title, description, contact_email, contact_phone)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                payload.company_name,
                payload.title,
                payload.description,
                payload.contact_email or "",
                payload.contact_phone or "",
            ),
        )
        offer_id = cursor.lastrowid
        conn.executemany(
            "INSERT INTO offer_skill(offer_id, skill_id) VALUES (?, ?)",
            [(offer_id, skill_id) for skill_id in skill_ids],
        )

    return {"offer_id": offer_id, "company_name": payload.company_name, "title": payload.title}
