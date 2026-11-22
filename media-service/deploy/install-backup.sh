#!/usr/bin/env bash
set -Eeuo pipefail
release=${1:?Usage: install-backup.sh /opt/verified-release /path/to/key}
source_key=${2:?Provide a securely generated passphrase file, already saved off-server.}
[[ $EUID -eq 0 ]]
[[ -r "$source_key" && -s "$source_key" && -f "$release/media-service/backup/backup.sh" ]]
[[ ! -e /etc/vuga-media/backup.key && ! -e /etc/systemd/system/vuga-media-backup.service && ! -e /etc/systemd/system/vuga-media-backup.timer ]]
getent group vugadeploy >/dev/null
install -d -o root -g root -m 0700 /etc/vuga-media
install -o root -g root -m 0600 "$source_key" /etc/vuga-media/backup.key
install -d -o root -g vugadeploy -m 2750 /var/backups/vuga-media
install -d -o root -g root -m 0755 /usr/local/libexec/vuga-media
install -o root -g root -m 0755 "$release/media-service/backup/backup.sh" /usr/local/libexec/vuga-media/backup.sh
cat > /etc/systemd/system/vuga-media-backup.service <<'EOF'
[Unit]
Description=Encrypted Vuga media library backup
After=docker.service
Requires=docker.service
[Service]
Type=oneshot
Environment=MEDIA_DATA_DIR=/var/lib/vuga-media
Environment=BACKUP_DIR=/var/backups/vuga-media
Environment=BACKUP_KEY_FILE=/etc/vuga-media/backup.key
ExecStart=/usr/local/libexec/vuga-media/backup.sh
TimeoutStartSec=3600
EOF
cat > /etc/systemd/system/vuga-media-backup.timer <<'EOF'
[Unit]
Description=Daily Vuga media library backup
[Timer]
OnCalendar=*-*-* 01:00:00 UTC
Persistent=true
[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable --now vuga-media-backup.timer
systemctl start vuga-media-backup.service
systemctl is-active --quiet vuga-media-backup.timer
find /var/backups/vuga-media -maxdepth 1 -type f -name 'media-*.tar.gz.gpg' -print -quit | grep -q .
echo 'Daily encrypted VPS backups enabled and an initial backup created.'
