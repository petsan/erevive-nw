import logging

import hvac

from app.config import settings

logger = logging.getLogger(__name__)


class VaultClient:
    def __init__(self):
        self._client: hvac.Client | None = None

    def connect(self) -> None:
        if not settings.vault_enabled:
            logger.info("Vault disabled, using environment variables for secrets")
            return

        self._client = hvac.Client(url=settings.vault_addr)

        if settings.vault_role_id and settings.vault_secret_id:
            self._client.auth.approle.login(
                role_id=settings.vault_role_id,
                secret_id=settings.vault_secret_id,
            )
            logger.info("Authenticated to Vault via AppRole")
        else:
            logger.warning("Vault enabled but no AppRole credentials provided")

    def read_secret(self, path: str) -> dict:
        if not self._client:
            return {}
        try:
            response = self._client.secrets.kv.v2.read_secret_version(path=path)
            return response["data"]["data"]
        except Exception:
            logger.exception("Failed to read secret at %s", path)
            return {}

    @property
    def is_connected(self) -> bool:
        if not self._client:
            return False
        try:
            return self._client.is_authenticated()
        except Exception:
            return False


vault_client = VaultClient()
