param(
  [string]$Destination = "$env:USERPROFILE\Documents\VugaMediaBackups",
  [string]$Remote = 'vuga-deploy',
  [string]$RemoteDirectory = '/var/backups/vuga-media'
)
$ErrorActionPreference = 'Stop'
if ($Remote -notmatch '^[A-Za-z0-9_.-]+$' -or $RemoteDirectory -notmatch '^/[A-Za-z0-9_./-]+$') { throw 'Invalid SSH alias or backup directory.' }
New-Item -ItemType Directory -Force -Path $Destination | Out-Null
$latest = [string](& ssh -o BatchMode=yes -o ConnectTimeout=20 $Remote "find $RemoteDirectory -maxdepth 1 -type f -name 'media-*.tar.gz.gpg' -printf '%f\n' | sort -r | head -1")
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($latest) -or $latest -notmatch '^media-\d{8}T\d{6}Z\.tar\.gz\.gpg$') { throw 'Could not locate a valid encrypted backup on the VPS.' }
$target = Join-Path $Destination $latest
$remoteHash = [string](& ssh -o BatchMode=yes -o ConnectTimeout=20 $Remote "sha256sum $RemoteDirectory/$latest")
if ($LASTEXITCODE -ne 0 -or $remoteHash -notmatch '^([a-f0-9]{64})\s') { throw 'Could not verify the server backup.' }
$expected = $Matches[1]
if (-not (Test-Path -LiteralPath $target)) {
  $temporary = "$target.partial"
  & scp -o BatchMode=yes "${Remote}:${RemoteDirectory}/${latest}" $temporary
  if ($LASTEXITCODE -ne 0) { throw 'Backup download failed.' }
  if ((Get-FileHash -Algorithm SHA256 -LiteralPath $temporary).Hash.ToLowerInvariant() -ne $expected) { throw 'Downloaded backup failed its checksum.' }
  Move-Item -LiteralPath $temporary -Destination $target
}
if (-not (Test-Path -LiteralPath $target -PathType Leaf) -or (Get-FileHash -Algorithm SHA256 -LiteralPath $target).Hash.ToLowerInvariant() -ne $expected) { throw 'The local backup is missing or failed its checksum.' }
Write-Output "Encrypted backup available at $target"
