# eRevive NW — Project Progress

## Project Goals
Build an e-waste recycling platform for Seattle, WA and surrounding areas. Users upload photos of electronics, get AI-powered descriptions, and schedule pickups. Admins see pricing data and manage operations.

**Key features:**
- Photo upload with AI identification (LM Studio default, Claude/OpenAI/Gemini fallback)
- Pickup scheduling for Seattle metro area
- Admin dashboard with used price lookups (admin-only)
- Secure: Vault for secrets, TLS, encrypted DB
- Cloud-flexible: Proxmox first, then AWS/GCP/Azure

## Tech Stack
- **Frontend:** Next.js 16 + React 19 + Tailwind CSS
- **Backend:** Python 3.12 FastAPI + SQLAlchemy 2.0 + Alembic
- **Database:** PostgreSQL 17 (SSL)
- **Cache:** Redis 7
- **Secrets:** HashiCorp Vault OSS
- **Deploy:** Docker Compose → Terraform (multi-cloud)
- **CI:** GitHub Actions
- **Repo:** github.com/petsan/erevive-nw

---

## Sprint 1: Foundation — COMPLETE

### Completed
- [x] Project plan approved, name chosen: eRevive NW
- [x] Git repo initialized + pushed to github.com/petsan/erevive-nw
- [x] .gitignore, Makefile created
- [x] FastAPI backend scaffold (api/v1, core, models, schemas, services, ai, db, storage)
- [x] Next.js frontend scaffold with Tailwind (landing page, header, footer)
- [x] Docker Compose: PostgreSQL, Redis, Vault (optional), Nginx reverse proxy
- [x] Docker Compose dev overrides (hot reload, exposed ports)
- [x] Database schema: users + audit_log tables (Alembic migration)
- [x] Auth system (TDD): register, login, JWT access+refresh, /users/me
- [x] Frontend auth pages: login + register with Zod validation
- [x] GitHub Actions CI: backend tests, frontend build, security scan
- [x] 29 backend tests passing (unit + integration)
- [x] All code linted (ruff, eslint)

### Key Files
- `backend/app/core/security.py` — JWT + bcrypt
- `backend/app/services/auth_service.py` — register, authenticate, get_user_by_id
- `backend/app/api/v1/auth.py` — auth endpoints
- `frontend/src/app/page.tsx` — landing page
- `frontend/src/app/login/page.tsx` — login page
- `frontend/src/app/register/page.tsx` — register page
- `infrastructure/docker/docker-compose.yml` — full stack

---

## Sprint 2: Item Donation + AI (Next Up)

### Planned
- [ ] Database: items + images tables (Alembic migration)
- [ ] File upload service (local storage, magic byte validation)
- [ ] AI provider abstraction (base class, factory, fallback chain)
- [ ] LM Studio adapter (default)
- [ ] Claude API adapter
- [ ] OpenAI GPT-4o adapter
- [ ] Google Gemini adapter
- [ ] Image upload + identification endpoints (TDD)
- [ ] Frontend donation wizard (upload → AI result → review → submit)

## Sprint 3: Pickup Scheduling (Planned)
- Pickup CRUD + Seattle ZIP validation (981xx, 980xx)
- Calendar/time slot UI
- User dashboard

## Sprint 4: Admin + Pricing (Planned)
- Admin dashboard
- eBay price lookups (admin-only)
- Audit log viewer

## Sprint 5: Deployment (Planned)
- Production Dockerfiles
- Proxmox deploy scripts (root@192.168.0.100)
- Terraform modules (AWS/GCP/Azure)

## Sprint 6: Polish + Hardening (Planned)
- E2E tests (Playwright)
- Performance, accessibility, SEO
- Security hardening
