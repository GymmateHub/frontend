#!/usr/bin/env bash
# Stops the backend and Vite started by stack-up.sh and removes the e2e containers (and data).
set -uo pipefail
WORK="$(cd "$(dirname "$0")/.." && pwd)/.stack"
for p in backend frontend; do
  if [ -f "$WORK/$p.pid" ]; then kill "$(cat "$WORK/$p.pid")" 2>/dev/null; rm -f "$WORK/$p.pid"; fi
done
docker rm -f gm-e2e-postgres gm-e2e-redis gm-e2e-mailpit >/dev/null 2>&1
rm -f "$WORK/.env" "$(dirname "$WORK")/state.json"
echo "e2e stack stopped"
