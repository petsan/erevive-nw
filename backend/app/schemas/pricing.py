from datetime import datetime

from pydantic import BaseModel


class PriceLookupResponse(BaseModel):
    id: str
    item_id: str
    avg_price: float | None
    min_price: float | None
    max_price: float | None
    currency: str
    source: str
    sample_size: int | None
    looked_up_at: datetime

    model_config = {"from_attributes": True}
