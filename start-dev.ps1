# ============================================================
#  🦷  Dental Clinic Dev Launcher
#  Kills stale node processes, then starts the Express backend
#  (port 3001) and the Vite frontend (port 5173) in new windows.
# ============================================================

Write-Host "🦷  Dental Clinic Dev Launcher" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkCyan

# Kill any existing node processes (clears stale port 3001/5173)
Write-Host "🔄  Stopping any existing node processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Write-Host "    Done." -ForegroundColor Gray

$projectRoot = $PSScriptRoot

# Launch backend
Write-Host ""
Write-Host "🚀  Starting backend on http://localhost:3001" -ForegroundColor Green
Start-Process powershell -ArgumentList `
  "-NoExit", `
  "-Command", `
  "Write-Host '🦷  Backend Server' -ForegroundColor Cyan; cd '$projectRoot\server'; node index.js"

# Short pause so backend initialises first
Start-Sleep -Seconds 3

# Launch frontend
Write-Host "🎨  Starting frontend on http://localhost:5173" -ForegroundColor Blue
Start-Process powershell -ArgumentList `
  "-NoExit", `
  "-Command", `
  "Write-Host '🎨  Frontend Dev Server' -ForegroundColor Blue; cd '$projectRoot\app'; npm run dev"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkCyan
Write-Host "✅  Both servers launching in new windows." -ForegroundColor Cyan
Write-Host ""
Write-Host "    Patient site:  http://localhost:5173" -ForegroundColor White
Write-Host "    Admin panel:   http://localhost:5173/admin" -ForegroundColor White  
Write-Host "    API health:    http://localhost:3001/api/health" -ForegroundColor White
Write-Host "    Admin pass:    admin123  (change in server/.env)" -ForegroundColor Gray
Write-Host ""
