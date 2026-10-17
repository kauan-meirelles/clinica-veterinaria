"""Appointments: public booking creation + admin-only listing and status management."""

import re
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException, Request
from pymongo import ReturnDocument

from lib.db import db
from lib.dates import today_iso
from models.appointments import Appointment, AppointmentCreate, AppointmentStatusUpdate
from routers.auth import require_admin

router = APIRouter(tags=["appointments"])

VALID_STATUSES = ("pendente", "confirmado", "cancelado", "concluido")
TIME_SLOT_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _normalize(doc: dict) -> dict:
    created = doc.get("created_at")
    if isinstance(created, datetime) and created.tzinfo is None:
        doc["created_at"] = created.replace(tzinfo=timezone.utc)
    return doc


@router.post("/appointments", response_model=Appointment, status_code=201)
async def create_appointment(input: AppointmentCreate):
    date = input.date.strip()
    if not DATE_RE.match(date):
        raise HTTPException(status_code=422, detail="Data inválida. Escolha uma data no calendário.")
    if date < today_iso():
        raise HTTPException(
            status_code=422,
            detail="Não é possível agendar para uma data passada. Escolha hoje ou uma data futura.",
        )

    slot = input.time_slot.strip()
    if not TIME_SLOT_RE.match(slot):
        raise HTTPException(status_code=422, detail="Horário inválido. Escolha um horário entre 08:00 e 19:30.")

    if len(input.tutor_name.strip()) < 3:
        raise HTTPException(status_code=422, detail="Informe o nome completo do tutor (mínimo 3 caracteres).")
    if not input.phone.strip():
        raise HTTPException(status_code=422, detail="Informe um telefone para contato.")
    if not input.pet_name.strip():
        raise HTTPException(status_code=422, detail="Informe o nome do pet.")

    service_id = input.service_id
    service_name = (input.service_name or "").strip() or "Atendimento veterinário"
    if service_id:
        service = await db.services.find_one({"id": service_id}, {"_id": 0, "name": 1})
        if service:
            service_name = service["name"]

    vet_id = input.vet_id or None
    vet_name = None
    if vet_id:
        vet = await db.veterinarians.find_one({"id": vet_id}, {"_id": 0, "name": 1})
        if vet:
            vet_name = vet["name"]
        else:
            vet_id = None

    appointment = Appointment(
        tutor_name=input.tutor_name.strip(),
        email=input.email,
        phone=input.phone.strip(),
        service_id=service_id,
        service_name=service_name,
        vet_id=vet_id,
        vet_name=vet_name,
        date=date,
        time_slot=slot,
        pet_name=input.pet_name.strip(),
        pet_species=input.pet_species.strip() or "Outro",
        message=(input.message or "").strip() or None,
    )
    await db.appointments.insert_one(appointment.model_dump())
    return appointment


@router.get("/appointments", response_model=List[Appointment])
async def list_appointments(request: Request):
    await require_admin(request)
    docs = await db.appointments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Appointment(**_normalize(doc)) for doc in docs]


@router.patch("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment_status(appointment_id: str, input: AppointmentStatusUpdate, request: Request):
    await require_admin(request)
    if input.status not in VALID_STATUSES:
        raise HTTPException(status_code=422, detail="Status inválido.")
    updated = await db.appointments.find_one_and_update(
        {"id": appointment_id},
        {"$set": {"status": input.status}},
        return_document=ReturnDocument.AFTER,
        projection={"_id": 0},
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado.")
    return Appointment(**_normalize(updated))
