# 🚀 Instrukcja uruchomienia panelu administratora

## Szybkie uruchomienie (Windows)

### Metoda 1: Plik .bat (NAJŁATWIEJSZA)
1. **Kliknij dwukrotnie** na plik `start_admin_panel.bat`
2. Poczekaj na uruchomienie serwera (3 sekundy)
3. Przeglądarka otworzy się automatycznie z panelem administratora

### Metoda 2: Ręczne uruchomienie

#### Krok 1: Sprawdź wymagania
- **Node.js** - pobierz ze strony: https://nodejs.org/
- **NPM** - zwykle instaluje się z Node.js

#### Krok 2: Otwórz terminal w katalogu projektu
```cmd
cd ścieżka/do/conder-portfolio
```

#### Krok 3: Zainstaluj zależności (tylko pierwszy raz)
```cmd
npm install
```

#### Krok 4: Uruchom serwer
```cmd
npm start
```
lub
```cmd
node server.js
```

#### Krok 5: Otwórz przeglądarkę
Przejdź do: `http://localhost:3000/admin.html`

## 🔧 Rozwiązywanie problemów

### Problem: "Node.js nie jest zainstalowany"
**Rozwiązanie:** Pobierz i zainstaluj Node.js ze strony https://nodejs.org/

### Problem: "Nie udało się zainstalować zależności"
**Rozwiązanie:** 
1. Sprawdź połączenie z internetem
2. Spróbuj: `npm cache clean --force`
3. Następnie: `npm install`

### Problem: "Port 3000 jest zajęty"
**Rozwiązanie:**
1. Znajdź proces używający port 3000: `netstat -ano | findstr :3000`
2. Zatrzymaj proces lub zmień port w `server.js`

### Problem: "Nie można otworzyć admin.html"
**Rozwiązanie:**
1. Sprawdź czy plik `admin.html` istnieje w katalogu
2. Sprawdź czy serwer działa: `http://localhost:3000`

## 📋 Dostępne adresy

- **Panel administratora:** `http://localhost:3000/admin.html`
- **Portfolio (strona główna):** `http://localhost:3000`
- **API serwera:** `http://localhost:3000/api/...`

## 🛠️ Zatrzymanie serwera

### Jeśli używasz pliku .bat:
- Zamknij okno terminala

### Jeśli uruchomiłeś ręcznie:
- Naciśnij `Ctrl + C` w terminalu

## 📁 Struktura plików

```
conder-portfolio/
├── start_admin_panel.bat    ← Plik do uruchomienia
├── server.js               ← Serwer Node.js
├── admin.html              ← Panel administratora
├── index.html              ← Strona główna portfolio
├── package.json            ← Zależności projektu
└── content.json            ← Dane projektów
```

## 🔄 Aktualizacje

Po każdej aktualizacji kodu:
1. Zatrzymaj serwer (`Ctrl + C`)
2. Uruchom ponownie: `npm start` lub kliknij `.bat`

---

**💡 Wskazówka:** Plik `start_admin_panel.bat` automatycznie:
- Sprawdza czy Node.js jest zainstalowany
- Instaluje zależności jeśli potrzeba
- Uruchamia serwer
- Otwiera przeglądarkę z panelem admina 

---

# CHECKLISTA: Co zrobić po rozpakowaniu ZIP projektu `conder-portfolio`

1. **Rozpakuj ZIP** do wybranego katalogu na swoim komputerze.
2. **Zainstaluj Node.js** (jeśli nie masz):
   - Wejdź na https://nodejs.org/ i pobierz najnowszą wersję LTS dla Windows.
   - Zainstaluj Node.js (wystarczy domyślna instalacja, npm zainstaluje się automatycznie).
3. **Otwórz folder projektu** (np. `conder-portfolio-main`) w Eksploratorze plików.
4. **Zainstaluj zależności projektu**:
   - Otwórz terminal (cmd) w katalogu projektu.
   - Wpisz:
     ```
     npm install
     ```
   - Poczekaj, aż wszystkie biblioteki się zainstalują.
5. **Uruchom serwer lokalny** (jeśli chcesz korzystać z panelu admina lub dynamicznych funkcji):
   - W terminalu wpisz:
     ```
     node server.js
     ```
   - Serwer powinien wystartować (domyślnie na porcie 3000 lub innym podanym w logu).
6. **Otwórz stronę w przeglądarce:**
   - Portfolio: `index.html` możesz otworzyć bezpośrednio (dwuklik) lub przez serwer: `http://localhost:3000/`
   - Panel admina: `http://localhost:3000/admin.html`
7. **Sprawdź, czy wszystko działa:**
   - Przetestuj portfolio i panel admina.
   - Jeśli pojawią się błędy, sprawdź komunikaty w terminalu lub pliku README.md.

---

# Szybki start – plik instalacyjny (Windows)

Możesz użyć poniższego pliku .bat, aby zautomatyzować instalację Node.js i zależności:

**Utwórz plik `install_portfolio.bat` w katalogu projektu z taką zawartością:**

```bat
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
```

**Jak użyć?**
1. Zapisz powyższy kod do pliku `install_portfolio.bat`.
2. Uruchom plik dwuklikiem.
3. Jeśli Node.js nie jest zainstalowany, instalator otworzy się automatycznie – po instalacji uruchom plik ponownie.
4. Po instalacji zależności serwer uruchomi się automatycznie.

---

**Masz pytania? Napisz do Wojtka lub sprawdź README.md!** 