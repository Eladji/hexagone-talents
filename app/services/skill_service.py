from __future__ import annotations

import re
from typing import Any

from fastapi import HTTPException

from app.core.database import get_connection
from app.schemas.student import SuggestSkillRequest
from app.services.guards import ensure_student


def list_approved_skills() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id AS skill_id, name, status FROM skill WHERE status = 'APPROVED' ORDER BY name"
        ).fetchall()
    return [dict(row) for row in rows]


def suggest_skill(payload: SuggestSkillRequest) -> dict[str, Any]:
    cleaned_name = payload.skill_name.strip()
    if len(cleaned_name) == 0 or len(cleaned_name) >= 25:
        raise HTTPException(status_code=400, detail={"message": "skill_name doit contenir entre 1 et 24 caracteres."})
    if not re.fullmatch(r"[A-Za-z0-9 .+#-]+", cleaned_name):
        raise HTTPException(status_code=400, detail={"message": "skill_name contient des caracteres non autorises."})

    with get_connection() as conn:
        ensure_student(conn, payload.student_id)
        existing = conn.execute("SELECT id FROM skill WHERE lower(name) = lower(?)", (cleaned_name,)).fetchone()
        if existing:
            raise HTTPException(
                status_code=409,
                detail={"message": "Cette competence existe deja.", "skill_id": existing["id"]},
            )

        cursor = conn.execute(
            "INSERT INTO skill(name, status, suggested_by) VALUES (?, 'PENDING', ?)",
            (cleaned_name, payload.student_id),
        )

    return {"skill_id": cursor.lastrowid, "name": cleaned_name, "status": "PENDING"}
