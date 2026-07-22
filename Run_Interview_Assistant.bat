@echo off
title AI Interview Assistant Launcher
echo ==========================================================
echo       AI POWERED SMART INTERVIEW ASSISTANT LAUNCHER
echo ==========================================================
echo.
echo [1/3] Adding portable Node.js to session environment PATH...
set PATH=C:\Users\Admin\node-portable\node-v20.15.0-win-x64;%PATH%

echo [2/3] Starting Backend Server in a new window...
start "Backend Server (Port 5000)" cmd /c "cd /d \"%~dp0backend\" && node server.js"

echo [3/3] Starting Frontend Dev Server in a new window...
start "Frontend Server (Port 3000)" cmd /c "cd /d \"%~dp0frontend\" && npm run dev"

echo.
echo Waiting 6 seconds for servers to boot up...
timeout /t 6 /nobreak > NUL

echo Opening Smart Interview Assistant in your web browser...
start http://localhost:3000/

echo.
echo All servers initialized! You can minimize the server windows.
echo To stop the application, simply close the command prompt windows.
echo.
pause
