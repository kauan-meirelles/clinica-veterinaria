<div align="center">

# 🐾 Instituto Vida Animal

**Site de uma clínica veterinária com agendamento online e painel administrativo.**
O tutor conhece a clínica, escolhe o serviço e o veterinário e marca a consulta. A equipe acompanha tudo pelo painel.

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
<br/>
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

> [!NOTE]
> Este é um **projeto de estudo**, criado para praticar desenvolvimento full-stack. O Instituto Vida Animal é uma clínica fictícia, e os veterinários, preços e depoimentos do site são dados de exemplo.

---

## 💭 Sobre

A proposta foi construir o site completo de uma clínica, indo além de uma página institucional: o visitante consegue **agendar uma consulta de verdade**, e a equipe da clínica tem um **painel protegido por login** para acompanhar e atualizar os agendamentos.

O visual segue uma paleta verde-água clínica, com animações suaves que respeitam a configuração de "reduzir movimento" do sistema operacional.

## ✨ Funcionalidades

### Para o tutor

| | Página | O que tem |
|---|---|---|
| 🏠 | **Início** | Destaque do plantão, números da clínica, serviços em destaque, equipe, depoimentos e chamada para agendar |
| 🩺 | **Serviços** | Catálogo com filtro por categoria: clínica, estética, prevenção e emergência |
| 👩‍⚕️ | **Veterinários** | Equipe com especialidades, CRMV e turno, com perfil completo em uma janela |
| 📅 | **Agendamento** | Formulário completo com confirmação e número de protocolo |
| 🏛️ | **Sobre** | História, missão, visão e valores, linha do tempo e protocolos de segurança |
| ✉️ | **Contato** | Formulário que envia a mensagem direto para o painel da equipe |

### Para a equipe (`/admin`)

- 📊 **Indicadores:** total de agendamentos, pendentes, confirmados e concluídos
- 🔎 **Busca e filtro** por tutor, pet, serviço e status
- 🔄 **Troca de status direto na tabela:** pendente → confirmado → concluído (ou cancelado)
- 📬 **Aba de mensagens** recebidas pelo formulário de contato

## 📅 Regras do agendamento

O agendamento foi a parte em que mais pratiquei **validação dos dois lados** (frontend e backend):

- **Sem datas no passado:** a validação é feita no servidor, no fuso de São Paulo, então não depende do relógio do computador do usuário.
- **Horários de 30 em 30 minutos**, das 08:00 às 19:30.
- **Telefone com máscara** `(11) 99999-9999` e e-mail validado.
- **Links diretos:** os botões "Agendar" dos serviços e dos veterinários levam ao formulário já preenchido (`/agendamentos?service=...` ou `?vet=...`).

## 🛠️ Tecnologias

**Frontend:** React 19 + TypeScript, Vite, Tailwind CSS 4, shadcn/ui, TanStack Query, React Router 7, Motion, Sonner

**Backend:** Python, FastAPI, MongoDB (driver assíncrono `motor`), Pydantic

### O que eu pratiquei aqui

- **Área administrativa protegida:** login com sessão guardada no banco e enviada num cookie `httpOnly`. As sessões expiram sozinhas depois de 7 dias (índice TTL do MongoDB), e as rotas da equipe devolvem `401` para quem não está logado.
- **Rotas protegidas no frontend:** se a sessão cair, o painel redireciona para o login.
- **Estado com TanStack Query:** ao mudar o status de um agendamento, a tabela e os indicadores atualizam sem recarregar a página.
- **API REST organizada por recurso:** `services`, `veterinarians`, `appointments`, `contact` e `auth`.
- **Acessibilidade:** animações que respeitam a preferência de movimento reduzido e componentes acessíveis do shadcn/ui.

## 📂 Estrutura

```
clinica-veterinaria/
├── backend/
│   ├── server.py        # app FastAPI, CORS e registro das rotas
│   ├── seed.py          # popula o banco com serviços, veterinários e exemplos
│   ├── lib/             # conexão e índices do Mongo, datas e fuso horário
│   ├── models/          # schemas Pydantic
│   └── routers/         # services, veterinarians, appointments, contact, auth
└── frontend/
    └── src/
        ├── pages/       # Início, Serviços, Veterinários, Sobre, Contato, Agendamentos, Admin
        ├── components/  # Navbar, Footer, ServiceCard, VetCard, StatusBadge... + shadcn/ui
        └── lib/         # cliente da API, sessão e formatação
```

## 🚀 Como rodar

Você precisa de **Python 3.11+**, **Node.js 20+** e um **MongoDB** (local ou [MongoDB Atlas](https://www.mongodb.com/atlas) gratuito).

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env     # ajuste o MONGO_URL se precisar
python seed.py           # cria os serviços, veterinários e agendamentos de exemplo
python -m uvicorn server:app --reload --port 8001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abra **http://localhost:3000**. O Vite repassa as chamadas `/api` para o backend na porta 8001.

### 🔑 Acesso ao painel

Entre em **http://localhost:3000/admin/login** com usuário `admin` e senha `vidaanimal2025`. A tela também tem um botão que preenche os dados de demonstração. Para trocar as credenciais, edite `ADMIN_USERNAME` e `ADMIN_PASSWORD` no `backend/.env`.

## 🔌 API

<details>
<summary><b>Ver todas as rotas</b></summary>

<br/>

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/services` | Público | Catálogo de serviços |
| `GET` | `/api/veterinarians` | Público | Equipe |
| `POST` | `/api/appointments` | Público | Cria agendamento |
| `POST` | `/api/contact` | Público | Envia mensagem de contato |
| `POST` | `/api/auth/login` | Público | Login do painel |
| `GET` | `/api/auth/me` | Equipe | Usuário logado |
| `GET` | `/api/appointments` | Equipe | Lista agendamentos |
| `PATCH` | `/api/appointments/{id}` | Equipe | Atualiza o status |
| `GET` | `/api/contact` | Equipe | Lista mensagens de contato |

Com o backend rodando, a documentação interativa fica em **http://localhost:8001/docs**.

</details>

---

<div align="center">

Feito com 💚 por **[Kauan Meirelles](https://github.com/kauan-meirelles)**

</div>
