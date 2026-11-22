#!/usr/bin/env bash
set -Eeuo pipefail
# Run from an independently verified, root-owned release directory.
release=${1:?Usage: stage.sh /opt/verified-release}
[[ $EUID -eq 0 ]]
[[ -f "$release/media-service/Dockerfile" && -f "$release/dist/index.html" ]]
[[ ! -e /var/lib/vuga-media ]]
! docker inspect vuga-media >/dev/null 2>&1
! docker network inspect vuga-media-net >/dev/null 2>&1
install -d -o 10001 -g 10001 -m 0700 /var/lib/vuga-media
docker build -t vuga-media:20261122 "$release/media-service"
docker run --rm --network none --read-only --cap-drop ALL --security-opt no-new-privileges --tmpfs /tmp -v /var/lib/vuga-media:/data -v "$release/dist:/source:ro" -e MEDIA_DATA_DIR=/data -e WEBSITE_PUBLIC_DIR=/source vuga-media:20261122 node src/import-outreach.mjs
docker network create vuga-media-net >/dev/null
docker run -d --name vuga-media --restart unless-stopped --network vuga-media-net --read-only --cap-drop ALL --security-opt no-new-privileges --tmpfs /tmp -p 127.0.0.1:13000:3000 -v /var/lib/vuga-media:/data -e MEDIA_DATA_DIR=/data -e MEDIA_ORIGIN=https://vugandakumva.digital vuga-media:20261122 >/dev/null
for attempt in {1..20}; do
  if curl -fsS http://127.0.0.1:13000/api/media/health >/dev/null; then break; fi
  sleep 1
done
python3 - <<'PY'
import json, urllib.request
base='http://127.0.0.1:13000/api/media/galleries/'
for gallery,expected in [('school-outreach',8),('cyanika-technical-secondary-school-outreach',37)]:
    with urllib.request.urlopen(base+gallery,timeout=5) as response: data=json.load(response)
    assert len(data['photos'])==expected, (gallery, len(data['photos']))
print('Staged service is healthy; both migrated galleries have the expected photo counts.')
PY
echo 'Next: create the administrator, configure backups, and verify before activating the public site.'
