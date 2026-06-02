from typing import Any

from fastapi import APIRouter, Depends, Response

from app.api.dependencies import require_role
from app.schemas.staff import ModerateSkillRequest
from app.services import staff_service

router = APIRouter(prefix="/staff", tags=["Staff"])


@router.get("/skills/pending")
def pending_skills(_: dict[str, Any] = Depends(require_role("STAFF"))) -> list[dict[str, Any]]:
    return staff_service.list_pending_skills()


@router.patch("/skills/{skill_id}")
def moderate_skill(
    skill_id: int,
    payload: ModerateSkillRequest,
    response: Response,
    _: dict[str, Any] = Depends(require_role("STAFF")),
) -> dict[str, Any] | None:
    return staff_service.moderate_skill(skill_id, payload, response)
