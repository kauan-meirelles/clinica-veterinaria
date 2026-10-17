"""Public catalog: the veterinary team (read-only, ordered)."""

from fastapi import APIRouter

from lib.db import db
from models.catalog import Veterinarian

router = APIRouter(tags=["veterinarians"])


@router.get("/veterinarians", response_model=list[Veterinarian])
async def list_veterinarians():
    docs = await db.veterinarians.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return [Veterinarian(**doc) for doc in docs]
