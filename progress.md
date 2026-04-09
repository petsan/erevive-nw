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
- **Frontend:** Next.js 15 + React 19 + Tailwind CSS
- **Backend:** Python FastAPI + SQLAlchemy + Alembic
- **Database:** PostgreSQL 17 (SSL)
- **Cache:** Redis 7
- **Secrets:** HashiCorp Vault OSS
- **Deploy:** Docker Compose → Terraform (multi-cloud)

---

## Sprint 1: Foundation (Current)

### Completed
- [x] Project plan approved
- [x] Name chosen: eRevive NW
- [x] Tech stack decided
- [x] Git repo initialized
- [x] .gitignore, Makefile created

### In Progress
- [ ] GitHub remote setup
- [ ] FastAPI backend scaffold
- [ ] Next.js frontend scaffold

### Upcoming
- [ ] Docker Compose (PostgreSQL, Redis, Vault, Nginx)
- [ ] Database schema + Alembic migrations (users, audit_log)
- [ ] Auth system (TDD): register, login, JWT, refresh
- [ ] Frontend auth pages (login, register)
- [ ] GitHub Actions CI pipeline

---

## Sprint 2: Item Donation + AI (Planned)
- Image upload + storage
- AI provider abstraction (LM Studio, Claude, OpenAI, Gemini)
- Donation wizard UI

## Sprint 3: Pickup Scheduling (Planned)
- Pickup CRUD + Seattle ZIP validation
- Calendar/time slot UI
- User dashboard

## Sprint 4: Admin + Pricing (Planned)
- Admin dashboard
- eBay price lookups (admin-only)
- Audit log

## Sprint 5: Deployment (Planned)
- Production Dockerfiles
- Proxmox deploy scripts
- Terraform modules (AWS/GCP/Azure)

## Sprint 6: Polish + Hardening (Planned)
- E2E tests (Playwright)
- Performance, accessibility, SEO
- Security hardening
