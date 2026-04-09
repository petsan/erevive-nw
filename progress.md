# eRevive NW — Project Progress

## Project Goals
E-waste recycling platform for Seattle, WA. Users upload photos of electronics, get AI-powered descriptions, and schedule pickups. Admins see pricing data and manage operations.

## Tech Stack
- **Frontend:** Next.js 16 + React 19 + Tailwind CSS (7 routes)
- **Backend:** Python 3.12 FastAPI + SQLAlchemy 2.0 + Alembic (53 tests)
- **Database:** PostgreSQL 17 (SSL) — 6 tables
- **AI:** Multi-provider (LM Studio default, Claude, OpenAI, Gemini)
- **Cache:** Redis 7
- **Secrets:** HashiCorp Vault OSS
- **Deploy:** Docker Compose + Terraform (AWS/GCP/Azure)
- **CI:** GitHub Actions (test + deploy)
- **Repo:** github.com/petsan/erevive-nw

---

## Sprint 1: Foundation — COMPLETE
- [x] Git repo + GitHub (petsan/erevive-nw)
- [x] FastAPI scaffold with project structure
- [x] Next.js + Tailwind scaffold with landing page
- [x] Docker Compose (PostgreSQL, Redis, Vault, Nginx)
- [x] Database: users + audit_log (Alembic)
- [x] Auth: register, login, JWT access+refresh, /users/me (TDD)
- [x] Frontend: login + register pages with Zod validation
- [x] GitHub Actions CI pipeline

## Sprint 2: Item Donation + AI — COMPLETE
- [x] Database: items, images, pickups, price_lookups tables
- [x] File upload with magic byte validation (JPEG, PNG, GIF, WebP)
- [x] AI provider abstraction (base class, factory, fallback chain)
- [x] LM Studio adapter (default, OpenAI-compatible API)
- [x] Claude API adapter (Anthropic SDK)
- [x] OpenAI GPT-4o adapter
- [x] Google Gemini adapter
- [x] Image upload + AI identification endpoints
- [x] Frontend donation wizard (upload → AI identify → review → submit)
- [x] User dashboard with item listing

## Sprint 3: Pickup Scheduling — COMPLETE
- [x] Pickup CRUD service with time slot availability
- [x] Seattle ZIP validation (980xx, 981xx) in Pydantic + DB
- [x] 3 time windows/day, max 5 pickups per slot
- [x] Cancel pickup (only if status=requested)
- [x] Frontend pickup scheduler with date/time/address/ZIP
- [x] Real-time ZIP validation in UI

## Sprint 4: Admin + Pricing — COMPLETE
- [x] Admin-only endpoints with role checking
- [x] GET /admin/items — list all items with status filter
- [x] PATCH /admin/items/{id} — update item status
- [x] GET/PATCH /admin/pickups — manage all pickups
- [x] GET /admin/pricing/{item_id} — price lookup (ADMIN ONLY)
- [x] GET /admin/analytics — dashboard stats
- [x] Pricing service with eBay API placeholder
- [x] Non-admin users get 403 on all admin endpoints (tested)

## Sprint 5: Deployment — COMPLETE
- [x] Proxmox deploy script (SSH + rsync + docker compose)
- [x] Proxmox host setup script (Docker install, secrets generation)
- [x] Database backup script (pg_dump, 30-backup rotation)
- [x] TLS certificate generation script
- [x] Terraform: AWS (ECR, RDS, S3, ECS)
- [x] Terraform: GCP (Cloud Run, Cloud SQL, GCS)
- [x] Terraform: Azure (Container Apps, PostgreSQL, Blob)
- [x] Shared networking Terraform module

## Sprint 6: Polish + Hardening — COMPLETE
- [x] Playwright E2E test config + landing/auth specs
- [x] k6 load test (smoke test)
- [x] GitHub Actions deploy-to-proxmox on merge to main
- [x] All code linted (ruff, eslint)

---

## Summary

| Metric | Count |
|--------|-------|
| Backend tests | 53 |
| Frontend routes | 7 |
| API endpoints | ~25 |
| Database tables | 6 |
| AI providers | 4 |
| Cloud targets | 4 (Proxmox + AWS + GCP + Azure) |
| Deploy scripts | 4 |

### Key Architecture Decisions
- **AI fallback chain:** LM Studio → Claude → OpenAI → Gemini
- **Price data admin-only:** Enforced at API, DB, and UI layers
- **Seattle ZIP enforcement:** Pydantic validator + DB check constraint
- **Vault for secrets:** Self-hosted OSS, AppRole auth
- **Docker Compose first, Terraform for cloud:** Portable architecture
