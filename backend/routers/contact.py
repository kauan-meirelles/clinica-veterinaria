"""Contact messages: public submission + admin-only inbox."""

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Request

from lib.db import db
from models.contact import ContactMessage, ContactMessageCreate
from routers.auth import require_admin

router = APIRouter(tags=["contact"])


def _normalize(doc: dict) -> dict:
    created = doc.get("created_at")
    if isinstance(created, datetime) and created.tzinfo is None:
        doc["created_at"] = created.replace(tzinfo=timezone.utc)
    return doc


@router.post("/contact", response_model=ContactMessage, status_code=201)
async def create_contact_message(input: ContactMessageCreate):
    message = ContactMessage(
        name=input.name.strip(),
        email=input.email,
        message=input.message.strip(),
    )
    await db.contact_messages.insert_one(message.model_dump())
    return message


@router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages(request: Request):
    await require_admin(request)
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [ContactMessage(**_normalize(doc)) for doc in docs]
