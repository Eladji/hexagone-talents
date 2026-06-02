from __future__ import annotations

from typing import Any

from fastapi import HTTPException, Response, status

from app.core.database import get_connection
from app.schemas.staff import ModerateSkillRequest


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
