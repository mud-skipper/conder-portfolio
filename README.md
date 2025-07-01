# 🏗️ Portfolio Wojciecha Condera - Architekt

**Strona portfolio architekta w stylu retro (lata 70-80) z ukośnymi pasami jak kasety VHS**

## 🎯 O projekcie

Portfolio architekta Wojciecha Condera stworzone w stylu retro z kremowym tłem i charakterystycznymi ukośnymi pasami w kolorach żółtym, pomarańczowym i czerwonym. Strona jest w pełni responsywna, zoptymalizowana na urządzenia mobilne i gotowa do uruchomienia z QR-kodu.

## 🚀 Jak uruchomić

### Opcja 1: Z panelem administracyjnym (Node.js)
1. Zainstaluj Node.js (https://nodejs.org/)
2. Otwórz terminal w folderze projektu
3. Zainstaluj zależności:
   ```bash
   npm install
   ```
4. Uruchom serwer:
   ```bash
   npm start
   ```
5. Otwórz przeglądarkę:
   - Portfolio: `http://localhost:3000`
   - Panel admina: `http://localhost:3000/admin.html`

### Opcja 2: Tylko portfolio (Python)
1. Otwórz terminal w folderze projektu
2. Uruchom lokalny serwer:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Lub Python 2
   python -m SimpleHTTPServer 8000
   ```
3. Otwórz przeglądarkę i przejdź do `http://localhost:8000`

### Bez serwera
Możesz też po prostu otworzyć plik `index.html` w przeglądarce, ale niektóre funkcje (wczytywanie JSON) mogą nie działać.

## 📁 Struktura projektu

```
conder-portfolio/
├── index.html          # Główna struktura strony
├── style.css           # Style retro z animacjami
├── script.js           # Funkcjonalność JavaScript
├── content.json        # Dane projektów (CMS)
├── admin.html          # Panel administracyjny
├── server.js           # Serwer Node.js
├── package.json        # Zależności Node.js
├── conder-potfolio_logo.png  # Logo
├── uploads/            # Folder na zdjęcia projektów
├── README.md           # Ten plik
├── ai_agent_rules.md   # Zasady dla AI
└── conder-portfolio_roadmap.md  # Roadmapa projektu
```

## 🎨 Funkcje

### ✅ Zaimplementowane
- **Responsywny design** - mobile-first (320-768px+)
- **Menu hamburger** - otwierane z prawej strony
- **Sticky headers sekcji** - z kolorowymi paskami nawigacyjnymi
- **Dynamiczne projekty** - wczytywane z `content.json`
- **Panel administracyjny** - dodawanie projektów z walidacją
- **Automatyczny Git push** - po dodaniu nowego projektu
- **Formularz kontaktowy** - z walidacją
- **Płynne przewijanie** - do sekcji
- **Animacje** - fade-in przy scrollowaniu
- **Styl retro** - kremowe tło, czarne ramki, kolorowe akcenty

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

## 🎨 Kolory retro (zaktualizowane)

- **Kremowe tło**: `#f5f5dc`
- **Żółty pas**: `#FFC000` (O mnie)
- **Pomarańczowy pas**: `#FF8700` (Projekty)
- **Czerwony pas**: `#FF0000` (Kontakt)
- **Czarny tekst**: `#000000`
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