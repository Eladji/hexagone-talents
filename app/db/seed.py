from __future__ import annotations

import sqlite3

from app.core.security import hash_password
from app.db.demo_data import (
    APPLICATION_MATCHES,
    COMPANIES,
    MESSAGES,
    OFFERS,
    PROJECTS,
    SKILLS,
    STAFF,
    STUDENT_SKILLS,
    STUDENTS,
    USER_ACCOUNTS,
)


DEFAULT_PASSWORD = "password123"


def avatar_url(firstname: str, lastname: str) -> str:
    name = f"{firstname}+{lastname}"
    return f"https://ui-avatars.com/api/?name={name}&background=4969b2&color=ffffff"


def seed_database(conn: sqlite3.Connection) -> None:
    has_users = conn.execute("SELECT COUNT(*) AS count FROM users").fetchone()["count"]
    if has_users:
        return

    _seed_people(conn)
    _seed_skills(conn)
    _seed_projects(conn)
    _seed_offers(conn)
    _seed_accounts(conn)
    _seed_matches(conn)
    _seed_messages(conn)


def _seed_people(conn: sqlite3.Connection) -> None:
    conn.executemany(
        "INSERT INTO student(id, firstname, lastname, bio, email, phone, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [(sid, first, last, bio, email, phone, avatar_url(first, last)) for sid, first, last, bio, email, phone in STUDENTS],
    )
    conn.executemany("INSERT INTO company(id, name, email, phone) VALUES (?, ?, ?, ?)", COMPANIES)
    conn.executemany("INSERT INTO staff(id, firstname, lastname, email, phone) VALUES (?, ?, ?, ?, ?)", STAFF)


def _seed_skills(conn: sqlite3.Connection) -> None:
    conn.executemany("INSERT INTO skill(id, name, status, suggested_by) VALUES (?, ?, ?, ?)", SKILLS)
    conn.executemany("INSERT INTO student_skill(student_id, skill_id, weight) VALUES (?, ?, ?)", STUDENT_SKILLS)


def _seed_projects(conn: sqlite3.Connection) -> None:
    for student_id, title, description, skill_ids in PROJECTS:
        conn.execute(
            "INSERT INTO project(student_id, title, description) VALUES (?, ?, ?)",
            (student_id, title, description),
        )
        project_id = conn.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]
        conn.executemany(
            "INSERT INTO project_skill(project_id, skill_id) VALUES (?, ?)",
            [(project_id, skill_id) for skill_id in skill_ids],
        )


def _seed_offers(conn: sqlite3.Connection) -> None:
    for offer in OFFERS:
        offer_id, company_id, company_name, title, description, email, phone, status, created_at, closed_at, skill_ids = offer
        conn.execute(
            """
            INSERT INTO offer(
                id, company_id, company_name, title, description,
                contact_email, contact_phone, status, created_at, closed_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (offer_id, company_id, company_name, title, description, email, phone, status, created_at, closed_at),
        )
        conn.executemany(
            "INSERT INTO offer_skill(offer_id, skill_id) VALUES (?, ?)",
            [(offer_id, skill_id) for skill_id in skill_ids],
        )


def _seed_accounts(conn: sqlite3.Connection) -> None:
    conn.executemany(
        "INSERT INTO users(id, username, password, role, linked_id) VALUES (?, ?, ?, ?, ?)",
        [(user_id, username, hash_password(DEFAULT_PASSWORD), role, linked_id) for user_id, username, role, linked_id in USER_ACCOUNTS],
    )


def _seed_matches(conn: sqlite3.Connection) -> None:
    rows = [
        (match_id, offer_id, student_id, company_decision, student_decision, is_match, _demo_timestamp(index), _demo_timestamp(index))
        for index, (match_id, offer_id, student_id, company_decision, student_decision, is_match) in enumerate(APPLICATION_MATCHES, start=1)
    ]
    conn.executemany(
        """
        INSERT INTO application_match(
            id, offer_id, student_id, company_decision, student_decision,
            is_match, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )


def _seed_messages(conn: sqlite3.Connection) -> None:
    conn.executemany(
        "INSERT INTO message(match_id, sender_role, content, timestamp) VALUES (?, ?, ?, ?)",
        [(match_id, role, content, _demo_timestamp(index)) for index, (match_id, role, content) in enumerate(MESSAGES, start=1)],
    )


def _demo_timestamp(index: int) -> str:
    hour = 8 + index // 2
    minute = 5 if index % 2 else 20
    return f"2026-06-01T{hour:02d}:{minute:02d}:00"
