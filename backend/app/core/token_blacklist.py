"""Token blacklist using an in-memory set (Redis in production)."""

import logging

_blacklist: set[str] = set()
logger = logging.getLogger(__name__)


def revoke_token(jti: str) -> None:
    _blacklist.add(jti)
    logger.info("Token revoked: %s...", jti[:16])


def is_token_revoked(jti: str) -> bool:
    return jti in _blacklist
