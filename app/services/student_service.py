from __future__ import annotations

from typing import Any

from fastapi import HTTPException

from app.core.database import get_connection
from app.core.database import row_to_dict
from app.schemas.student import CreateProjectRequest, UpdateSkillsRequest, UpdateStudentProfileRequest
from app.services.guards import ensure_skills, ensure_student, ensure_student_owns_skills


def get_student_profile(student_id: int) -> dict[str, Any]:
    with get_connection() as conn:
        ensure_student(conn, student_id)
        student = row_to_dict(conn.execute("SELECT * FROM student WHERE id = ?", (student_id,)).fetchone())
        skills = [
            row_to_dict(row)
            for row in conn.execute(
                """
                SELECT skill.id, skill.name, student_skill.weight
                FROM student_skill
                JOIN skill ON skill.id = student_skill.skill_id
                WHERE student_skill.student_id = ?
                ORDER BY student_skill.weight DESC, skill.name
                """,
                (student_id,),
            ).fetchall()
        ]
        project_rows = conn.execute(
            """
            SELECT id, title, description
            FROM project
            WHERE student_id = ?
            ORDER BY id DESC
            """,
            (student_id,),
        ).fetchall()

        projects = []
        for row in project_rows:
            project = row_to_dict(row)
            project["skills"] = [
                row_to_dict(skill_row)
                for skill_row in conn.execute(
                    """
                    SELECT skill.id, skill.name
                    FROM project_skill
                    JOIN skill ON skill.id = project_skill.skill_id
                    WHERE project_skill.project_id = ?
                    ORDER BY skill.name
                    """,
                    (project["id"],),
                ).fetchall()
            ]
            projects.append(project)

    return {**student, "skills": skills, "projects": projects}


def update_student_profile(payload: UpdateStudentProfileRequest) -> dict[str, Any]:
    with get_connection() as conn:
        ensure_student(conn, payload.student_id)
        conn.execute(
            """
            UPDATE student
            SET firstname = ?, lastname = ?, bio = ?, email = ?, phone = ?, avatar_url = ?
            WHERE id = ?
            """,
            (
                payload.firstname,
                payload.lastname,
                payload.bio,
                payload.email,
                payload.phone,
                payload.avatar_url,
                payload.student_id,
            ),
        )

    return {"success": True, "message": "Profil mis a jour avec succes."}


def update_student_skills(payload: UpdateSkillsRequest) -> dict[str, Any]:
    if len(payload.skills) > 5:
        raise HTTPException(
            status_code=400,
            detail={"message": "Erreur Validation : Vous ne pouvez pas selectionner plus de 5 competences."},
        )
    if any(item.weight <= 0 or item.weight > 100 for item in payload.skills):
        raise HTTPException(
            status_code=400,
            detail={"message": "Chaque competence sauvegardee doit avoir entre 1 et 100 points."},
        )
    if sum(item.weight for item in payload.skills) != 100:
        raise HTTPException(
            status_code=400,
            detail={"message": "Erreur Validation : Le budget total de points doit etre strictement egal a 100."},
        )
    if len({item.skill_id for item in payload.skills}) != len(payload.skills):
        raise HTTPException(status_code=400, detail={"message": "Une competence ne peut pas etre selectionnee deux fois."})

    with get_connection() as conn:
        ensure_student(conn, payload.student_id)
        ensure_skills(conn, [item.skill_id for item in payload.skills], approved_only=True)
        conn.execute("DELETE FROM student_skill WHERE student_id = ?", (payload.student_id,))
        conn.executemany(
            "INSERT INTO student_skill(student_id, skill_id, weight) VALUES (?, ?, ?)",
            [(payload.student_id, item.skill_id, item.weight) for item in payload.skills],
        )

    return {"success": True, "message": "Competences mises a jour avec succes."}


def create_project(payload: CreateProjectRequest) -> dict[str, Any]:
    if not payload.associated_skill_ids:
        raise HTTPException(status_code=400, detail={"message": "Le projet doit etre lie a au moins une competence."})

    skill_ids = sorted(set(payload.associated_skill_ids))
    with get_connection() as conn:
        ensure_student(conn, payload.student_id)
        ensure_student_owns_skills(conn, payload.student_id, skill_ids)
        cursor = conn.execute(
            "INSERT INTO project(student_id, title, description) VALUES (?, ?, ?)",
            (payload.student_id, payload.title, payload.description),
        )
        project_id = cursor.lastrowid
        conn.executemany(
            "INSERT INTO project_skill(project_id, skill_id) VALUES (?, ?)",
            [(project_id, skill_id) for skill_id in skill_ids],
        )

    return {
        "project_id": project_id,
        "student_id": payload.student_id,
        "title": payload.title,
        "associated_skill_ids": skill_ids,
    }
