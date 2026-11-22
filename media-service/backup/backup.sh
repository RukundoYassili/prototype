#!/usr/bin/env bash
set -Eeuo pipefail
# Run as root by a timer. The key must also be kept securely off the VPS.
: "${MEDIA_DATA_DIR:?}" "${BACKUP_DIR:?}" "${BACKUP_KEY_FILE:?}"
container=${MEDIA_CONTAINER:-vuga-media}
mkdir -p "$BACKUP_DIR"
test -r "$BACKUP_KEY_FILE"
name="media-$(date -u +%Y%m%dT%H%M%SZ).tar.gz.gpg"
tmp="$BACKUP_DIR/$name.tmp"
stopped=0
snapshot=
cleanup() {
  local status=$?
  if [[ $stopped == 1 ]]; then docker start "$container" >/dev/null || status=1; fi
  if [[ $status != 0 ]]; then rm -f -- "$tmp"; fi
  if [[ -n $snapshot ]]; then
    case "$snapshot" in /tmp/vuga-editorial-backup.*) rm -rf -- "$snapshot";; *) status=1;; esac
  fi
  exit "$status"
}
trap cleanup EXIT
[[ $(docker inspect -f '{{.State.Running}}' "$container") == true ]]
docker stop "$container" >/dev/null
stopped=1
umask 027
if [[ -n ${EDITORIAL_DB_CONTAINER:-} ]]; then
  : "${EDITORIAL_DB_NAME:?}" "${EDITORIAL_DB_USER:?}"
  umask 077
  snapshot=$(mktemp -d /tmp/vuga-editorial-backup.XXXXXXXX)
  mkdir "$snapshot/__editorial__"
  docker exec "$EDITORIAL_DB_CONTAINER" pg_dump -U "$EDITORIAL_DB_USER" -d "$EDITORIAL_DB_NAME" --format=custom --no-owner --no-privileges > "$snapshot/__editorial__/database.dump"
  test -s "$snapshot/__editorial__/database.dump"
  tar -czf - -C "$MEDIA_DATA_DIR" . -C "$snapshot" __editorial__ | gpg --batch --yes --pinentry-mode loopback --passphrase-file "$BACKUP_KEY_FILE" --symmetric --cipher-algo AES256 --output "$tmp"
else
  tar -C "$MEDIA_DATA_DIR" -czf - . | gpg --batch --yes --pinentry-mode loopback --passphrase-file "$BACKUP_KEY_FILE" --symmetric --cipher-algo AES256 --output "$tmp"
fi
test -s "$tmp"
chmod 0640 "$tmp"
mv -- "$tmp" "$BACKUP_DIR/$name"
docker start "$container" >/dev/null
stopped=0
# Keep the newest 30 complete backups; filenames are timestamps.
mapfile -t backups < <(find "$BACKUP_DIR" -maxdepth 1 -type f -name 'media-????????T??????Z.tar.gz.gpg' -printf '%f\n' | sort -r)
for ((i=30; i<${#backups[@]}; i++)); do rm -- "$BACKUP_DIR/${backups[$i]}"; done
echo "Encrypted backup created: $name"
