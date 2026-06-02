from pydantic import BaseModel, Field


class SkillWeightInput(BaseModel):
    skill_id: int
    weight: int


class UpdateSkillsRequest(BaseModel):
    student_id: int
    skills: list[SkillWeightInput]


class SuggestSkillRequest(BaseModel):
    student_id: int
    skill_name: str


class CreateProjectRequest(BaseModel):
    student_id: int
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    associated_skill_ids: list[int]


class UpdateStudentProfileRequest(BaseModel):
    student_id: int
    firstname: str
    lastname: str
    bio: str = Field(default="")
    email: str = Field(default="")
    phone: str = Field(default="")
    avatar_url: str = Field(default="")
