from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "erevive-nw-backend"}


@router.get("/health/ready")
async def readiness_check():
    # TODO: Check DB and Vault connectivity
    return {"status": "ready"}
