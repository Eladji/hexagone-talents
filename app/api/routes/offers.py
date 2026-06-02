from typing import Any

from fastapi import APIRouter, Depends

from app.api.dependencies import require_role
from app.schemas.offer import CreateOfferRequest
from app.services import matching_service, offer_service

router = APIRouter(prefix="/offers", tags=["Offers"])


@router.get("")
def list_offers(
    auth: dict[str, Any] = Depends(require_role("ENTREPRISE")),
) -> list[dict[str, Any]]:
    return offer_service.list_offers(auth)


@router.post("", status_code=201)
def create_offer(
    payload: CreateOfferRequest,
    auth: dict[str, Any] = Depends(require_role("ENTREPRISE")),
) -> dict[str, Any]:
    return offer_service.create_offer(payload, auth)


@router.get("/{offer_id}/suggestions")
def suggested_students(
    offer_id: int,
    auth: dict[str, Any] = Depends(require_role("ENTREPRISE")),
) -> dict[str, list[dict[str, Any]]]:
    return matching_service.suggested_students(offer_id, auth)


@router.get("/{offer_id}/matches")
def offer_matches(
    offer_id: int,
    auth: dict[str, Any] = Depends(require_role("ENTREPRISE")),
) -> list[dict[str, Any]]:
    return matching_service.offer_matches(offer_id, auth)
