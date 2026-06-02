from pydantic import BaseModel, Field


class CreateMessageRequest(BaseModel):
    content: str = Field(min_length=1)
    # Note: sender_role is determined from authentication, not provided by client
