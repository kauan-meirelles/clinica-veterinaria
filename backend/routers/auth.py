"""Simple admin auth: env credentials + Mongo-backed session tokens in an httpOnly cookie."""

import os
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, Request, Response

from lib.db import db
from models.auth import AdminUser, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])

SESSION_COOKIE = "iva_admin_session"
SESSION_TTL_DAYS = 7


def _credentials() -> tuple[str, str]:
    return (
        os.environ.get("ADMIN_USERNAME", "admin"),
        os.environ.get("ADMIN_PASSWORD", "vidaanimal2025"),
    )


async def require_admin(request: Request) -> AdminUser:
    """Dependency-style guard: raises 401 unless a valid, unexpired session cookie is present."""
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        raise HTTPException(status_code=401, detail="Faça login para acessar esta área.")
    session = await db.sessions.find_one({"token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Sessão inválida. Faça login novamente.")
    expires_at = session.get("expires_at")
    if isinstance(expires_at, datetime):
        if expires_at.tzinfo is None:  # motor hands back naive datetimes — normalise before comparing
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="Sessão expirada. Faça login novamente.")
    return AdminUser(username=session["username"], name=session.get("name", "Equipe"))


@router.post("/login", response_model=AdminUser)
async def login(input: LoginRequest, response: Response):
    username, password = _credentials()
    if input.username.strip() != username or input.password != password:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos.")

    token = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)
    await db.sessions.insert_one(
        {
            "token": token,
            "username": username,
            "name": "Equipe Instituto Vida Animal",
            "expires_at": expires_at,
        }
    )
    response.set_cookie(
        SESSION_COOKIE,
        token,
        httponly=True,
        samesite="lax",
        max_age=SESSION_TTL_DAYS * 24 * 3600,
    )
    return AdminUser(username=username, name="Equipe Instituto Vida Animal")


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        await db.sessions.delete_one({"token": token})
    response.delete_cookie(SESSION_COOKIE)
    return {"ok": True}


@router.get("/me", response_model=AdminUser)
async def me(request: Request):
    return await require_admin(request)
