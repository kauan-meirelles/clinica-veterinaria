"""Contact channel models: messages sent through the contact page."""

from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field

from models.catalog import new_id


class ContactMessage(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
