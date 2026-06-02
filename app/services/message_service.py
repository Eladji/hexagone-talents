from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from app.core.database import get_connection
from app.schemas.message import CreateMessageRequest
from app.services.guards import ensure_match


def list_messages(match_id: int) -> list[dict[str, Any]]:
    with get_connection() as conn:
        ensure_match(conn, match_id)
        rows = conn.execute(
            "SELECT sender_role, content, timestamp FROM message WHERE match_id = ? ORDER BY timestamp ASC",
            (match_id,),
        ).fetchall()
    return [dict(row) for row in rows]


def create_message(match_id: int, payload: CreateMessageRequest, auth: dict[str, Any]) -> dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat()
    sender_role = auth["role"]
    with get_connection() as conn:
        ensure_match(conn, match_id)
        cursor = conn.execute(
            "INSERT INTO message(match_id, sender_role, content, timestamp) VALUES (?, ?, ?, ?)",
            (match_id, sender_role, payload.content, now),
        )

    return {"message_id": cursor.lastrowid, "sender_role": sender_role, "content": payload.content, "timestamp": now}
