"""Idempotent seed for Instituto Vida Animal.

Run: cd /app/backend && python seed.py
Only inserts when a collection is empty — safe to re-run. Not imported by server.py.
"""

import asyncio
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from lib.db import db, ensure_indexes
from models.appointments import Appointment
from models.catalog import Service, Veterinarian

SP = ZoneInfo("America/Sao_Paulo")

HERO_IMAGE = (
    "https://images.pexels.com/photos/22504402/pexels-photo-22504402.jpeg"
    "?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
)

SERVICES = [
    {
        "slug": "consulta-geral",
        "name": "Consulta Geral",
        "category": "clinica",
        "icon": "stethoscope",
        "price_from": 180.0,
        "duration_min": 30,
        "featured": True,
        "order": 1,
        "short_description": "Atendimento clínico completo para cães, gatos e outros pets, com anamnese detalhada.",
        "description": (
            "Nossa consulta geral avalia história clínica, peso, temperatura, hidratação e principais sistemas do "
            "organismo do seu pet. O tutor sai com um plano de cuidados claro e, quando necessário, com "
            "encaminhamento para especialistas da nossa equipe."
        ),
        "features": ["Anamnese completa", "Clínico geral e especialistas", "Acompanhamento contínuo"],
    },
    {
        "slug": "banho-tosa",
        "name": "Banho & Tosa",
        "category": "estetica",
        "icon": "scissors",
        "price_from": 90.0,
        "duration_min": 60,
        "featured": True,
        "order": 2,
        "short_description": "Higiene e estética com produtos hipoalergênicos, escolhidos para cada tipo de pele e pelagem.",
        "description": (
            "Ambiente tranquilo, secamento com temperatura controlada e tosa higiênica ou da raça, sempre com "
            "manejo respeitoso. Para felinos, contamos com uma área exclusiva, longe dos cães."
        ),
        "features": ["Produtos hipoalergênicos", "Tosa higiênica e da raça", "Espaço exclusivo para felinos"],
    },
    {
        "slug": "vacinacao",
        "name": "Vacinação & Imunização",
        "category": "prevencao",
        "icon": "syringe",
        "price_from": 120.0,
        "duration_min": 20,
        "featured": True,
        "order": 3,
        "short_description": "Protocolos atualizados para cães e gatos, com carteira de vacinação digital.",
        "description": (
            "Trabalhamos com vacinas nacionais e importadas, aplicadas somente após avaliação clínica. Enviamos "
            "lembretes das próximas doses para que o calendário do seu pet nunca fique para trás."
        ),
        "features": ["Protocolos atualizados", "Vacinas nacionais e importadas", "Carteira de vacinação digital"],
    },
    {
        "slug": "emergencia-24h",
        "name": "Emergência 24h",
        "category": "emergencia",
        "icon": "siren",
        "price_from": None,
        "price_note": "Plantão 24h · sob consulta",
        "duration_min": 60,
        "featured": True,
        "order": 4,
        "short_description": "Pronto atendimento dia e noite, com UTI veterinária e equipe de plantão.",
        "description": (
            "Plantão todos os dias do ano para urgências como acidentes, intoxicações, crises convulsivas e "
            "partos. Chegou em cima da hora? Ligue que a equipe já prepara a sala de estabilização."
        ),
        "features": ["Pronto atendimento dia e noite", "UTI veterinária", "Equipe de plantão dedicada"],
    },
    {
        "slug": "cirurgia",
        "name": "Cirurgia Veterinária",
        "category": "clinica",
        "icon": "heart-pulse",
        "price_from": 650.0,
        "duration_min": 120,
        "featured": False,
        "order": 5,
        "short_description": "Centro cirúrgico próprio com anestesia monitorada e pós-operatório completo.",
        "description": (
            "De cirurgias de rotina, como castração, a procedimentos ortopédicos: todo paciente recebe avaliação "
            "pré-anestésica, monitorização multiparamétrica e acompanhamento rigoroso na alta."
        ),
        "features": ["Anestesia monitorada", "Centro cirúrgico próprio", "Pós-operatório completo"],
    },
    {
        "slug": "exames",
        "name": "Exames & Diagnóstico por Imagem",
        "category": "prevencao",
        "icon": "microscope",
        "price_from": 220.0,
        "duration_min": 40,
        "featured": False,
        "order": 6,
        "short_description": "Laboratório interno, ultrassom e raio-X digitais com resultado em até 24h.",
        "description": (
            "Hemograma, bioquímicos, urálise, ultrassonografia e radiologia digital no mesmo endereço. Agiliza o "
            "diagnóstico e evita deslocamentos em momentos delicados."
        ),
        "features": ["Hemograma e bioquímicos", "Ultrassom e raio-X digitais", "Resultado em até 24h"],
    },
]

