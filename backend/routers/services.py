"""Public catalog: clinic services (read-only, ordered)."""

from fastapi import APIRouter

from lib.db import db
from models.catalog import Service

router = APIRouter(tags=["services"])


@router.get("/services", response_model=list[Service])
async def list_services():
    docs = await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return [Service(**doc) for doc in docs]
