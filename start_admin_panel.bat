@echo off
echo ========================================
echo   Panel Administratora - conder-portfolio
echo ========================================
echo.

REM Sprawdź czy Node.js jest zainstalowany
node --version >nul 2>&1
if errorlevel 1 (
    echo BŁĄD: Node.js nie jest zainstalowany!
    echo Zainstaluj Node.js ze strony: https://nodejs.org/
    pause
    exit /b 1
)

REM Sprawdź czy package.json istnieje
if not exist "package.json" (
    echo BŁĄD: Nie znaleziono package.json!
    echo Upewnij się, że jesteś w katalogu projektu conder-portfolio
    pause
    exit /b 1
)

REM Sprawdź czy node_modules istnieje, jeśli nie - zainstaluj zależności
if not exist "node_modules" (
    echo Instalowanie zależności...
    npm install
    if errorlevel 1 (
        echo BŁĄD: Nie udało się zainstalować zależności!
        pause
        exit /b 1
    )
)

echo.
echo Uruchamianie serwera na porcie 3000...
echo.

REM Uruchom serwer w tle
start /B node server.js

REM Poczekaj chwilę na uruchomienie serwera
timeout /t 3 /nobreak >nul

REM Otwórz przeglądarkę z panelem administratora
echo Otwieranie panelu administratora w przeglądarce...
start http://localhost:3000/admin.html

echo.
echo ========================================
echo Panel administratora został uruchomiony!
echo.
echo Adres: http://localhost:3000/admin.html
echo Serwer działa na porcie: 3000
echo.
echo Aby zatrzymać serwer, zamknij to okno.
echo ========================================
echo.

REM Czekaj na zamknięcie
pause 