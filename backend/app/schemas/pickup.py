from datetime import date, datetime

from pydantic import BaseModel, field_validator

SEATTLE_ZIP_PREFIXES = ("980", "981")


class PickupCreate(BaseModel):
    scheduled_date: date
    time_window: str
    address_line1: str
    address_line2: str | None = None
    city: str = "Seattle"
    state: str = "WA"
    zip_code: str
    special_instructions: str | None = None
    item_ids: list[str] = []

    @field_validator("zip_code")
    @classmethod
    def validate_seattle_zip(cls, v: str) -> str:
        if not any(v.startswith(p) for p in SEATTLE_ZIP_PREFIXES):
            raise ValueError("Pickup service is only available in the Seattle metro area (ZIP 980xx/981xx)")
        return v


class PickupResponse(BaseModel):
    id: str
    user_id: str
    status: str
    scheduled_date: date
    time_window: str
    address_line1: str
    address_line2: str | None
    city: str
    state: str
    zip_code: str
    special_instructions: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class PickupAdminUpdate(BaseModel):
    status: str | None = None
    admin_notes: str | None = None
