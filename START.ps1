# Gasasri AI - Full Stack Developer Startup Script
#
# Usage: Right-click this file → "Run with PowerShell"

$projectPath = "c:\Users\ganes\OneDrive\Desktop\Gasasri AI"

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "   Gasasri AI - Local Startup Script   " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check WSL
Write-Host "Starting backend services in WSL..." -ForegroundColor Yellow
& wsl -d Ubuntu -e bash -c "sudo service postgresql start 2>/dev/null; sudo service redis-server start 2>/dev/null; nohup bash ~/start_backend.sh > /tmp/gasasri_backend.log 2>&1 &"

Start-Sleep -Seconds 3

# Verify backend
$backendOk = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $health = Invoke-RestMethod "http://localhost:8000/api/v1/health" -TimeoutSec 2
        if ($health.status -eq "healthy") {
            Write-Host "Backend API is ready! (http://localhost:8000)" -ForegroundColor Green
            $backendOk = $true
            break
        }
    } catch {
        Write-Host "Waiting for backend ($i/10)..."
        Start-Sleep -Seconds 2
    }
}

if (-not $backendOk) {
    Write-Host "WARNING: Backend failed to respond. Check log using: wsl -d Ubuntu cat /tmp/gasasri_backend.log" -ForegroundColor Red
}

# Start Frontend
Write-Host "Starting Next.js Frontend Dev Server..." -ForegroundColor Yellow
Set-Location "$projectPath\frontend"
Start-Process "powershell" -ArgumentList "-NoExit -Command ""npm run dev""" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "All set! Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API:  http://localhost:8000" -ForegroundColor White
Write-Host "API Docs:     http://localhost:8000/api/v1/docs" -ForegroundColor White
Write-Host ""
Write-Host "One-click Demo login buttons are active on the login page!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to finish"
