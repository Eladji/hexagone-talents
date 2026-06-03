from typing import Any

from fastapi import APIRouter, Depends

from app.api.dependencies import require_role
from app.schemas.company import UpdateCompanyProfileRequest
from app.services import company_service

router = APIRouter(prefix="/company", tags=["Companies"])


@router.get("/profile")
def company_profile(
    auth: dict[str, Any] = Depends(require_role("ENTREPRISE")),
) -> dict[str, Any]:
    return company_service.get_company_profile(auth["user_id"])


@router.put("/profile")
def update_company_profile(
    payload: UpdateCompanyProfileRequest,
    auth: dict[str, Any] = Depends(require_role("ENTREPRISE")),
) -> dict[str, Any]:
    return company_service.update_company_profile(auth["user_id"], payload)
