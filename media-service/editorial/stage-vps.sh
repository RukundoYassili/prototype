#!/usr/bin/env bash
set -Eeuo pipefail
# Isolated QA only. This script never starts, stops, or modifies production containers.
[[ $EUID -eq 0 ]]
release=/opt/vuga-editorial-stage-20261122
stage=/var/lib/vuga-editorial-stage-20261122
network=vuga-editorial-qa-20261122
db=vuga-editorial-db-qa-20261122
app=vuga-editorial-app-qa-20261122
volume=vuga-editorial-db-qa-20261122
image=vuga-editorial-qa:20261122
[[ -f "$release/media-service/Dockerfile" && -f "$release/source-export.json" && ! -e "$stage" ]]
! docker inspect "$db" >/dev/null 2>&1
! docker inspect "$app" >/dev/null 2>&1
! docker network inspect "$network" >/dev/null 2>&1
! docker volume inspect "$volume" >/dev/null 2>&1
if ss -ltn | awk '{print $4}' | grep -Eq '(^|:)13119$'; then echo 'QA port 13119 is already in use.' >&2; exit 1; fi
created_db=0
created_app=0
finished=0
cleanup() {
  status=$?
  if [[ $finished != 1 ]]; then
    [[ $created_app == 0 ]] || docker stop "$app" >/dev/null 2>&1 || true
    [[ $created_db == 0 ]] || docker stop "$db" >/dev/null 2>&1 || true
    echo 'QA stopped without changing the production website. Inspect the isolated staging resources before retrying.' >&2
  fi
  exit "$status"
}
trap cleanup EXIT
umask 077
install -d -m 0700 "$stage" "$stage/secrets" "$stage/backups" "$stage/restored"
install -d -m 0700 -o 10001 -g 10001 "$stage/data"
dbpass=$(openssl rand -hex 32)
qapass=$(openssl rand -hex 32)
printf 'POSTGRES_USER=editorial\nPOSTGRES_PASSWORD=%s\nPOSTGRES_DB=editorial_staging\n' "$dbpass" > "$stage/secrets/postgres.env"
printf 'MEDIA_DATA_DIR=/data\nMEDIA_ORIGIN=http://127.0.0.1:13119\nEDITORIAL_DATABASE_URL=postgresql://editorial:%s@%s:5432/editorial_staging\nNODE_ENV=development\nMEDIA_INSECURE_DEV=1\n' "$dbpass" "$db" > "$stage/secrets/app.env"
openssl rand -hex 48 > "$stage/secrets/backup.key"
docker network create --internal "$network" >/dev/null
docker volume create "$volume" >/dev/null
created_db=1
docker run -d --name "$db" --network "$network" --memory 768m --env-file "$stage/secrets/postgres.env" -v "$volume:/var/lib/postgresql/data" postgres:17.12 >/dev/null
for attempt in {1..60}; do
  if docker exec "$db" pg_isready -U editorial -d editorial_staging >/dev/null 2>&1; then break; fi
  sleep 1
done
docker exec "$db" pg_isready -U editorial -d editorial_staging >/dev/null
docker exec -i "$db" psql -v ON_ERROR_STOP=1 -U editorial -d editorial_staging < "$release/media-service/editorial/001-private-drafts.sql" >/dev/null
docker build -t "$image" "$release/media-service" >/dev/null
created_app=1
docker run -d --name "$app" --network "$network" --memory 512m -p 127.0.0.1:13119:3000 --env-file "$stage/secrets/app.env" -v "$stage/data:/data" -v "$release/source-export.json:/app/source-export.json:ro" "$image" >/dev/null
docker exec -e QA_ADMIN_PASSWORD="$qapass" "$app" node --input-type=module -e "import {openDatabase} from './src/database.mjs'; import {createUser} from './src/security.mjs'; const db=openDatabase('/data'); createUser(db,'qa-admin',process.env.QA_ADMIN_PASSWORD,'admin'); db.close();"
docker exec -e EDITORIAL_IMPORT_ISOLATED=1 "$app" node editorial/import-source-staging.mjs /app/source-export.json
for attempt in {1..30}; do
  if curl -fsS http://127.0.0.1:13119/api/media/health >/dev/null 2>&1; then break; fi
  sleep 1
done
export QA_ADMIN_PASSWORD="$qapass"
python3 "$release/media-service/editorial/qa-staging.py"
unset QA_ADMIN_PASSWORD qapass dbpass
env MEDIA_DATA_DIR="$stage/data" BACKUP_DIR="$stage/backups" BACKUP_KEY_FILE="$stage/secrets/backup.key" MEDIA_CONTAINER="$app" EDITORIAL_DB_CONTAINER="$db" EDITORIAL_DB_NAME=editorial_staging EDITORIAL_DB_USER=editorial bash "$release/media-service/backup/backup.sh"
archive=$(find "$stage/backups" -maxdepth 1 -name 'media-*.tar.gz.gpg' -type f | sort | tail -1)
[[ -n "$archive" ]]
gpg --batch --no-tty --pinentry-mode loopback --passphrase-file "$stage/secrets/backup.key" --decrypt "$archive" | tar --no-same-owner --no-same-permissions -xzf - -C "$stage/restored"
python3 - "$stage/restored/media.sqlite" <<'PY'
import sqlite3,sys
c=sqlite3.connect(sys.argv[1]); assert c.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
assert c.execute("SELECT count(*) FROM users WHERE username='qa-admin' AND role='admin' AND disabled=0").fetchone()[0]==1
PY
docker cp "$stage/restored/__editorial__/database.dump" "$db:/tmp/editorial-qa.dump"
docker exec "$db" createdb -U editorial editorial_restore
docker exec "$db" pg_restore -U editorial -d editorial_restore --no-owner --no-privileges /tmp/editorial-qa.dump
[[ $(docker exec "$db" psql -U editorial -d editorial_restore -Atc 'SELECT count(*) FROM editorial_drafts') == 55 ]]
[[ $(docker exec "$db" psql -U editorial -d editorial_restore -Atc 'SELECT count(*) FROM editorial_drafts WHERE source_key IS NOT NULL') == 54 ]]
curl -fsS http://127.0.0.1:13119/api/media/health >/dev/null
docker stop "$app" "$db" >/dev/null
finished=1
echo 'Isolated QA and real PostgreSQL backup restore passed. QA containers stopped; production was unchanged.'
