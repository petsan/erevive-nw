from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class Pickup(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "pickups"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="requested", index=True)
    scheduled_date: Mapped[str] = mapped_column(Date, nullable=False)
    time_window: Mapped[str] = mapped_column(String(50), nullable=False)
    address_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line2: Mapped[str | None] = mapped_column(String(255), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False, default="Seattle")
    state: Mapped[str] = mapped_column(String(2), nullable=False, default="WA")
    zip_code: Mapped[str] = mapped_column(String(10), nullable=False)
    special_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
