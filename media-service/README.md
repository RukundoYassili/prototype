# Staff media library

The media service stores SQLite metadata and processed WebP files in a persistent directory. It is not active on the existing site until a separately staged deployment is switched on. The two managed galleries are `school-outreach` and `cyanika-technical-secondary-school-outreach`; story text and cover photos remain in the site project.

## Development and checks

Use Node 22.13+ for local development and the Dockerfile's Node 24 image for deployment. In this directory run `npm ci`, `npm test`, and `npm audit --omit=dev`. Set `MEDIA_DATA_DIR`, `MEDIA_ORIGIN`, and optionally `PORT` and `MEDIA_LISTEN` before starting `npm start`. `MEDIA_INSECURE_DEV=1` disables secure cookies only outside production; never use it in production. Set `VITE_MEDIA_ENABLED=1` and `MEDIA_PROXY=http://127.0.0.1:3000` when running the website's Vite development server against the local service.

To import the existing photos into a new isolated database, set `MEDIA_DATA_DIR` to an empty directory and `WEBSITE_PUBLIC_DIR` to the site's `public` directory, then run `node src/import-outreach.mjs`. Import is repeatable and must happen before existing source photos are removed. The import preserves photo order, text and crop positions; gallery IDs are stable. The Cyanika cover image is separately referenced by the site and must remain available.

`tests/media-dashboard.spec.ts` requires the media-enabled site and a local test account named `testadmin`, with password `temporary-testing-password`, in an isolated test database only. Never create that account on a real deployment.

## VPS staging

Package the built site with `VITE_MEDIA_ENABLED=1` and the service source, excluding `node_modules` and data. Independently verify the package checksum after transfer, extract to a root-owned release directory, and review `deploy/stage.sh` before running it as root with that directory as its argument. The script creates a restricted persistent directory, builds a non-root container, imports 8 school and 37 Cyanika gallery photos, and exposes its test port on loopback only. It does not change the live site. It intentionally stops if the target data directory, container or network already exists.

Create the first `admin` account in a private terminal with `docker exec -it vuga-media node src/bootstrap.mjs`. Enter the password privately and do not put it in chat, shell history or an environment variable. The dashboard creates subsequent individual staff accounts; each user should change their initial password. Administrators can disable other accounts. Existing sessions expire after eight hours and are revoked when the password changes or the account is disabled.

Before switching live traffic, configure the backup schedule below and verify a restore, the exact gallery counts, a real administrator login and the image upload/publication flow in an isolated staging environment. Use `deploy/Caddyfile` with a Caddy container attached to `vuga-media-net`; its `/api/media/*` handler proxies to `vuga-media:3000`, and the remaining requests use the existing static-site routing. Retain the previous site container, TLS data volume and release for rollback. Verify the existing live container and volumes before replacing anything. The public website must only be switched to a media-enabled build after the service is healthy.

## Backups and recovery

`backup/backup.sh` stops the media container briefly to obtain a consistent database and image snapshot, encrypts it using GnuPG AES-256, restarts the container even on failure, and retains the most recent 30 encrypted files. On Windows, run `backup/new-backup-key.ps1` to generate a new key in the user's Documents folder; it refuses to overwrite an existing key. Keep a second secure copy: without the key the encrypted backup cannot be recovered. Transfer the key to a private, mode-600 staging file on the VPS, then run `deploy/install-backup.sh <verified-release> <staged-key-file>` as root. The installer keeps a root-only copy, schedules daily backups for 03:00 Kigali time, and takes an initial snapshot. Remove the temporary staged key after verifying the root copy. The root-owned backup directory is group-readable by the existing `vugadeploy` account, but the key is not.

After the VPS backup directory and key have been provisioned, run `backup/download-backups.ps1` on the user's Windows computer. It downloads the latest encrypted archive and checks its SHA-256. Run `backup/install-weekly-download.ps1 -ScriptPath <absolute-path-to-download-backups.ps1>` to register a weekly Windows task; `StartWhenAvailable` runs a missed job when the computer becomes available. Verify the task's result and keep the key separately from the archives. The computer must have the existing `vuga-deploy` SSH alias and network access.

To test recovery, decrypt a copy of an archive into a new empty directory with `gpg --batch --pinentry-mode loopback --passphrase-file <key-file> --decrypt <archive> | tar -xzf - -C <empty-directory>`. Start a separate test container using that directory and verify the database, account access and image files. Never restore over live data without first stopping the service and making another verified backup. `test/backup-smoke.sh` exercises encryption and recovery with disposable files and a stubbed container command; it does not verify a production timer or a real offsite download.

Dashboard access is `/staff/media` after deployment. Removing an image from a gallery unpublishes it; it does not erase the underlying stored variants or any separately maintained cover photo. Source originals remain in the existing project until the migration and rollback process are verified.
