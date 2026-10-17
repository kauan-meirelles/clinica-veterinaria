"""Admin auth models. Sessions themselves are httpOnly cookies + Mongo documents."""

from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class AdminUser(BaseModel):
    username: str
    name: str
