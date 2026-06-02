from typing import Any

from fastapi import APIRouter, Depends

from app.api.dependencies import require_role
from app.schemas.student import SuggestSkillRequest
from app.services import skill_service

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("")
def list_skills() -> list[dict[str, Any]]:
    return skill_service.list_approved_skills()


@router.post("/suggest", status_code=201)
def suggest_skill(
    payload: SuggestSkillRequest,
    _: dict[str, Any] = Depends(require_role("ETUDIANT")),
) -> dict[str, Any]:
    return skill_service.suggest_skill(payload)
