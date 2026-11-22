#!/usr/bin/env bash
set -Eeuo pipefail
archive=${1:?Encrypted archive path required}
key=${2:?Recovery key path required}
root=$(mktemp -d /home/vugadeploy/media-restore-verify.XXXXXXXX)
case "$root" in /home/vugadeploy/media-restore-verify.*) ;; *) exit 1;; esac
trap 'rm -rf -- "$root"' EXIT
gpg --batch --no-tty --pinentry-mode loopback --passphrase-file "$key" --decrypt "$archive" | tar --no-same-owner --no-same-permissions -xzf - -C "$root"
python3 - "$root" <<'PY'
import os,sqlite3,sys
root=sys.argv[1]
db=sqlite3.connect(os.path.join(root,'media.sqlite'))
assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
rows=db.execute('SELECT id,gallery_id FROM photos').fetchall()
counts={}
for photo,gallery in rows:
    counts[gallery]=counts.get(gallery,0)+1
    for size in ('thumb','large'):
        assert os.path.isfile(os.path.join(root,'images',photo,size+'.webp'))
admins=db.execute("SELECT count(*) FROM users WHERE role='admin' AND disabled=0").fetchone()[0]
assert counts.get('cyanika-technical-secondary-school-outreach')==37,counts
assert counts.get('school-outreach')==8,counts
assert admins>=1,admins
print('Restored database and image files verified:',counts,'enabled admins:',admins)
db.close()
PY
