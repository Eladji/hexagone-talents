from __future__ import annotations

import sqlite3
from typing import Any

from fastapi import HTTPException


def ensure_student(conn: sqlite3.Connection, student_id: int) -> None:
    if not conn.execute("SELECT 1 FROM student WHERE id = ?", (student_id,)).fetchone():
        raise HTTPException(status_code=404, detail={"message": "Etudiant introuvable."})


def ensure_offer(conn: sqlite3.Connection, offer_id: int) -> None:
    if not conn.execute("SELECT 1 FROM offer WHERE id = ?", (offer_id,)).fetchone():
        raise HTTPException(status_code=404, detail={"message": "Offre introuvable."})


def ensure_company(conn: sqlite3.Connection, company_id: int) -> None:
    if not conn.execute("SELECT 1 FROM company WHERE id = ?", (company_id,)).fetchone():
        raise HTTPException(status_code=404, detail={"message": "Entreprise introuvable."})


def ensure_company_owns_offer(conn: sqlite3.Connection, company_id: int, offer_id: int) -> None:
    offer = conn.execute("SELECT company_id FROM offer WHERE id = ?", (offer_id,)).fetchone()
    if not offer:
        raise HTTPException(status_code=404, detail={"message": "Offre introuvable."})

    if offer["company_id"] != company_id:
        raise HTTPException(
            status_code=403,
            detail={"message": "Cette entreprise ne peut utiliser que ses propres offres."},
        )


def ensure_match(conn: sqlite3.Connection, match_id: int) -> None:
    query = "SELECT 1 FROM application_match WHERE id = ? AND is_match = 1"
    if not conn.execute(query, (match_id,)).fetchone():
        raise HTTPException(status_code=404, detail={"message": "Match introuvable."})


def ensure_skills(conn: sqlite3.Connection, skill_ids: list[int], approved_only: bool) -> None:
    if not skill_ids:
        return

    placeholders = ",".join("?" for _ in skill_ids)
    query = f"SELECT id FROM skill WHERE id IN ({placeholders})"
    params: list[Any] = list(skill_ids)

    if approved_only:
        query += " AND status = 'APPROVED'"

    found_ids = {row["id"] for row in conn.execute(query, params).fetchall()}
    missing = sorted(set(skill_ids) - found_ids)
    if missing:
        raise HTTPException(status_code=400, detail={"message": f"Competences invalides: {missing}"})


def ensure_student_owns_skills(conn: sqlite3.Connection, student_id: int, skill_ids: list[int]) -> None:
    placeholders = ",".join("?" for _ in skill_ids)
    rows = conn.execute(
        f"SELECT skill_id FROM student_skill WHERE student_id = ? AND skill_id IN ({placeholders})",
        [student_id, *skill_ids],
    ).fetchall()

    owned = {row["skill_id"] for row in rows}
    missing = sorted(set(skill_ids) - owned)
    if missing:
        raise HTTPException(
            status_code=400,
            detail={"message": f"Le projet doit etre lie uniquement aux competences du profil. Invalides: {missing}"},
        )
