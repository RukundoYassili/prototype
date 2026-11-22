#!/usr/bin/env bash
set -Eeuo pipefail
[[ $EUID -eq 0 ]]
release=/opt/vuga-media-release-20261122b
site=/opt/vuga-site-media-20261122
old=vuga-site-fourth
new=vuga-site-media-20261122
probe=vuga-media-site-probe
[[ -d "$release/dist" && ! -e "$site" ]]
[[ $(docker inspect -f '{{.State.Running}}' "$old") == true ]]
[[ $(docker inspect -f '{{range .Mounts}}{{if eq .Destination "/srv"}}{{.Source}}{{end}}{{end}}' "$old") == /opt/vuga-release-20261121d/dist ]]
[[ $(docker inspect -f '{{.State.Running}}' vuga-media) == true ]]
! docker inspect "$new" >/dev/null 2>&1
! docker inspect "$probe" >/dev/null 2>&1
systemctl is-active --quiet vuga-media-backup.timer
archive=$(find /var/backups/vuga-media -maxdepth 1 -name 'media-*.tar.gz.gpg' -type f | sort | tail -1)
[[ -n "$archive" && -r /etc/vuga-media/backup.key ]]
temp=$(mktemp -d /tmp/vuga-media-activation.XXXXXXXX)
case "$temp" in /tmp/vuga-media-activation.*) ;; *) exit 1;; esac
switched=0
probe_created=0
cleanup() {
  status=$?
  if [[ $switched == 1 ]]; then
    echo 'Activation failed; restoring the previous website.' >&2
    docker stop "$new" >/dev/null 2>&1 || true
    docker start "$old" >/dev/null || true
  fi
  if [[ $probe_created == 1 ]]; then docker rm -f "$probe" >/dev/null 2>&1 || true; fi
  rm -rf -- "$temp"
  exit "$status"
}
trap cleanup EXIT
gpg --batch --no-tty --pinentry-mode loopback --passphrase-file /etc/vuga-media/backup.key --decrypt "$archive" | tar --no-same-owner --no-same-permissions -xzf - -C "$temp"
python3 - "$temp" <<'PY'
import os,sqlite3,sys
root=sys.argv[1]
db=sqlite3.connect(os.path.join(root,'media.sqlite'))
assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
rows=db.execute('SELECT id,gallery_id FROM photos').fetchall()
counts={}
for photo,gallery in rows:
    counts[gallery]=counts.get(gallery,0)+1
    for size in ('thumb','large'): assert os.path.isfile(os.path.join(root,'images',photo,size+'.webp'))
assert counts.get('school-outreach')==8 and counts.get('cyanika-technical-secondary-school-outreach')==37,counts
assert db.execute("SELECT count(*) FROM users WHERE role='admin' AND disabled=0").fetchone()[0]>=1
print('Actual encrypted backup restored and verified:',counts)
PY
python3 - <<'PY'
import getpass,json,urllib.request
password=getpass.getpass('Enter the media administrator password for the staging check: ')
base='http://127.0.0.1:13000/api/media'
headers={'Origin':'https://vugandakumva.digital','Content-Type':'application/json'}
payload=json.dumps({'username':'admin','password':password}).encode()
request=urllib.request.Request(base+'/login',data=payload,headers=headers,method='POST')
with urllib.request.urlopen(request,timeout=10) as response:
    cookie=response.headers.get('Set-Cookie','').split(';',1)[0]
    session=json.load(response)
