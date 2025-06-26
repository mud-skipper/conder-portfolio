# 🏗️ Portfolio Wojciecha Condera - Architekt

**Strona portfolio architekta w stylu retro (lata 70-80) z ukośnymi pasami jak kasety VHS**

## 🎯 O projekcie

Portfolio architekta Wojciecha Condera stworzone w stylu retro z kremowym tłem i charakterystycznymi ukośnymi pasami w kolorach żółtym, pomarańczowym i czerwonym. Strona jest w pełni responsywna, zoptymalizowana na urządzenia mobilne i gotowa do uruchomienia z QR-kodu.

## 🚀 Jak uruchomić

### Lokalnie
1. Pobierz wszystkie pliki do jednego folderu
2. Otwórz terminal w folderze projektu
3. Uruchom lokalny serwer:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Lub Python 2
   python -m SimpleHTTPServer 8000
   
   # Lub Node.js (jeśli masz zainstalowany)
   npx serve .
   ```
4. Otwórz przeglądarkę i przejdź do `http://localhost:8000`

### Bez serwera
Możesz też po prostu otworzyć plik `index.html` w przeglądarce, ale niektóre funkcje (wczytywanie JSON) mogą nie działać.

## 📁 Struktura projektu

```
conder-portfolio/
├── index.html          # Główna struktura strony
├── style.css           # Style retro z animacjami
├── script.js           # Funkcjonalność JavaScript
├── content.json        # Dane projektów (CMS)
├── conder-potfolio_logo.png  # Logo
├── README.md           # Ten plik
├── ai_agent_rules.md   # Zasady dla AI
└── conder-portfolio_roadmap.md  # Roadmapa projektu
```

## 🎨 Funkcje

### ✅ Zaimplementowane
- **Responsywny design** - mobile-first (320-768px+)
- **Menu hamburger** - otwierane z prawej strony
- **Ukośne pasy retro** - animowane w tle
- **Dynamiczne projekty** - wczytywane z `content.json`
- **Formularz kontaktowy** - z walidacją
- **Płynne przewijanie** - do sekcji
- **Animacje** - fade-in przy scrollowaniu
- **Styl retro** - kremowe tło, czarne ramki, pomarańczowe akcenty

### 🔄 Do rozbudowy
- Timeline kariery
- Filtrowanie projektów
- Tryb ciemny/jasny
- Więcej animacji
- Galeria zdjęć projektów

## 📱 Responsywność

- **Mobile**: 320px - 767px (1 kolumna)
- **Tablet**: 768px - 1023px (2 kolumny)
- **Desktop**: 1024px+ (3 kolumny)

## 🎯 Sekcje strony

1. **Header** - Logo + menu hamburger
2. **Hero** - Nazwisko, tytuł, opis, CTA
3. **O mnie** - Zdjęcie + bio + link do timeline
4. **Projekty** - Kafelki z danymi z JSON
5. **Kontakt** - Formularz + social media
6. **Footer** - Copyright + linki

## 🔧 Technologie

- **HTML5** - Semantyczna struktura
- **CSS3** - Grid, Flexbox, Animacje, CSS Variables
- **JavaScript (ES6+)** - Async/await, Fetch API, DOM manipulation
- **JSON** - Dane projektów (CMS light)

## 📊 Dane w content.json

Plik `content.json` zawiera:
- Lista projektów z metadanymi
- Informacje o architekcie
- Dane kontaktowe
- Ustawienia strony

### Przykład edycji projektów:
```json
{
  "id": 1,
  "title": "Nazwa projektu",
  "year": "2024",
  "location": "Warszawa",
  "description": "Opis projektu...",
  "image": "project1.jpg",
  "type": "mieszkaniowy",
  "area": "1,000 m²",
  "status": "ukończony"
}
```

## 🌐 Hosting

Strona jest gotowa do wdrożenia na:
- **GitHub Pages** - darmowy hosting
- **Netlify** - darmowy hosting z CI/CD
- **Vercel** - darmowy hosting
- **Dowolny serwer HTTP**

## 📱 QR-kod

Po wdrożeniu na hosting:
1. Wygeneruj QR-kod z adresem URL strony
2. Dodaj do CV, wizytówek, plansz
3. Umożliw szybki dostęp do portfolio

## 🎨 Kolory retro

- **Kremowe tło**: `#f5f5dc`
- **Żółty pas**: `#ffd700`
- **Pomarańczowy pas**: `#ff8c00`
- **Czerwony pas**: `#dc143c`
- **Czarny tekst**: `#1a1a1a`
- **Białe elementy**: `#ffffff`

## 🔄 Aktualizacje

### v1.0 (obecna)
- Podstawowa struktura
- Styl retro
- Responsywność
- Menu hamburger
- Projekty z JSON

### v1.1 (planowane)
- Timeline kariery
- Filtry projektów
- Więcej animacji
- Optymalizacja wydajności

## 📞 Kontakt

**Wojciech Conder** - Architekt
- 📧 wojciech@conder-architekt.pl
- 📱 +48 123 456 789
- 📍 Warszawa / zdalnie

---

*Stworzone z ♥ w HTML, CSS i JavaScript*
*Styl retro inspirowany kasetami VHS z lat 70-80* 