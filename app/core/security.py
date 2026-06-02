from __future__ import annotations

import hashlib


def hash_password(password: str) -> str:
    """Hash password using SHA256 (upgrade to bcrypt in production)."""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password
