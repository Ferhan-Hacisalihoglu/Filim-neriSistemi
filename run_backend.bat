@echo off
title Film Oneri ML -- FastAPI Backend (Local Python)
color 0A
echo ===================================================
echo   FILM ONERI ML -- FASTAPI BACKEND BASLATILIYOR
echo ===================================================
cd /d "%~dp0"

echo [1/3] Python paketleri kontrol ediliyor...
python -c "import fastapi, uvicorn, joblib, pandas, sklearn" 2>nul
if %errorlevel% neq 0 (
    echo [BILGI] Gerekli Python paketleri yukleniyor...
    pip install fastapi uvicorn pandas numpy scikit-learn joblib
)

echo [2/3] SQLite Veritabani kontrol ediliyor / hazirlaniyor...
python backend/init_db.py

echo [3/3] FastAPI Sunucusu Baslatiliyor (http://127.0.0.1:8000)...
echo Swagger Docs: http://127.0.0.1:8000/docs
echo.
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
pause
