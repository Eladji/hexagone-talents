from app.core.config import DB_PATH
from app.core.database import get_connection
from app.db.schema import CREATE_TABLES_SQL
from app.db.seed import seed_database


def init_db(reset: bool = True) -> None:
    if reset and DB_PATH.exists():
        DB_PATH.unlink()

    with get_connection() as conn:
        conn.executescript(CREATE_TABLES_SQL)
        seed_database(conn)
