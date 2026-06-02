from typing import Any

from fastapi import APIRouter, Depends

from app.api.dependencies import require_role
from app.schemas.matching import SwipeRequest
from app.services import matching_service

router = APIRouter(prefix="/swipes", tags=["Matching"])


@router.post("")
def submit_swipe(
    payload: SwipeRequest,
    auth: dict[str, Any] = Depends(require_role("ETUDIANT", "ENTREPRISE")),
) -> dict[str, Any]:
    return matching_service.submit_swipe(payload, auth)
