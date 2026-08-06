# Goriber Gari

<p align="center">
  <img src="frontend/public/carshop.png" alt="Goriber Gari logo" width="130" />
</p>

<p align="center">
  <strong>A full-stack vehicle marketplace for discovering, comparing, purchasing, and managing cars.</strong>
</p>

<p align="center">
  React 19 · Vite · FastAPI · SQLAlchemy · PostgreSQL · Docker
</p>

---

## Overview

Goriber Gari is a database-driven car marketplace. Customers can browse curated
collections, inspect vehicle specifications and reviews, complete a guided
checkout, make payments, download invoices, and review previous purchases.
Administrators have separate tools for managing cars, users, employees,
inventory, orders, and database reports.

The public interface uses a responsive dark automotive design. The backend is a
FastAPI application with SQLAlchemy models and PostgreSQL persistence.

![banner](attachments/goribergari.png)

## Main features

### Customer experience

- Animated vehicle landing page with curated car collections
- Searchable categories and detailed vehicle specifications
- Authentication and user profiles
- Availability, inventory, pricing, and customer reviews
- Three-stage purchase, confirmation, and payment flow
- Downloadable PDF purchase invoices
- Responsive desktop, tablet, and mobile interfaces

### Administration

- Manage cars, users, employees, and orders
- Insert vehicles and update pricing or availability
- View inventory, purchase, shipping, and employee reports
- Run category, pricing, review, and vehicle-type queries

### Developer experience

- One-command Windows, Ubuntu, and macOS local startup
- Shared `/api` contract between the frontend and backend
- Backend health endpoint and interactive OpenAPI documentation
- Separate production containers for the frontend and backend
- GitHub Actions publishing to GitHub Container Registry

## System architecture

The following Mermaid diagram is rendered directly by GitHub. Its standalone
source is available at [docs/system-architecture.mmd](docs/system-architecture.mmd).

```mermaid
flowchart TB
    User["Customer / Administrator"]

    subgraph Client["Frontend · React 19 + Vite"]
        Browser["Browser UI"]
        Router["React Router"]
        State["AuthContext + CartContext"]
        APIClient["Axios API client"]
        PDF["Client-side PDF invoices"]

        Browser --> Router
        Router --> State
        State --> APIClient
        Router --> PDF
    end

    subgraph Server["Backend · FastAPI"]
        App["FastAPI application"]
        Health["Health + OpenAPI endpoints"]
        Routers["Domain routers<br/>cars · users · orders · reviews · admin"]
        ORM["SQLAlchemy models and sessions"]

        App --> Health
        App --> Routers
        Routers --> ORM
    end

    Database[("PostgreSQL<br/>users · vehicles · inventory<br/>purchases · shipping · reviews")]

    User -->|"HTTPS / browser"| Browser
    APIClient -->|"JSON over /api"| App
    ORM -->|"SQL transactions"| Database

    subgraph Delivery["Development and delivery"]
        Scripts["Cross-platform local launchers"]
        GitHub["GitHub repository"]
        Actions["GitHub Actions"]
        Registry["GitHub Container Registry"]
        FrontendImage["Frontend image<br/>Nginx + static SPA"]
        BackendImage["Backend image<br/>Uvicorn + FastAPI"]

        Scripts -.-> Client
        Scripts -.-> Server
        GitHub --> Actions
        Actions --> FrontendImage
        Actions --> BackendImage
        FrontendImage --> Registry
        BackendImage --> Registry
    end
```

## Request flow

1. React Router loads the requested customer or administration screen.
2. Components use the shared Axios client to call `/api`.
3. FastAPI validates the request and dispatches it to the appropriate router.
4. SQLAlchemy reads or updates PostgreSQL through a managed database session.
5. FastAPI returns JSON, and React updates the interface.
6. Invoice PDFs are generated inside the browser after purchase information is
   returned.

## Repository structure

```text
.
├── .github/workflows/          # Container publishing automation
├── attachments/                # Project reports, diagrams, and logo assets
├── backend/
│   ├── app/
│   │   ├── models/             # API schemas, routes, and database models
│   │   ├── admin.py
│   │   ├── database.py
│   │   ├── main.py
│   │   └── queries.py
│   ├── .env.example
│   ├── database.sql
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── public/                 # Favicons, social icons, and public images
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.jsx
│   │   └── routes.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docs/
│   └── system-architecture.mmd
├── docker-compose.yml
├── start-local.cmd
├── start-local.ps1
└── start-local.sh
```

