$desktop = [Environment]::GetFolderPath('Desktop')
Set-Location (Join-Path $desktop "pseo-toolkit")
$env:GIT_TERMINAL_PROMPT = "1"
git push -u origin main 2>&1
