from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


def test_hash_password():
    password = "secure-password-123"
    hashed = hash_password(password)
    assert hashed != password
    assert hashed.startswith("$2b$")


def test_verify_password_correct():
    password = "secure-password-123"
    hashed = hash_password(password)
    assert verify_password(password, hashed) is True


def test_verify_password_incorrect():
    hashed = hash_password("correct-password")
    assert verify_password("wrong-password", hashed) is False


def test_create_access_token():
    token = create_access_token("user-123")
    assert isinstance(token, str)
    assert len(token) > 0


def test_create_refresh_token():
    token = create_refresh_token("user-123")
    assert isinstance(token, str)
    assert len(token) > 0


def test_decode_access_token():
    token = create_access_token("user-123", extra_claims={"role": "admin"})
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == "user-123"
    assert payload["type"] == "access"
    assert payload["role"] == "admin"


def test_decode_refresh_token():
    token = create_refresh_token("user-456")
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == "user-456"
    assert payload["type"] == "refresh"


def test_decode_invalid_token():
    payload = decode_token("invalid-token")
    assert payload is None


def test_decode_tampered_token():
    token = create_access_token("user-123")
    tampered = token[:-5] + "xxxxx"
    payload = decode_token(tampered)
    assert payload is None
