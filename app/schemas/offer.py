from pydantic import BaseModel, Field


class CreateOfferRequest(BaseModel):
    company_name: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    required_skill_ids: list[int]
    contact_email: str | None = None
    contact_phone: str | None = None
