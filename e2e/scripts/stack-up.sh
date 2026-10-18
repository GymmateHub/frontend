#!/usr/bin/env bash
# Starts an isolated stack for the end-to-end suite:
#   PostgreSQL 18, Redis and Mailpit in containers, the backend jar built from ../../Backend
#   (or $E2E_BACKEND_DIR) and the Vite dev server for this frontend.
# Nothing touches Backend/.env, shared databases or real mail/SMS: all email lands in Mailpit
# (http://localhost:18025) and SNS is disabled. Re-running rebuilds and restarts the backend.
set -euo pipefail

E2E_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$(dirname "$E2E_DIR")"
BACKEND_DIR="${E2E_BACKEND_DIR:-$FRONTEND_DIR/../Backend}"
WORK="$E2E_DIR/.stack"
mkdir -p "$WORK"

if [ -z "${JAVA_HOME:-}" ] && [ -x /usr/libexec/java_home ]; then
  JAVA_HOME="$(/usr/libexec/java_home -v 21)"
fi
export JAVA_HOME

container() { # name image args...
  local name=$1 image=$2; shift 2
  if docker ps -a --format '{{.Names}}' | grep -qx "$name"; then
    docker start "$name" >/dev/null
  else
    docker run -d --name "$name" "$@" "$image" >/dev/null
  fi
}

echo "Starting containers..."
container gm-e2e-postgres postgres:18-alpine \
  -e POSTGRES_DB=gymmate -e POSTGRES_USER=gymmate -e POSTGRES_PASSWORD=e2e_pw -p 55432:5432
container gm-e2e-redis redis:7-alpine -p 56379:6379
container gm-e2e-mailpit axllent/mailpit \
  -e MP_SMTP_AUTH_ACCEPT_ANY=1 -e MP_SMTP_AUTH_ALLOW_INSECURE=1 -p 18025:8025 -p 11025:1025

# The backend loads .env from its working directory (dotenv), so it runs from $WORK.
if [ ! -f "$WORK/.env" ]; then
  stripe_key=""
  if [ -f "$BACKEND_DIR/.env" ]; then
    stripe_key="$(grep -E '^STRIPE_API_KEY=sk_test_' "$BACKEND_DIR/.env" | cut -d= -f2- || true)"
  fi
  cat > "$WORK/.env" <<ENV
SPRING_PROFILES_ACTIVE=dev
APP_PORT=8080
FRONTEND_URL=http://localhost:5173
JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
JWT_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=604800000
PG_URI=jdbc:postgresql://localhost:55432/gymmate
PG_USER=gymmate
PG_PASSWORD=e2e_pw
DB_DRIVER=org.postgresql.Driver
DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect
JPA_DDL_AUTO=validate
FLYWAY_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=56379
REDIS_PASSWORD=
MAILTRAP_HOST=localhost
MAILTRAP_PORT=11025
MAILTRAP_USERNAME=e2e
MAILTRAP_PASSWORD=e2e
MAIL_HOST=localhost
MAIL_PORT=11025
MAIL_USERNAME=e2e
MAIL_PASSWORD=e2e
MAIL_FROM=noreply@gymmatehub.test
AWS_SNS_ENABLED=false
CORS_ALLOWED_ORIGINS=http://localhost:5173
CORS_ALLOW_CREDENTIALS=true
STRIPE_API_KEY=$stripe_key
STRIPE_WEBHOOK_SECRET=whsec_e2e
SPRING_AI_OPENAI_API_KEY=e2e-disabled
APP_WHITELABEL_ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n')
LOG_LEVEL_ROOT=INFO
LOG_LEVEL_GYMMATE=INFO
FILE_UPLOAD_DIR=./uploads
ENV
fi

echo "Building backend from $BACKEND_DIR..."
(cd "$BACKEND_DIR" && ./mvnw -q clean package -DskipTests)
cp "$BACKEND_DIR"/target/gymmate-backend-*.jar "$WORK/app.jar"

if [ -f "$WORK/backend.pid" ]; then kill "$(cat "$WORK/backend.pid")" 2>/dev/null || true; sleep 2; fi
(cd "$WORK" && exec "$JAVA_HOME/bin/java" -jar app.jar > backend.log 2>&1 < /dev/null) &
echo $! > "$WORK/backend.pid"

if ! { [ -f "$WORK/frontend.pid" ] && kill -0 "$(cat "$WORK/frontend.pid")" 2>/dev/null; }; then
  (cd "$FRONTEND_DIR" && VITE_API_URL=http://localhost:8080/api VITE_STRIPE_PUBLISHABLE_KEY= \
    exec npx vite --port 5173 --strictPort > "$WORK/frontend.log" 2>&1 < /dev/null) &
  echo $! > "$WORK/frontend.pid"
fi

echo -n "Waiting for backend"
for _ in $(seq 1 60); do
  if curl -sf http://localhost:8080/actuator/health >/dev/null; then echo " up"; break; fi
  echo -n "."; sleep 2
done
curl -sf http://localhost:8080/actuator/health >/dev/null || { echo; echo "Backend failed to start:"; tail -40 "$WORK/backend.log"; exit 1; }
curl -sf http://localhost:5173/ >/dev/null || { sleep 3; curl -sf http://localhost:5173/ >/dev/null || { echo "Frontend failed to start:"; tail -20 "$WORK/frontend.log"; exit 1; }; }

echo "Stack ready: app http://localhost:5173, API http://localhost:8080, mail http://localhost:18025"
