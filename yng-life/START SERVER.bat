@echo off
title YNG★LIFE — Local Server
echo.
echo  ============================================
echo   YNG★LIFE — Local Preview Server
echo  ============================================
echo.
echo  Open: http://localhost:3000/yng-life/index.html
echo  Press Ctrl+C to stop.
echo.
cd /d "%~dp0.."
node serve.mjs
pause
