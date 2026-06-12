@echo off
taskkill /f /im node.exe >nul 2>&1
start "" /min cmd /c "cd /d %~dp0..\backend & node server.js"
timeout /t 3 /nobreak >nul
start http://localhost:6776
cd /d "%~dp0.."
npx vite --host 0.0.0.0 --port 6776
pause
