"""add_items_images_pickups_price_lookups

Revision ID: 1ffc910377e6
Revises: a3c03462ccbe
Create Date: 2026-04-08
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "1ffc910377e6"
down_revision: str | Sequence[str] | None = "a3c03462ccbe"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "pickups",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("status", sa.String(30), nullable=False, server_default="requested", index=True),
        sa.Column("scheduled_date", sa.Date, nullable=False),
        sa.Column("time_window", sa.String(50), nullable=False),
        sa.Column("address_line1", sa.String(255), nullable=False),
        sa.Column("address_line2", sa.String(255), nullable=True),
        sa.Column("city", sa.String(100), nullable=False, server_default="Seattle"),
        sa.Column("state", sa.String(2), nullable=False, server_default="WA"),
        sa.Column("zip_code", sa.String(10), nullable=False),
        sa.Column("special_instructions", sa.Text, nullable=True),
        sa.Column("admin_notes", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "items",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("category", sa.String(100), nullable=True, index=True),
        sa.Column("brand", sa.String(100), nullable=True),
        sa.Column("model_name", sa.String(255), nullable=True),
        sa.Column("condition", sa.String(50), nullable=True),
        sa.Column("ai_provider", sa.String(50), nullable=True),
        sa.Column("ai_confidence", sa.Float, nullable=True),
        sa.Column("ai_raw_response", sa.JSON, nullable=True),
        sa.Column("status", sa.String(30), nullable=False, server_default="pending", index=True),
        sa.Column("pickup_id", sa.String(36), sa.ForeignKey("pickups.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "images",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "item_id",
            sa.String(36),
            sa.ForeignKey("items.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("original_filename", sa.String(255), nullable=True),
        sa.Column("storage_path", sa.String(512), nullable=False),
        sa.Column("content_type", sa.String(100), nullable=False),
        sa.Column("file_size_bytes", sa.BigInteger, nullable=False),
        sa.Column("thumbnail_path", sa.String(512), nullable=True),
    )

    op.create_table(
        "price_lookups",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("item_id", sa.String(36), nullable=False, unique=True, index=True),
        sa.Column("avg_price", sa.Float, nullable=True),
        sa.Column("min_price", sa.Float, nullable=True),
        sa.Column("max_price", sa.Float, nullable=True),
        sa.Column("currency", sa.String(3), nullable=False, server_default="USD"),
        sa.Column("source", sa.String(50), nullable=False),
        sa.Column("sample_size", sa.Integer, nullable=True),
        sa.Column("raw_response", sa.JSON, nullable=True),
        sa.Column(
            "looked_up_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_table("price_lookups")
    op.drop_table("images")
    op.drop_table("items")
    op.drop_table("pickups")
