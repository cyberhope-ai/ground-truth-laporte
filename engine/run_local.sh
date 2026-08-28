#!/usr/bin/env bash
# Stand up the Veritas engine locally and load LaPorte. Idempotent.
set -euo pipefail
cd "$(dirname "$0")/.."
NAME=veritas-db
if ! docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
  docker run -d --name "$NAME" -e POSTGRES_PASSWORD=veritas_local \
    -e POSTGRES_DB=veritas -p 55432:5432 pgvector/pgvector:pg16
fi
docker start "$NAME" >/dev/null 2>&1 || true
until docker exec "$NAME" pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
for f in engine/schema/*.sql; do
  echo "-- $f"; docker exec -i "$NAME" psql -U postgres -d veritas -q -v ON_ERROR_STOP=1 < "$f" || true
done
docker exec -i "$NAME" psql -U postgres -d veritas -q < engine/seed/laporte_seed.sql || true
echo; echo "=== PROMISE LEDGER ==="
docker exec "$NAME" psql -U postgres -d veritas -c \
  "SELECT promisor, metric_label, target_value, target_unit, deadline_stated AS dated, status FROM promise_ledger ORDER BY deadline_stated DESC;"
echo "psql: docker exec -it $NAME psql -U postgres -d veritas"
