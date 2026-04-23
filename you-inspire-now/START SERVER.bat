@echo off
title You Inspire Now — Local Server
echo.
echo  ============================================
echo   You Inspire Now — Starting Local Server
echo  ============================================
echo.
echo  Opening: http://localhost:3000/you-inspire-now/
echo  Press Ctrl+C to stop the server.
echo.

cd /d "%~dp0.."
start "" "http://localhost:3000/you-inspire-now/"
node serve.mjs
pause
