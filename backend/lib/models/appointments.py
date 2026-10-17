"""Appointment models: online booking requests made by pet tutors."""

from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field

from models.catalog import new_id

AppointmentStatus = str  # validated by Literal below, kept as alias for readers

_STATUSES = ("pendente", "confirmado", "cancelado", "concluido")


class Appointment(BaseModel):
    id: str = Field(default_factory=new_id)
    tutor_name: str
    email: EmailStr
    phone: str
    service_id: str | None = None
    service_name: str
    vet_id: str | None = None
    vet_name: str | None = None
    date: str  # YYYY-MM-DD (São Paulo local day)
    time_slot: str  # HH:MM
    pet_name: str
    pet_species: str  # Cão | Gato | Outro
    message: str | None = None
    status: str = "pendente"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AppointmentCreate(BaseModel):
    tutor_name: str
    email: EmailStr
    phone: str
    service_id: str | None = None
    service_name: str | None = None
    vet_id: str | None = None
    date: str
    time_slot: str
    pet_name: str
    pet_species: str
    message: str | None = None


class AppointmentStatusUpdate(BaseModel):
    status: str
