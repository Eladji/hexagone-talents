from pydantic import BaseModel

from app.core.types import Decision, Role


class SwipeRequest(BaseModel):
    offer_id: int
    student_id: int
    actor_role: Role
    decision: Decision
