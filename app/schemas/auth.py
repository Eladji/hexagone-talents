from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str
    firstname: str
    lastname: str
    email: EmailStr
    bio: str = Field(default="")
    phone: str = Field(default="")
    avatar_url: str = Field(default="")
