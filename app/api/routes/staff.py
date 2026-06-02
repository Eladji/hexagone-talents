from typing import Any

from fastapi import APIRouter, Depends, Response

from app.api.dependencies import require_role
from app.schemas.staff import ManageAccountRequest, ManageOfferRequest, ModerateSkillRequest
from app.services import staff_service

router = APIRouter(prefix="/staff", tags=["Staff"])


@router.get("/overview")
def overview(_: dict[str, Any] = Depends(require_role("STAFF"))) -> dict[str, int]:
    return staff_service.list_staff_overview()


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


@router.get("/offers")
def list_offers(_: dict[str, Any] = Depends(require_role("STAFF"))) -> list[dict[str, Any]]:
    return staff_service.list_all_offers()


@router.patch("/offers/{offer_id}")
def manage_offer(
    offer_id: int,
    payload: ManageOfferRequest,
    _: dict[str, Any] = Depends(require_role("STAFF")),
) -> dict[str, Any]:
    return staff_service.manage_offer(offer_id, payload)


@router.get("/accounts")
def list_accounts(_: dict[str, Any] = Depends(require_role("STAFF"))) -> list[dict[str, Any]]:
    return staff_service.list_accounts()


@router.patch("/accounts/{user_id}")
def manage_account(
    user_id: int,
    payload: ManageAccountRequest,
    _: dict[str, Any] = Depends(require_role("STAFF")),
) -> dict[str, Any]:
    return staff_service.manage_account(user_id, payload)
