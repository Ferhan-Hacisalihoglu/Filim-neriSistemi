@echo off
title Film Oneri ML -- React Frontend (Docker Container)
color 0C
echo ===================================================
echo   FILM ONERI ML -- DOCKER FRONTEND BASLATILIYOR
echo ===================================================
cd /d "%~dp0frontend"

set "DOCKER_CMD=docker"
where docker >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\Docker\Docker\resources\bin\docker.exe" (
        set "DOCKER_CMD=C:\Program Files\Docker\Docker\resources\bin\docker.exe"
    ) else (
        echo [HATA] Docker executable bulunamadi! Lutfen Docker Desktop uygulamasinin acik oldugundan emin olun.
        pause
        exit /b 1
    )
)

echo [1/2] React Frontend Docker konteyniri derleniyor (Node.js/npm bilgisayara kurulmadan Docker icinde calisir)...
%DOCKER_CMD% build -t movie_frontend .
if %errorlevel% neq 0 (
    echo [HATA] Frontend Docker image derlenirken hata olustu. Docker Desktop uygulamasinin acik oldugundan emin olun.
    pause
    exit /b 1
)

%DOCKER_CMD% stop movie_frontend_container >nul 2>&1
%DOCKER_CMD% rm movie_frontend_container >nul 2>&1

echo [2/2] Frontend Web Portali Docker Uzerinde Baslatiliyor (http://localhost:3000)...
echo.
echo   Web Portali : http://localhost:3000
echo.
%DOCKER_CMD% run -it --rm --name movie_frontend_container -p 3000:80 movie_frontend
pause