VETERINARIANS = [
    {
        "name": "Dr. Carlos Eduardo Oliveira",
        "title": "Cirurgião Veterinário · Ortopedia",
        "crmv": "CRMV-SP 31245",
        "specialties": ["Cirurgia geral", "Ortopedia", "Traumatologia"],
        "bio": (
            "Com 14 anos de centro cirúrgico, o Dr. Carlos lidera as cirurgias do Instituto Vida Animal. É "
            "referência em ortopedia e traumatologia, com mais de 3.500 procedimentos realizados sempre com "
            "anestesia monitorada e acompanhamento de perto no pós-operatório."
        ),
        "image_url": (
            "https://images.unsplash.com/photo-1770836037793-95bdbf190f71?crop=entropy&cs=srgb&fm=jpg"
            "&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwzfHx2ZXRlcmluYXJpYW4lMjBleGFtaW5pbmclMjBkb2d8ZW58MHx8fHwxNzkwMjk0NDQzfDA&ixlib=rb-4.1.0&q=85"
        ),
        "experience_years": 14,
        "shift": "Seg–Sex · 08h–17h",
        "order": 1,
    },
    {
        "name": "Dra. Marina Silva",
        "title": "Clínica Geral · Medicina Felina",
        "crmv": "CRMV-SP 29871",
        "specialties": ["Medicina felina", "Prevenção", "Geriatria"],
        "bio": (
            "Apaixonada por gatos muito antes de ser veterinária, a Dra. Marina conduz a área cat-friendly da "
            "clínica. Especialista em comportamento felino e medicina preventiva, também acompanha pacientes "
            "geriátricos com planos de cuidados individualizados."
        ),
        "image_url": (
            "https://images.pexels.com/photos/28644631/pexels-photo-28644631.jpeg"
            "?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        ),
        "experience_years": 11,
        "shift": "Seg–Sáb · 09h–18h",
        "order": 2,
    },
    {
        "name": "Dr. Lucas Mendes",
        "title": "Odontologia · Clínico Geral",
        "crmv": "CRMV-SP 33410",
        "specialties": ["Odontologia", "Clínica geral", "Nutrição"],
        "bio": (
            "O Dr. Lucas cuida da saúde bucal — uma das áreas mais negligenciadas da medicina veterinária — e "
            "atende clínico geral com foco em nutrição. É o responsável pelos check-ups anuais de rotina da "
            "maioria dos pacientes da casa."
        ),
        "image_url": (
            "https://images.unsplash.com/photo-1770836037816-4445dbd449fd?crop=entropy&cs=srgb&fm=jpg"
            "&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHw0fHx2ZXRlcmluYXJpYW4lMjBleGFtaW5pbmclMjBkb2d8ZW58MHx8fHwxNzkwMjk0NDQzfDA&ixlib=rb-4.1.0&q=85"
        ),
        "experience_years": 9,
        "shift": "Ter–Sáb · 10h–19h",
        "order": 3,
    },
    {
        "name": "Dra. Camila Ramos",
        "title": "Dermatologia · Imunização",
        "crmv": "CRMV-SP 30155",
        "specialties": ["Dermatologia", "Alergias", "Vacinação"],
        "bio": (
            "Especialista em pele e alergias, a Dra. Camila comanda o calendário de vacinação da clínica. "
            "Investiga coceiras crônicas, otites de repetição e dermatites alérgicas com protocolo próprio de "
            "diagnóstico em etapas."
        ),
        "image_url": (
            "https://images.pexels.com/photos/6234980/pexels-photo-6234980.jpeg"
            "?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        ),
        "experience_years": 12,
        "shift": "Seg–Qui · 08h–16h",
        "order": 4,
    },
]


def _day(offset_days: int) -> str:
    return (datetime.now(SP) + timedelta(days=offset_days)).strftime("%Y-%m-%d")


async def main() -> None:
    await ensure_indexes()

    if await db.services.count_documents({}) == 0:
        await db.services.insert_many([Service(**s).model_dump() for s in SERVICES])
        print(f"seed: {len(SERVICES)} serviços inseridos")
    else:
        print("seed: serviços já existem — pulando")

    if await db.veterinarians.count_documents({}) == 0:
        await db.veterinarians.insert_many([Veterinarian(**v).model_dump() for v in VETERINARIANS])
        print(f"seed: {len(VETERINARIANS)} veterinários inseridos")
    else:
        print("seed: veterinários já existem — pulando")

    if await db.appointments.count_documents({}) == 0:
        consulta = await db.services.find_one({"slug": "consulta-geral"}, {"_id": 0})
        cirurgia = await db.services.find_one({"slug": "cirurgia"}, {"_id": 0})
        exames = await db.services.find_one({"slug": "exames"}, {"_id": 0})
        marina = await db.veterinarians.find_one({"name": {"$regex": "Marina"}}, {"_id": 0})
        carlos = await db.veterinarians.find_one({"name": {"$regex": "Carlos"}}, {"_id": 0})

        samples = [
            {
                "tutor_name": "Mariana Costa",
                "email": "mariana.costa@exemplo.com",
                "phone": "(11) 98877-1234",
                "service_id": consulta["id"] if consulta else None,
                "service_name": consulta["name"] if consulta else "Consulta Geral",
                "vet_id": marina["id"] if marina else None,
                "vet_name": marina["name"] if marina else None,
                "date": _day(2),
                "time_slot": "09:00",
                "pet_name": "Thor",
                "pet_species": "Cão",
                "message": "Thor está coçando muito as orelhas desde o fim de semana.",
                "status": "pendente",
            },
            {
                "tutor_name": "Roberto Santos",
                "email": "roberto.santos@exemplo.com",
                "phone": "(11) 97654-3210",
                "service_id": cirurgia["id"] if cirurgia else None,
                "service_name": cirurgia["name"] if cirurgia else "Cirurgia Veterinária",
                "vet_id": carlos["id"] if carlos else None,
                "vet_name": carlos["name"] if carlos else None,
                "date": _day(1),
                "time_slot": "14:00",
                "pet_name": "Luna",
                "pet_species": "Gato",
                "message": "Avaliação pré-operatória para cirurgia de hérnia.",
                "status": "confirmado",
            },
            {
                "tutor_name": "Juliana Prado",
                "email": "juliana.prado@exemplo.com",
                "phone": "(11) 99123-4567",
                "service_id": exames["id"] if exames else None,
                "service_name": exames["name"] if exames else "Exames & Diagnóstico por Imagem",
                "vet_id": None,
                "vet_name": None,
                "date": _day(-3),
                "time_slot": "10:30",
                "pet_name": "Pipoca",
                "pet_species": "Cão",
                "message": None,
                "status": "concluido",
            },
        ]
        await db.appointments.insert_many(
            [Appointment(**s).model_dump() for s in samples]
        )
        print(f"seed: {len(samples)} agendamentos de exemplo inseridos")
    else:
        print("seed: agendamentos já existem — pulando")

    if await db.contact_messages.count_documents({}) == 0:
        await db.contact_messages.insert_many(
            [
                {
                    "name": "Fernanda Lima",
                    "email": "fernanda.lima@exemplo.com",
                    "message": "Olá! Vocês atendem furões? Gostaria de saber o valor da consulta para uma avaliação.",
                    "created_at": datetime.now(timezone.utc) - timedelta(hours=5),
                },
                {
                    "name": "Paulo Ferreira",
                    "email": "paulo.ferreira@exemplo.com",
                    "message": "Bom dia, quero agendar banho e tosa para minha golden. Vocês têm horário sábado à tarde?",
                    "created_at": datetime.now(timezone.utc) - timedelta(days=1),
                },
            ]
        )
        print("seed: 2 mensagens de contato inseridas")
    else:
        print("seed: mensagens de contato já existem — pulando")

    print("seed: concluído")


if __name__ == "__main__":
    asyncio.run(main())
