# Veridion Industrial Setup Script

Write-Host "Initializing Veridion ESG Platform Setup..." -ForegroundColor Cyan

# 1. Install Python Dependencies
Write-Host "[1/3] Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# 2. Setup Frontend
Write-Host "[2/3] Setting up Frontend..." -ForegroundColor Yellow
Set-Location ui
npm install
npm run build

# 3. Finalize
Write-Host "[3/3] Setup Complete!" -ForegroundColor Green
Write-Host "To start the Backend: python api/main.py" -ForegroundColor Cyan
Write-Host "To start the Frontend: cd ui; npm run dev" -ForegroundColor Cyan
