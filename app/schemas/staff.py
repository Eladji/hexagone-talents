from typing import Literal

from pydantic import BaseModel


class ModerateSkillRequest(BaseModel):
    action: Literal["APPROVE", "REJECT"]
