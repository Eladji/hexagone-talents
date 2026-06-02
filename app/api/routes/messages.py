from typing import Any

from fastapi import APIRouter, Depends

from app.api.dependencies import require_role
from app.schemas.message import CreateMessageRequest
from app.services import message_service

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/{match_id}")
def get_messages(
    match_id: int,
    _: dict[str, Any] = Depends(require_role("ETUDIANT", "ENTREPRISE")),
) -> list[dict[str, Any]]:
    return message_service.list_messages(match_id)


@router.post("/{match_id}", status_code=201)
def post_message(
    match_id: int,
    payload: CreateMessageRequest,
    auth: dict[str, Any] = Depends(require_role("ETUDIANT", "ENTREPRISE")),
) -> dict[str, Any]:
    return message_service.create_message(match_id, payload, auth)
