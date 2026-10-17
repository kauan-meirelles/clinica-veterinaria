# Instituto Vida Animal — Especificação do app

Clínica veterinária em pt-BR: site institucional + agendamento online + painel admin.
Stack: React 19 + Vite (porta 3000) + Tailwind v4 + shadcn/base-ui | FastAPI (porta 8001) | MongoDB local (db `app`).

## Rotas públicas (SiteLayout: EmergencyBanner + Navbar glass + Footer)
- `/` Início — hero com imagem e card "Plantão aberto agora", stats, serviços em destaque (API), bento de diferenciais, equipe (API), depoimentos, CTA final
- `/servicos` — catálogo com filtro por categoria (dados da API `GET /api/services`)
- `/veterinarios` — diretório da equipe com dialog de perfil (`GET /api/veterinarians`)
- `/sobre` — história, missão/visão/valores, linha do tempo 2010–2025, protocolos de segurança
- `/contato` — infos + formulário que grava em `contact_messages` (`POST /api/contact`) com toasts sonner
- `/agendamentos` — agendamento online (`POST /api/appointments`): tutor, email, telefone com máscara (11) 99999-9999, serviço, veterinário, data (não pode ser passada — validação server em America/Sao_Paulo), horário (08:00–19:30, 30 em 30 min), pet/espécie, mensagem. Confirmação visual em dialog com protocolo. Aceita deep-links `?service=<slug>` e `?vet=<id>`
- `/admin/login` — login do painel; `/admin` — dashboard protegido; `*` — NotFound

## Painel admin (/admin)
- KPIs (total/pendentes/confirmados/concluídos), filtro por status, busca por tutor/pet/serviço, tabela com troca de status inline (`PATCH /api/appointments/{id}` + invalidação react-query), aba de mensagens de contato (`GET /api/contact`)
- Credenciais: admin / vidaanimal2025 (env `ADMIN_USERNAME`/`ADMIN_PASSWORD` em backend/.env); botão de preenchimento demo na tela de login
- Sessão: cookie httpOnly `iva_admin_session` + coleção `sessions` (TTL 7 dias); rotas admin-only: `GET /api/appointments`, `PATCH /api/appointments/{id}`, `GET /api/contact`
- Guard frontend: useQuery ["auth"] → `GET /api/auth/me`; 401 → Navigate /admin/login; logout via `endSession("/admin/login")` (limpa cache react-query)

## Dados (Mongo `app`, seed idempotente em backend/seed.py)
- `services` (6): slug, name, category (clinica|estetica|prevencao|emergencia), price_from/price_note, duration_min, icon, features, featured, order
- `veterinarians` (4): name, title, crmv, specialties, bio, image_url, shift, order
- `appointments`: tutor_name, email, phone, service_id/service_name, vet_id/vet_name, date (YYYY-MM-DD, ≥ hoje em America/Sao_Paulo), time_slot, pet_name, pet_species, message, status (pendente|confirmado|cancelado|concluido), created_at (UTC aware)
- `contact_messages`: name, email, message, created_at
- `sessions`: token, username, expires_at (índice TTL)
- Índices declarados em backend/lib/db.py INDEXES; seed: `cd /app/backend && python seed.py`

## Design
Teal/esmeralda clínico (#0D9488 primária, #042F2E inverso), fontes Outfit (heading) + DM Sans (sans) via @fontsource-variable, animações motion/react com MotionConfig reducedMotion="user", keyframe float próprio, toasts sonner bottom-right. Todos os elementos interativos têm data-testid kebab-case.