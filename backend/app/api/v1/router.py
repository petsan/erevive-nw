from fastapi import APIRouter

from app.api.v1.admin import router as admin_router
from app.api.v1.auth import router as auth_router
from app.api.v1.donate import router as donate_router
from app.api.v1.health import router as health_router
from app.api.v1.items import router as items_router
from app.api.v1.pickups import router as pickups_router
from app.api.v1.users import router as users_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(donate_router)
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(items_router)
api_router.include_router(pickups_router)
api_router.include_router(admin_router)