## Prerequisites

For normal local development:

- Node.js 20 or newer
- Python 3.11 or newer
- A reachable PostgreSQL database

For container-based development:

- Docker Engine or Docker Desktop with Compose

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/hasanmehediii/CSE-2211-Project.git
cd CSE-2211-Project
```

### 2. Configure PostgreSQL

Create the private backend environment file:

```powershell
# Windows
Copy-Item backend\.env.example backend\.env
```

```bash
# Ubuntu or macOS
cp backend/.env.example backend/.env
```

Update `DATABASE_URL` in `backend/.env`:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=prefer&channel_binding=prefer
```

`channel_binding` must be a valid PostgreSQL value such as `prefer`, `require`,
or `disable`. Never commit `backend/.env`; it is intentionally ignored by Git.

If you are creating a new database, use
[backend/database.sql](backend/database.sql) as the schema reference.

### 3. Start both applications

Windows:

```powershell
.\start-local.cmd
```

Ubuntu or macOS:

```bash
bash ./start-local.sh
```

The first run creates `backend/.venv` and installs missing dependencies.

| Service | Local URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:8000` |
| API documentation | `http://localhost:8000/docs` |
| Health check | `http://localhost:8000/health` |

To refresh backend dependencies, use `.\start-local.ps1 -Install` on Windows or
`bash ./start-local.sh --install` on Ubuntu/macOS.

## Manual development

Run the backend:

```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\activate

# Ubuntu/macOS
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Run the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

## Docker

Ensure `backend/.env` exists, start Docker, and run:

```bash
docker compose up --build
```

The frontend container serves the production SPA through Nginx and proxies
`/api` requests to the backend container.

## GitHub Packages

[.github/workflows/publish-containers.yml](.github/workflows/publish-containers.yml)
publishes separate multi-architecture images when:

- `main` receives a push
- A version tag such as `v2.0.0` is pushed
- The workflow is started manually

Published package names:

```text
ghcr.io/<repository-owner>/goriber-gari-frontend
ghcr.io/<repository-owner>/goriber-gari-backend
```

The workflow uses the repository-provided `GITHUB_TOKEN` and requires
`packages: write` permission.

## API overview

All application routes use the `/api` prefix.

| Area | Base route |
|---|---|
| Cars | `/api/cars` |
| Categories | `/api/categories` |
| Users | `/api/users` |
| Purchases | `/api/purchases` |
| Orders | `/api/orders` |
| Order items | `/api/order_items` |
| Reviews | `/api/reviews` |
| Inventory | `/api/car_inventory` |
| Employees | `/api/employees` |
| Reports | `/api/queries` |

The complete, current endpoint list is available from FastAPI at `/docs`.

## Useful commands

```bash
# Frontend production build
cd frontend && npm run build

# Frontend linting
cd frontend && npm run lint

# Validate Docker Compose
docker compose config

# Check backend health
curl http://localhost:8000/health
```

## Troubleshooting

### The frontend cannot reach the backend

- Confirm `http://localhost:8000/health` returns `{"status":"ok"}`.
- Confirm requests use `/api`, for example `/api/categories/`.
- Start both applications with the provided root launcher.
- Verify that ports `5173` and `8000` are available.

### PostgreSQL rejects `channel_binding`

Check `backend/.env`. Values such as `requireto` are invalid. Use `prefer`,
`require`, or `disable`.

### Docker commands cannot connect

Start Docker Desktop or the Docker daemon before running Compose commands.

## Project material

- [Project report](attachments/CSE2211_DBMS_Project.pdf)
- [Presentation](attachments/DBMS.pptx)
- [Database documentation](attachments/DBMS.pdf)
- [Project video](https://youtu.be/nJaVLU3WCqw?si=9pdGbxrtDZ9v3xI2)
- [Project video with narration](https://youtu.be/7hatLweTOT8)

## Contributor

Mehedi Hasan — [mehedi-2022415897@cs.du.ac.bd](mailto:mehedi-2022415897@cs.du.ac.bd)
