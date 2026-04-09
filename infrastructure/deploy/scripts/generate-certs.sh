#!/usr/bin/env bash
set -euo pipefail

# Generate self-signed TLS certificates for development/Proxmox
CERT_DIR="infrastructure/docker/nginx/ssl"
mkdir -p "$CERT_DIR"

echo "Generating self-signed TLS certificate..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt" \
    -subj "/C=US/ST=Washington/L=Seattle/O=eRevive NW/CN=erevive.local"

echo "Certificate generated at $CERT_DIR/"
echo "  - server.crt"
echo "  - server.key"
