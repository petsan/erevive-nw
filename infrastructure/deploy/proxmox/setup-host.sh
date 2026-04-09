#!/usr/bin/env bash
set -euo pipefail

# eRevive NW - One-time Proxmox host setup
# Run: ssh root@192.168.0.100 'bash -s' < setup-host.sh

echo "=== eRevive NW: Setting up Proxmox host ==="

# 1. Install Docker
if ! command -v docker &> /dev/null; then
    echo "[1/4] Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo "[1/4] Docker already installed"
fi

# 2. Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
    echo "[2/4] Installing Docker Compose..."
    apt-get update && apt-get install -y docker-compose-plugin
else
    echo "[2/4] Docker Compose already installed"
fi

# 3. Create project directory
echo "[3/4] Setting up directory structure..."
mkdir -p /opt/erevive-nw
mkdir -p /opt/erevive-nw/backups

# 4. Generate .env file if not exists
if [ ! -f /opt/erevive-nw/infrastructure/docker/.env ]; then
    echo "[4/4] Generating .env with random secrets..."
    DB_PASS=$(openssl rand -base64 32 | tr -d /+= | head -c 32)
    REDIS_PASS=$(openssl rand -base64 32 | tr -d /+= | head -c 32)
    JWT_SECRET=$(openssl rand -base64 64 | tr -d /+= | head -c 64)

    mkdir -p /opt/erevive-nw/infrastructure/docker
    cat > /opt/erevive-nw/infrastructure/docker/.env << EOF
DB_PASSWORD=$DB_PASS
REDIS_PASSWORD=$REDIS_PASS
JWT_SECRET_KEY=$JWT_SECRET
VAULT_ENABLED=false
LMSTUDIO_BASE_URL=http://host.docker.internal:1234/v1
EOF
    echo "Secrets generated and saved to .env"
else
    echo "[4/4] .env already exists"
fi

echo "=== Setup complete! ==="
echo "Next: Run deploy.sh to deploy the application"
