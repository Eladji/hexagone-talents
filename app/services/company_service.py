from typing import Any

from app.core.database import get_connection
from app.schemas.company import UpdateCompanyProfileRequest
from app.services.guards import ensure_company


def get_company_profile(company_id: int) -> dict[str, Any]:
    with get_connection() as conn:
        ensure_company(conn, company_id)
        row = conn.execute(
            "SELECT id, name, email, phone FROM company WHERE id = ?",
            (company_id,),
        ).fetchone()
    return dict(row)


def update_company_profile(company_id: int, payload: UpdateCompanyProfileRequest) -> dict[str, Any]:
    with get_connection() as conn:
        ensure_company(conn, company_id)
        conn.execute(
            "UPDATE company SET name = ?, email = ?, phone = ? WHERE id = ?",
            (payload.name, payload.email, payload.phone, company_id),
        )
        conn.execute(
            "UPDATE offer SET company_name = ? WHERE company_id = ?",
            (payload.name, company_id),
        )

    return {"id": company_id, "name": payload.name, "email": payload.email, "phone": payload.phone}
