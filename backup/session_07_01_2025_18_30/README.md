# 🏗️ Portfolio Wojciecha Condera - Architekt

**Nowoczesne, retro-minimalistyczne portfolio architekta.**

---

## 🎯 O projekcie

Portfolio architekta Wojciecha Condera w stylu retro-minimalistycznym:
- **Białe tło** na wszystkich elementach (brak kremowego)
- **Brak cieni, zaokrągleń, ramek** – czysty, prosty layout
- **Kolorowe nagłówki sekcji**: żółty (O mnie), pomarańczowy (Projekty), czerwony (Kontakt)
- **Menu hamburger** i logo
- **Dynamiczne projekty** ładowane z `content.json`
- **Panel admina** do zarządzania projektami
- **Dolny panel z przyciskami**: Wyślij email, CV (jeśli dostępne)
- **Responsywność**: mobile-first (320-768px+)

---

## 🚀 Jak uruchomić / testować

### 1. GitHub Pages (zalecane)
- Wgraj repozytorium na GitHub
- Włącz GitHub Pages (branch: `main`, folder: `/`)
- Otwórz: `https://TWOJ-LOGIN.github.io/conder-portfolio/`

### 2. Lokalnie (Node.js lub Python)
- Node.js: `npm install && npm start` (panel admina: `/admin.html`)
- Python: `python -m http.server 8000`

---

## 📁 Struktura projektu

```
conder-portfolio/
├── index.html          # Główna strona
├── style.css           # Styl retro-minimalistyczny
├── script.js           # Funkcjonalność JS
├── content.json        # Projekty (CMS)
├── admin.html          # Panel admina
├── server.js           # Serwer Node.js (opcja)
├── uploads/            # Zdjęcia projektów
├── README.md           # Ten plik
└── ...
```

---

## 🎨 Kluczowe cechy
- **Czysty retro-minimalizm**: białe tło, brak cieni, brak zaokrągleń
- **Kolorowe nagłówki**: żółty, pomarańczowy, czerwony
- **Menu hamburger** (mobile-first)
- **Dynamiczne projekty** z JSON
- **Panel admina** (dodawanie/usuwanie projektów)
- **Dolny panel**: Wyślij email, CV (jeśli plik `cv.pdf` istnieje)
- **Brak formularza kontaktowego** – tylko dane kontaktowe
- **Brak animacji** – statyczny, przejrzysty layout

---

## 📱 Responsywność
- Mobile-first (320-768px+)
- Blokada desktop: informacja o dostępności tylko na mobile

---

## 🔄 Aktualizacje v1.0
- Audyt i czyszczenie kodu
- Usunięcie wszystkich cieni, ramek, zaokrągleń
- Wymuszenie białego tła
- Usunięcie formularza kontaktowego i animacji
- Poprawki responsywności i stylu
- Przycisk CV: otwiera `cv.pdf` jeśli istnieje, w przeciwnym razie alert

---

## 🌐 Hosting i testowanie
- **GitHub Pages** – zalecane do testów i prezentacji
- **Netlify, Vercel** – alternatywne opcje

---

## 📞 Kontakt
**Wojciech Conder** – Architekt
- 📧 wojciech@conder-architekt.pl
- 📱 +48 123 456 789
- 📍 Warszawa / zdalnie

---

*Projekt: retro-minimalistyczne portfolio architekta. Kod czysty, gotowy do rozbudowy.* 