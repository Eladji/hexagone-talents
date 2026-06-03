from fastapi import APIRouter

from app.api.routes import auth, company, health, messages, offers, skills, staff, student, swipes

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(skills.router)
api_router.include_router(student.router)
api_router.include_router(company.router)
api_router.include_router(offers.router)
api_router.include_router(swipes.router)
api_router.include_router(messages.router)
api_router.include_router(staff.router)
