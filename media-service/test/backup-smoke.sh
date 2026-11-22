#!/usr/bin/env bash
set -Eeuo pipefail
test_root=$(mktemp -d "${TMPDIR:-/tmp}/vuga-media-backup-test.XXXXXXXX")
trap 'rm -rf -- "$test_root"' EXIT
mkdir -p "$test_root/bin" "$test_root/data/images" "$test_root/backups" "$test_root/restored" "$test_root/gpg"
chmod 700 "$test_root/gpg"
export GNUPGHOME="$test_root/gpg"
cat > "$test_root/bin/docker" <<'EOF'
#!/usr/bin/env bash
if [[ "$1" == inspect ]]; then echo true; fi
if [[ "$1" == stop || "$1" == start ]]; then printf '%s\n' "$1" >> "$VUGA_TEST_LOG"; fi
if [[ "$1" == exec ]]; then
  [[ ${FAIL_PG_DUMP:-0} != 1 ]] || exit 1
  printf 'example-postgres-dump'
fi
EOF
chmod 700 "$test_root/bin/docker"
export PATH="$test_root/bin:$PATH"
export VUGA_TEST_LOG="$test_root/docker.log"
export MEDIA_DATA_DIR="$test_root/data" BACKUP_DIR="$test_root/backups" BACKUP_KEY_FILE="$test_root/key"
export EDITORIAL_DB_CONTAINER=editorial-test EDITORIAL_DB_NAME=editorial EDITORIAL_DB_USER=editorial
openssl rand -base64 48 > "$BACKUP_KEY_FILE"
printf 'example photo' > "$MEDIA_DATA_DIR/images/example.webp"
python3 - "$MEDIA_DATA_DIR/media.sqlite" <<'PY'
import sqlite3,sys
c=sqlite3.connect(sys.argv[1]); c.execute('CREATE TABLE sample (name TEXT)'); c.execute('INSERT INTO sample VALUES (?)',('example',)); c.commit(); c.close()
PY
bash "${1:?path to backup.sh}"
archive=$(find "$BACKUP_DIR" -name '*.gpg' -type f -print -quit)
gpg --batch --yes --pinentry-mode loopback --passphrase-file "$BACKUP_KEY_FILE" --decrypt "$archive" | tar -xzf - -C "$test_root/restored"
cmp "$MEDIA_DATA_DIR/images/example.webp" "$test_root/restored/images/example.webp"
[[ $(cat "$test_root/restored/__editorial__/database.dump") == example-postgres-dump ]]
python3 - "$test_root/restored/media.sqlite" <<'PY'
import sqlite3,sys
c=sqlite3.connect(sys.argv[1]); assert c.execute('SELECT name FROM sample').fetchone()==('example',); c.close()
PY
mkdir "$test_root/failure-backups"
export BACKUP_DIR="$test_root/failure-backups" FAIL_PG_DUMP=1
if bash "${1:?path to backup.sh}"; then echo 'Failed dump was accepted' >&2; exit 1; fi
[[ $(find "$BACKUP_DIR" -type f | wc -l) -eq 0 ]]
[[ $(tail -1 "$VUGA_TEST_LOG") == start ]]
echo 'Encrypted backup and restore passed.'
