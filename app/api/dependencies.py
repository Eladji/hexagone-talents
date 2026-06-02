from typing import Any

from fastapi import Header, HTTPException, status

from app.core.types import Role


def require_role(*allowed_roles: Role):
    def dependency(
        x_user_role: str | None = Header(default=None),
        x_user_id: int | None = Header(default=None),
    ) -> dict[str, Any]:
        if x_user_role is None or x_user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"message": "Headers X-User-Role et X-User-Id requis."},
            )

        role = x_user_role.upper()
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"message": "Acces refuse pour ce role."},
            )

        return {"role": role, "user_id": x_user_id}

    return dependency
