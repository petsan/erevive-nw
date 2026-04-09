#!/usr/bin/env bash
set -euo pipefail

# eRevive NW - Proxmox Deploy Script
# Deploys to root@192.168.0.100

REMOTE_HOST="root@192.168.0.100"
REMOTE_DIR="/opt/erevive-nw"
COMPOSE_FILE="infrastructure/docker/docker-compose.yml"

echo "=== eRevive NW: Deploying to Proxmox ==="

# 1. Sync project to remote
echo "[1/5] Syncing project files..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.venv' \
    --exclude='__pycache__' \
    --exclude='.next' \
    --exclude='*.pyc' \
    --exclude='backend/uploads/*' \
    --exclude='backend/test.db' \
    . "$REMOTE_HOST:$REMOTE_DIR/"

# 2. Build images on remote
echo "[2/5] Building Docker images..."
ssh "$REMOTE_HOST" "cd $REMOTE_DIR && docker compose -f $COMPOSE_FILE build"

# 3. Run database migrations
echo "[3/5] Running database migrations..."
ssh "$REMOTE_HOST" "cd $REMOTE_DIR && docker compose -f $COMPOSE_FILE run --rm backend alembic upgrade head" || echo "Warning: Migration may need manual review"

# 4. Deploy with rolling restart
echo "[4/5] Deploying services..."
ssh "$REMOTE_HOST" "cd $REMOTE_DIR && docker compose -f $COMPOSE_FILE up -d"

# 5. Health check
echo "[5/5] Running health check..."
sleep 5
for i in {1..10}; do
    if ssh "$REMOTE_HOST" "curl -sf http://localhost/api/v1/health" > /dev/null 2>&1; then
        echo "Health check passed!"
        echo "=== Deploy complete! ==="
        echo "Access at: http://192.168.0.100"
        exit 0
    fi
    echo "Waiting for services... ($i/10)"
    sleep 3
done

echo "Warning: Health check did not pass within 30s. Check logs:"
echo "  ssh $REMOTE_HOST 'cd $REMOTE_DIR && docker compose logs --tail=50'"
exit 1
