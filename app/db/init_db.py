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

DEMO_OFFERS = [
    (
        14,
        201,
        "Tech Solutions",
        "Frontend React TypeScript",
        "Renfort produit pour creer des composants fiables et maintenir le design system.",
        "recrutement@techsolutions.com",
        "0123456789",
        "ACTIVE",
        "2026-06-02T09:00:00",
        "",
        [1, 3],
    ),
    (
        15,
        201,
        "Tech Solutions",
        "Backend Node.js API",
        "Mission API REST avec authentification, tests et integration continue.",
        "recrutement@techsolutions.com",
        "0123456789",
        "ACTIVE",
        "2026-06-02T10:00:00",
        "",
        [2, 3],
    ),
    (
        101,
        201,
        "Tech Solutions",
        "Stage QA Automatisation",
        "Ancienne campagne de tests automatises pour stabiliser les parcours critiques.",
        "recrutement@techsolutions.com",
        "0123456789",
        "ARCHIVED",
        "2026-02-12T09:30:00",
        "2026-04-18T17:00:00",
        [4, 5],
    ),
    (
        102,
        201,
        "Tech Solutions",
        "Integrateur Web Junior",
        "Ancienne offre orientee integration responsive et correction UI.",
        "recrutement@techsolutions.com",
        "0123456789",
        "ARCHIVED",
        "2026-01-08T11:00:00",
        "2026-03-21T16:30:00",
        [1, 8],
    ),
]


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(CREATE_TABLES_SQL)
        _ensure_table_column(conn, "student", "avatar_url", "TEXT DEFAULT ''")
        _ensure_table_column(conn, "users", "password", "TEXT NOT NULL DEFAULT ''")
        _ensure_table_column(conn, "users", "status", "TEXT NOT NULL DEFAULT 'ACTIVE'")
        _ensure_table_column(conn, "offer", "company_id", "INTEGER")
        _ensure_table_column(conn, "offer", "status", "TEXT NOT NULL DEFAULT 'ACTIVE'")
        _ensure_table_column(conn, "offer", "created_at", "TEXT DEFAULT ''")
        _ensure_table_column(conn, "offer", "closed_at", "TEXT DEFAULT ''")
        seed_database(conn)
        _repair_demo_companies(conn)
        _backfill_offer_company_ids(conn)
        _repair_demo_offers(conn)
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


def _repair_demo_offers(conn) -> None:
    for offer in DEMO_OFFERS:
        (
            offer_id,
            company_id,
            company_name,
            title,
            description,
            contact_email,
            contact_phone,
            status,
            created_at,
            closed_at,
            skill_ids,
        ) = offer
        conn.execute(
            """
            INSERT OR IGNORE INTO offer(
                id,
                company_id,
                company_name,
                title,
                description,
                contact_email,
                contact_phone,
                status,
                created_at,
                closed_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                offer_id,
                company_id,
                company_name,
                title,
                description,
                contact_email,
                contact_phone,
                status,
                created_at,
                closed_at,
            ),
        )
        conn.executemany(
            "INSERT OR IGNORE INTO offer_skill(offer_id, skill_id) VALUES (?, ?)",
            [(offer_id, skill_id) for skill_id in skill_ids],
        )
