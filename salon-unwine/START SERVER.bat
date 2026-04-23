@echo off
title Salon UnWINE Website Server
echo.
echo  =============================================
echo   Salon UnWINE ^& Boutique - Local Server
echo  =============================================
echo.
echo  Starting server at http://localhost:3000/salon-unwine/
echo  Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0.."
node serve.mjs
pause
