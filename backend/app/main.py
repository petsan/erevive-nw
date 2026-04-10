import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.v1.router import api_router
from app.config import settings
from app.core.rate_limit import limiter

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure anonymous donor user exists
    from sqlalchemy import select

    from app.db.session import async_session
    from app.models.user import User

    async with async_session() as db:
        result = await db.execute(select(User).where(User.id == "anonymous"))
        if not result.scalar_one_or_none():
            db.add(
                User(
                    id="anonymous",
                    email="anonymous@erevivenw.local",
                    password_hash="nologin",
                    full_name="Anonymous Donor",
                    role="anonymous",
                )
            )
            await db.commit()

    # Validate JWT secret in non-debug mode
    if not settings.debug and settings.jwt_secret_key == "dev-secret-change-in-production":
        logger.critical("SECURITY: JWT secret is the default value! Set EREVIVE_JWT_SECRET_KEY.")

    yield
    # Shutdown


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        lifespan=lifespan,
        docs_url=f"{settings.api_prefix}/docs",
        openapi_url=f"{settings.api_prefix}/openapi.json",
    )

    # Rate limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

    app.include_router(api_router, prefix=settings.api_prefix)

    return app


app = create_app()
