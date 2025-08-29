@echo off
setlocal

set PORT=%1
if "%PORT%"=="" set PORT=5500

powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0start-quiz.ps1" -Port %PORT%

endlocal 