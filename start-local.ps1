param(
    [switch]$Install
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "backend"
$frontendDir = Join-Path $projectRoot "frontend"
$venvDir = Join-Path $backendDir ".venv"
$venvPython = Join-Path $venvDir "Scripts\python.exe"
$venvPip = Join-Path $venvDir "Scripts\pip.exe"

if (-not (Test-Path (Join-Path $backendDir ".env"))) {
    Write-Host "backend/.env is missing." -ForegroundColor Red
    Write-Host "Copy backend/.env.example to backend/.env and add your PostgreSQL URL."
    exit 1
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python is not installed or is not available on PATH." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js/npm is not installed or is not available on PATH." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $venvPython)) {
    Write-Host "Creating backend virtual environment..."
    python -m venv $venvDir
    $Install = $true
}

if ($Install) {
    Write-Host "Installing backend dependencies..."
    & $venvPip install --disable-pip-version-check -r (Join-Path $backendDir "requirements.txt")
}

if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    Write-Host "Installing frontend dependencies..."
    Push-Location $frontendDir
    try {
        npm.cmd install
    }
    finally {
        Pop-Location
    }
}

$env:PYTHONUNBUFFERED = "1"
$backendProcess = $null
$frontendProcess = $null

try {
    Write-Host ""
    Write-Host "Starting Goriber Gari..." -ForegroundColor Cyan
    $backendProcess = Start-Process `
        -FilePath $venvPython `
        -ArgumentList "-m", "uvicorn", "app.main:app", "--reload", "--host", "127.0.0.1", "--port", "8000" `
        -WorkingDirectory $backendDir `
        -NoNewWindow `
        -PassThru

    $frontendProcess = Start-Process `
        -FilePath "npm.cmd" `
        -ArgumentList "run", "dev", "--", "--host", "127.0.0.1", "--port", "5173" `
        -WorkingDirectory $frontendDir `
        -NoNewWindow `
        -PassThru

    Write-Host "Frontend: http://127.0.0.1:5173" -ForegroundColor Green
    Write-Host "Backend:  http://127.0.0.1:8000" -ForegroundColor Green
    Write-Host "API docs: http://127.0.0.1:8000/docs" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop both services."

    Wait-Process -Id @($backendProcess.Id, $frontendProcess.Id)
}
finally {
    foreach ($process in @($backendProcess, $frontendProcess)) {
        if ($null -ne $process -and -not $process.HasExited) {
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }
    }
}
