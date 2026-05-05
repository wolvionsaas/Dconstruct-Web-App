Write-Host "Starting local server for D'Construct website..." -ForegroundColor Green
Write-Host ""
Write-Host "Opening browser at http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start HTTP server
python -m http.server 8000
