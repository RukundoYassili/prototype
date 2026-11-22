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
EOF
chmod 700 "$test_root/bin/docker"
export PATH="$test_root/bin:$PATH"
export MEDIA_DATA_DIR="$test_root/data" BACKUP_DIR="$test_root/backups" BACKUP_KEY_FILE="$test_root/key"
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
python3 - "$test_root/restored/media.sqlite" <<'PY'
import sqlite3,sys
c=sqlite3.connect(sys.argv[1]); assert c.execute('SELECT name FROM sample').fetchone()==('example',); c.close()
PY
echo 'Encrypted backup and restore passed.'
