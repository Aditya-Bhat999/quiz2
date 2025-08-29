param(
    [int]$Port = 5500
)

$ErrorActionPreference = 'Stop'

# Resolve project root (folder containing this script)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Pick python executable (prefer 'py' launcher on Windows, fall back to 'python')
$py = Get-Command py -ErrorAction SilentlyContinue
if (-not $py) {
    $py = Get-Command python -ErrorAction SilentlyContinue
}
if (-not $py) {
    Write-Error "Python is required but was not found in PATH. Install Python from microsoft store or python.org and try again."
    exit 1
}

# Start local HTTP server in a separate window
$serverArgs = "-m http.server $Port"
Start-Process -FilePath $py.Source -ArgumentList $serverArgs -WorkingDirectory $projectRoot

Start-Sleep -Seconds 1

# Open the quiz in the default browser
Start-Process "http://localhost:$Port/web/index.html"

Write-Host "Quiz started at http://localhost:$Port/web/index.html"
Write-Host "To stop the server, close the Python window that opened." 