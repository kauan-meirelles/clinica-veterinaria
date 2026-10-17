"""Shared catalog models: services offered by the clinic and its veterinarians."""

import uuid

from pydantic import BaseModel, Field


def new_id() -> str:
    return str(uuid.uuid4())


class Service(BaseModel):
    id: str = Field(default_factory=new_id)
    slug: str
    name: str
    short_description: str
    description: str
    # clinica | estetica | prevencao | emergencia
    category: str
    price_from: float | None = None
    price_note: str | None = None
    duration_min: int = 30
    icon: str = "stethoscope"
    image_url: str | None = None
    features: list[str] = []
    featured: bool = False
    order: int = 0


class Veterinarian(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    title: str
    crmv: str
    specialties: list[str] = []
    bio: str
    image_url: str | None = None
    experience_years: int = 0
    shift: str = "Seg–Sex · 08h–17h"
    order: int = 0