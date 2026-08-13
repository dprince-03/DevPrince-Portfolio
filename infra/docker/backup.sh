#!/usr/bin/env bash
# Manual/cron Postgres backup for the dev or prod compose stack.
# Usage: ./backup.sh [output-dir]   (defaults to ./backups next to this script)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="${1:-$SCRIPT_DIR/backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
POSTGRES_USER="${POSTGRES_USER:-devprince}"
POSTGRES_DB="${POSTGRES_DB:-devprince_portfolio}"

mkdir -p "$OUT_DIR"

docker compose -f "$SCRIPT_DIR/docker-compose.yml" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$OUT_DIR/backup-$STAMP.sql.gz"

echo "Wrote $OUT_DIR/backup-$STAMP.sql.gz"
echo "Restore with: gunzip -c $OUT_DIR/backup-$STAMP.sql.gz | docker compose -f $SCRIPT_DIR/docker-compose.yml exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB"
