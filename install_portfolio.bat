@echo off
REM Automatyczna instalacja Node.js i zależności dla conder-portfolio

REM Sprawdź, czy Node.js jest zainstalowany
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js nie jest zainstalowany. Pobieram instalator...
    powershell -Command "Start-Process 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi'"
    echo Zainstaluj Node.js i uruchom ten plik ponownie.
    pause
    exit /b
) else (
    echo Node.js jest już zainstalowany.
)

REM Instalacja zależności npm
npm install

REM Uruchomienie serwera
node server.js

pause 