from typing import Literal

from pydantic import BaseModel


class ModerateSkillRequest(BaseModel):
    action: Literal["APPROVE", "REJECT"]


class ManageOfferRequest(BaseModel):
    action: Literal["ARCHIVE", "ACTIVATE"]


class ManageAccountRequest(BaseModel):
    action: Literal["SUSPEND", "ACTIVATE"]
