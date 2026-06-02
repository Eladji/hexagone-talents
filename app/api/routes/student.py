from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import require_role
from app.schemas.student import CreateProjectRequest, UpdateSkillsRequest, UpdateStudentProfileRequest
from app.services import matching_service, student_service

router = APIRouter(prefix="/student", tags=["Students"])


@router.put("/skills")
def update_student_skills(
    payload: UpdateSkillsRequest,
    auth: dict[str, Any] = Depends(require_role("ETUDIANT")),
) -> dict[str, Any]:
    if payload.student_id != auth["user_id"]:
        raise HTTPException(status_code=403, detail={"message": "Vous ne pouvez modifier que vos propres competences."})
    return student_service.update_student_skills(payload)


@router.post("/projects", status_code=201)
def create_project(
    payload: CreateProjectRequest,
    auth: dict[str, Any] = Depends(require_role("ETUDIANT")),
) -> dict[str, Any]:
    if payload.student_id != auth["user_id"]:
        raise HTTPException(status_code=403, detail={"message": "Vous ne pouvez creer que vos propres projets."})
    return student_service.create_project(payload)


@router.put("/profile")
def update_student_profile(
    payload: UpdateStudentProfileRequest,
    auth: dict[str, Any] = Depends(require_role("ETUDIANT")),
) -> dict[str, Any]:
    if payload.student_id != auth["user_id"]:
        raise HTTPException(status_code=403, detail={"message": "Vous ne pouvez modifier que votre propre profil."})
    return student_service.update_student_profile(payload)


@router.get("/{student_id}/profile")
def student_profile(
    student_id: int,
    _: dict[str, Any] = Depends(require_role("ETUDIANT", "ENTREPRISE", "STAFF")),
) -> dict[str, Any]:
    return student_service.get_student_profile(student_id)


@router.get("/{student_id}/likes")
def student_likes(
    student_id: int,
    _: dict[str, Any] = Depends(require_role("ETUDIANT")),
) -> list[dict[str, Any]]:
    return matching_service.student_likes(student_id)


@router.get("/{student_id}/matches")
def student_matches(
    student_id: int,
    _: dict[str, Any] = Depends(require_role("ETUDIANT", "ENTREPRISE")),
) -> list[dict[str, Any]]:
    return matching_service.student_matches(student_id)
