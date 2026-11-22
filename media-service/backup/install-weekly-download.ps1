param([Parameter(Mandatory=$true)][string]$ScriptPath)
$ErrorActionPreference = 'Stop'
$resolved = (Resolve-Path -LiteralPath $ScriptPath).Path
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$resolved`""
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 10am
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable
Register-ScheduledTask -TaskName 'Vuga Media Weekly Backup' -Action $action -Trigger $trigger -Settings $settings -Description 'Download the latest encrypted Vuga media backup.' -Force | Out-Null
Write-Output 'Weekly backup download scheduled for Sundays at 10:00.'
