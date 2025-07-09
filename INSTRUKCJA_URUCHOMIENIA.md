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