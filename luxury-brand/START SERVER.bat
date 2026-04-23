@echo off
title Test Luxury Site - Local Server
echo.
echo  ============================================
echo   Test Luxury Site - Local Server
echo  ============================================
echo.
echo  Open: http://localhost:3000/luxury-brand/index.html
echo  Press Ctrl+C to stop.
echo.
cd /d "%~dp0.."
node serve.mjs
pause
