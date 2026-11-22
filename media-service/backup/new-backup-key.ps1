param([string]$Path = "$env:USERPROFILE\Documents\VugaMediaRecovery\media-backup.key")
$ErrorActionPreference = 'Stop'
$parent = Split-Path -Parent $Path
New-Item -ItemType Directory -Force -Path $parent | Out-Null
$bytes = New-Object byte[] 48
$random = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try { $random.GetBytes($bytes) } finally { $random.Dispose() }
$key = [System.Convert]::ToBase64String($bytes) + "`n"
$stream = [System.IO.File]::Open($Path, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
try { $buffer = [System.Text.Encoding]::ASCII.GetBytes($key); $stream.Write($buffer, 0, $buffer.Length) } finally { $stream.Dispose() }
$identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().User
$acl = New-Object System.Security.AccessControl.FileSecurity
$acl.SetAccessRuleProtection($true, $false)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule($identity, 'FullControl', 'Allow')
$acl.AddAccessRule($rule)
Set-Acl -LiteralPath $Path -AclObject $acl
Write-Output "Backup key created at $Path. Keep a second secure copy; losing it prevents recovery."