assert session['user']['role']=='admin' and cookie and session.get('csrf')
headers.update({'Cookie':cookie,'X-CSRF-Token':session['csrf']})
request=urllib.request.Request(base+'/logout',data=b'{}',headers=headers,method='POST')
with urllib.request.urlopen(request,timeout=10) as response: assert response.status==200
print('Staged administrator login and logout verified.')
PY
install -d -m 0755 "$site"
cp -a "$release/dist" "$site/dist"
cp "$release/media-service/deploy/Caddyfile" "$site/Caddyfile"
# The cover photo remains in use by the story; other originals are now served by the verified media library.
for n in $(seq -w 1 37); do [[ "$n" == 11 ]] || rm -f -- "$site/dist/community-outreach/cyanika/photo-$n.jpg"; done
docker run --rm --network vuga-media-net -v "$site/Caddyfile:/etc/caddy/Caddyfile:ro" caddy:2 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
cat > "$site/Caddyfile-probe" <<'EOF'
:8080 {
  handle /api/vuga-chat {
    reverse_proxy 172.17.0.1:3017 {
      transport http {
        response_header_timeout 180s
      }
    }
  }
  handle /api/media/* {
    reverse_proxy vuga-media:3000
  }
  handle {
    root * /srv
    try_files {path} {path}/index.html =404
    file_server
  }
}
EOF
docker run -d --name "$probe" --network vuga-media-net -p 127.0.0.1:18184:8080 -v "$site/dist:/srv:ro" -v "$site/Caddyfile-probe:/etc/caddy/Caddyfile:ro" caddy:2 >/dev/null
probe_created=1
docker network connect bridge "$probe"
for attempt in {1..20}; do
  if curl -fsS http://127.0.0.1:18184/api/media/health > /dev/null; then break; fi
  sleep 1
done
curl -fsS http://127.0.0.1:18184/community/cyanika-technical-secondary-school-outreach/ > "$temp/page"
grep -i 'Cyanika Technical Secondary School' "$temp/page" > /dev/null
grep -F '/vuga-assistant.js' "$temp/page" > /dev/null
curl -fsS http://127.0.0.1:18184/vuga-assistant.js > "$temp/assistant.js"
[[ $(curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:18184/api/vuga-chat) == 501 ]]
curl -fsS http://127.0.0.1:18184/staff/media/ > "$temp/staff"
grep -i 'noindex' "$temp/staff" > /dev/null
curl -fsS http://127.0.0.1:18184/api/media/galleries/cyanika-technical-secondary-school-outreach > "$temp/gallery.json"
python3 - "$temp/gallery.json" <<'PY'
import json,sys
with open(sys.argv[1]) as f: assert len(json.load(f)['photos'])==37
PY
docker rm -f "$probe" >/dev/null
probe_created=0
echo 'Candidate site and gallery passed local checks.'
switched=1
docker stop "$old" >/dev/null
docker run -d --name "$new" --restart unless-stopped --network vuga-media-net -p 80:80 -p 443:443 -v "$site/dist:/srv:ro" -v "$site/Caddyfile:/etc/caddy/Caddyfile:ro" -v vuga-site-caddy:/data caddy:2 >/dev/null
docker network connect bridge "$new"
for attempt in {1..20}; do
  if curl -fsS --noproxy '*' --resolve vugandakumva.digital:443:127.0.0.1 https://vugandakumva.digital/api/media/health > "$temp/health"; then break; fi
  sleep 1
done
curl -fsS --noproxy '*' --resolve vugandakumva.digital:443:127.0.0.1 https://vugandakumva.digital/community/cyanika-technical-secondary-school-outreach/ > "$temp/live"
grep -i 'Cyanika Technical Secondary School' "$temp/live" > /dev/null
grep -F '/vuga-assistant.js' "$temp/live" > /dev/null
curl -fsS --noproxy '*' --resolve vugandakumva.digital:443:127.0.0.1 https://vugandakumva.digital/vuga-assistant.js > "$temp/live-assistant.js"
[[ $(curl -sS --noproxy '*' --resolve vugandakumva.digital:443:127.0.0.1 -o /dev/null -w '%{http_code}' https://vugandakumva.digital/api/vuga-chat) == 501 ]]
curl -fsS --noproxy '*' --resolve vugandakumva.digital:443:127.0.0.1 https://vugandakumva.digital/api/media/galleries/cyanika-technical-secondary-school-outreach > "$temp/live-gallery.json"
python3 - "$temp/live-gallery.json" <<'PY'
import json,sys
with open(sys.argv[1]) as f: assert len(json.load(f)['photos'])==37
PY
switched=0
echo 'Media site activated and HTTPS checks passed. Previous site container retained.'
