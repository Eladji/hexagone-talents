import secrets
from typing import Any

from fastapi import HTTPException

from app.core.database import get_connection, row_to_dict
from app.core.security import hash_password, verify_password
from app.schemas.auth import LoginRequest, RegisterRequest


def login(payload: LoginRequest) -> dict[str, Any]:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE username = ?",
            (payload.username,),
        ).fetchone()
        if not row or not verify_password(payload.password, row["password"]):
            raise HTTPException(status_code=401, detail={"message": "Identifiants invalides."})
        user = row_to_dict(row)

    return {
        "token": f"{user['id']}:{secrets.token_urlsafe(32)}",
        "role": user["role"],
        "user_id": user["linked_id"],
    }


def register(payload: RegisterRequest) -> dict[str, Any]:
    with get_connection() as conn:
        if conn.execute("SELECT 1 FROM users WHERE username = ?", (payload.username,)).fetchone():
            raise HTTPException(status_code=400, detail={"message": "Nom d'utilisateur deja utilise."})

        cursor = conn.execute(
            "INSERT INTO student(firstname, lastname, bio, email, phone, avatar_url) VALUES (?, ?, ?, ?, ?, ?)",
            (
                payload.firstname,
                payload.lastname,
                payload.bio,
                payload.email,
                payload.phone,
                payload.avatar_url,
            ),
        )
        student_id = cursor.lastrowid
        conn.execute(
            "INSERT INTO users(username, password, role, linked_id) VALUES (?, ?, ?, ?)",
            (payload.username, hash_password(payload.password), "ETUDIANT", student_id),
        )

    return {
        "token": f"{student_id}:{secrets.token_urlsafe(32)}",
        "role": "ETUDIANT",
        "user_id": student_id,
    }
