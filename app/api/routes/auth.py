from typing import Any

from fastapi import APIRouter

from app.schemas.auth import LoginRequest, RegisterRequest
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(payload: LoginRequest) -> dict[str, Any]:
    return auth_service.login(payload)


@router.post("/register")
def register(payload: RegisterRequest) -> dict[str, Any]:
    return auth_service.register(payload)
