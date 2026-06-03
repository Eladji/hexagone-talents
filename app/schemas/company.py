from pydantic import BaseModel, Field


class UpdateCompanyProfileRequest(BaseModel):
    name: str = Field(min_length=1)
    email: str = Field(default="")
    phone: str = Field(default="")
