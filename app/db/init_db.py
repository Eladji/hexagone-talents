from app.core.database import get_connection
from app.core.security import hash_password
from app.db.schema import CREATE_TABLES_SQL
from app.db.seed import DEFAULT_PASSWORD, seed_database


DEMO_COMPANIES = [
    (201, "Tech Solutions", "recrutement@techsolutions.com", "0123456789"),
    (202, "Innovate Labs", "jobs@innovatelabs.com", "0123456790"),
    (203, "Mobilio", "contact@mobilio.com", "0123456791"),
    (204, "DataHive", "hello@datahive.com", "0123456792"),
    (205, "Creative Studio", "recrutement@creative.studio", "0123456793"),
    (206, "CloudWorks", "contact@cloudworks.com", "0123456794"),
]


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(CREATE_TABLES_SQL)
        _ensure_table_column(conn, "student", "avatar_url", "TEXT DEFAULT ''")
        _ensure_table_column(conn, "users", "password", "TEXT NOT NULL DEFAULT ''")
        _ensure_table_column(conn, "offer", "company_id", "INTEGER")
        seed_database(conn)
        _repair_demo_companies(conn)
        _backfill_offer_company_ids(conn)
        _repair_demo_user_passwords(conn)


def _ensure_table_column(conn, table_name: str, column_name: str, column_type: str) -> None:
    columns = {row["name"] for row in conn.execute(f"PRAGMA table_info({table_name})")}
    if column_name in columns:
        return

    conn.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")


def _repair_demo_user_passwords(conn) -> None:
    conn.execute(
        "UPDATE users SET password = ? WHERE password IN ('', ?)",
        (hash_password(DEFAULT_PASSWORD), DEFAULT_PASSWORD),
    )


def _backfill_offer_company_ids(conn) -> None:
    conn.execute(
        """
        UPDATE offer
        SET company_id = (
            SELECT company.id
            FROM company
            WHERE company.name = offer.company_name
        )
        WHERE company_id IS NULL
        """
    )


def _repair_demo_companies(conn) -> None:
    conn.executemany(
        "INSERT OR IGNORE INTO company(id, name, email, phone) VALUES (?, ?, ?, ?)",
        DEMO_COMPANIES,
    )
