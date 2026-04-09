.PHONY: help dev test lint build deploy-proxmox clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
dev: ## Start all services in dev mode
	docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.dev.yml up --build

dev-backend: ## Start backend only with hot reload
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Start frontend only with hot reload
	cd frontend && npm run dev

# Testing
test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests
	cd backend && python -m pytest tests/ -v --tb=short

test-frontend: ## Run frontend tests
	cd frontend && npm test

test-e2e: ## Run end-to-end tests
	cd tests && npx playwright test

test-coverage: ## Run tests with coverage
	cd backend && python -m pytest tests/ -v --cov=app --cov-report=html
	cd frontend && npm test -- --coverage

# Linting
lint: lint-backend lint-frontend ## Run all linters

lint-backend: ## Lint backend code
	cd backend && python -m ruff check app/ tests/
	cd backend && python -m ruff format --check app/ tests/

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

# Building
build: ## Build all Docker images
	docker compose -f infrastructure/docker/docker-compose.yml build

# Database
db-migrate: ## Run database migrations
	cd backend && alembic upgrade head

db-revision: ## Create new migration (usage: make db-revision MSG="description")
	cd backend && alembic revision --autogenerate -m "$(MSG)"

db-downgrade: ## Rollback last migration
	cd backend && alembic downgrade -1

# Deployment
deploy-proxmox: ## Deploy to Proxmox server
	./infrastructure/deploy/proxmox/deploy.sh

setup-proxmox: ## Initial Proxmox host setup
	./infrastructure/deploy/proxmox/setup-host.sh

# Infrastructure
vault-init: ## Initialize Vault
	docker compose -f infrastructure/docker/docker-compose.yml exec vault-init /init-vault.sh

certs: ## Generate self-signed TLS certificates
	./infrastructure/deploy/scripts/generate-certs.sh

# Cleanup
clean: ## Remove build artifacts and caches
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .next -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name dist -exec rm -rf {} + 2>/dev/null || true
