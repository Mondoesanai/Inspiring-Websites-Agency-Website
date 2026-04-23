@echo off
title New Vibez BarberSalon - Local Server
echo.
echo  ============================================
echo   New Vibez BarberSalon - Local Server
echo  ============================================
echo.
echo  Open: http://localhost:3000/new-vibez/index.html
echo  Press Ctrl+C to stop.
echo.
cd /d "%~dp0.."
node serve.mjs
pause
