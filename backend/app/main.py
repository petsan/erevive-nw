from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure anonymous donor user exists
    from app.db.session import async_session
    from app.models.user import User
    from sqlalchemy import select

    async with async_session() as db:
        result = await db.execute(select(User).where(User.id == "anonymous"))
        if not result.scalar_one_or_none():
            db.add(User(
                id="anonymous",
                email="anonymous@erevivenw.local",
                password_hash="nologin",
                full_name="Anonymous Donor",
                role="anonymous",
            ))
            await db.commit()

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

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.api_prefix)

    return app


app = create_app()
