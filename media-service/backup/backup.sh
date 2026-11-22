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
cleanup() {
  local status=$?
  if [[ $stopped == 1 ]]; then docker start "$container" >/dev/null || status=1; fi
  if [[ $status != 0 ]]; then rm -f -- "$tmp"; fi
  exit "$status"
}
trap cleanup EXIT
[[ $(docker inspect -f '{{.State.Running}}' "$container") == true ]]
docker stop "$container" >/dev/null
stopped=1
umask 027
tar -C "$MEDIA_DATA_DIR" -czf - . | gpg --batch --yes --pinentry-mode loopback --passphrase-file "$BACKUP_KEY_FILE" --symmetric --cipher-algo AES256 --output "$tmp"
test -s "$tmp"
chmod 0640 "$tmp"
mv -- "$tmp" "$BACKUP_DIR/$name"
docker start "$container" >/dev/null
stopped=0
# Keep the newest 30 complete backups; filenames are timestamps.
mapfile -t backups < <(find "$BACKUP_DIR" -maxdepth 1 -type f -name 'media-????????T??????Z.tar.gz.gpg' -printf '%f\n' | sort -r)
for ((i=30; i<${#backups[@]}; i++)); do rm -- "$BACKUP_DIR/${backups[$i]}"; done
echo "Encrypted backup created: $name"
