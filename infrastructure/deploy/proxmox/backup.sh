#!/usr/bin/env bash
set -euo pipefail

# eRevive NW - Database backup script
REMOTE_HOST="root@192.168.0.100"
BACKUP_DIR="/opt/erevive-nw/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="erevive_backup_${TIMESTAMP}.sql.gz"

echo "=== eRevive NW: Database Backup ==="

ssh "$REMOTE_HOST" "
    cd /opt/erevive-nw && \
    docker compose -f infrastructure/docker/docker-compose.yml exec -T postgres \
        pg_dump -U erevive_app erevive | gzip > $BACKUP_DIR/$BACKUP_FILE && \
    echo 'Backup created: $BACKUP_DIR/$BACKUP_FILE' && \
    ls -lh $BACKUP_DIR/$BACKUP_FILE && \
    # Keep only last 30 backups
    cd $BACKUP_DIR && ls -t erevive_backup_*.sql.gz | tail -n +31 | xargs -r rm
"

echo "=== Backup complete ==="
