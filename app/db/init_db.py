from app.core.database import get_connection
from app.core.security import hash_password
from app.db.schema import CREATE_TABLES_SQL
from app.db.seed import DEFAULT_PASSWORD, seed_database


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(CREATE_TABLES_SQL)
        _ensure_table_column(conn, "student", "avatar_url", "TEXT DEFAULT ''")
        _ensure_table_column(conn, "users", "password", "TEXT NOT NULL DEFAULT ''")
        seed_database(conn)
        _repair_demo_user_passwords(conn)


def _ensure_table_column(conn, table_name: str, column_name: str, column_type: str) -> None:
    columns = {row['name'] for row in conn.execute(f"PRAGMA table_info({table_name})").fetchall()}
    if column_name not in columns:
        conn.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")


def _repair_demo_user_passwords(conn) -> None:
    conn.execute(
        "UPDATE users SET password = ? WHERE password IN ('', ?)",
        (hash_password(DEFAULT_PASSWORD), DEFAULT_PASSWORD),
    )
