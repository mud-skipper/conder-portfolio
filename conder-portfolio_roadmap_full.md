# 📋 conder-portfolio – Pełna Roadmapa i Historia Projektu

## Struktura projektu

- **index.html** – główny plik HTML, cała aplikacja typu single-page.
- **style.css** – główny plik stylów, retro-minimalistyczny design, zmienne CSS, responsywność mobile-first.
- **script.js** – logika JS: ładowanie danych z JSON, obsługa menu, dynamiczne sekcje.
- **content.json** – dane o projektach, biografii, edukacji, itd.
- **conder-portfolio_roadmap.md** – roadmapa zmian (krótkie notatki, ostrzeżenia, TODO).
- **conder-portfolio_roadmap_full.md** – (ten plik) pełna historia projektu, decyzje, problemy, rozwiązania.
- **backup/** – kopie zapasowe, starsze wersje plików, zrzuty ekranu.
- **uploads/** – obrazy do portfolio.

## Główne założenia projektu

- Portfolio architekta, mobile-first, blokada desktopów.
- Header o nieregularnym kształcie (SVG, "pistolet").
- Logo jako menu hamburger (otwiera boczne menu).
- Wszystko edytowalne przez JSON.
- Kod czysty, z komentarzami, łatwy do rozbudowy.

## Najważniejsze działania i decyzje

### 1. Blokada desktopów
- Zastosowano media query @media (min-width: 768px) – wyświetla komunikat i ukrywa całą zawartość na desktopie.

### 2. Header (górny pasek)
- SVG z "lufą" po lewej, skośna 45°, prawa strona wyższa.
- Logo jako przycisk menu hamburger.
- Cień pod linią (SVG filter, feDropShadow, pionowo w dół, subtelny, potem mocniejszy, potem jaśniejszy i bliżej linii).
- **Problem:** cień "wlewał się" na header – rozwiązanie: precyzyjne ustawienie dy i opacity.
- **Ostrzeżenie:** NIE RUSZAĆ headera bez zgody użytkownika!

### 3. Boczne menu (hamburger)
- Logo otwiera boczne menu (off-canvas), linki do sekcji.
- Zamykane kliknięciem poza menu, kliknięciem w link lub Escape.

### 4. Dolny pasek (footer-bar)
- **Obecny stan:** Dolny pasek usunięty, pole czyste do dalszych działań.
- **Plan:** Implementacja nowego dolnego paska na wzór paska górnego.

### 5. Backupy i bezpieczeństwo
- Po każdej większej zmianie robione backupy w folderze backup/.
- Roadmapa aktualizowana na bieżąco.

## Najważniejsze porażki i lekcje
- SVG z preserveAspectRatio="none" rozciąga kształt na różnych szerokościach – lepiej używać "meet" lub "slice".
- SVG nie obsługuje procentów w points – trzeba przeliczać na wartości względem viewBox.
- Cień SVG może "wlewać się" na inne elementy – trzeba precyzyjnie ustawiać dy, stdDeviation, opacity.
- Lepiej rysować kształty "od zera" niż kopiować i odbijać, bo łatwiej o błąd.
- Zawsze testować na różnych szerokościach ekranu!
- Dolny pasek wymaga nowego podejścia - implementacja na wzór paska górnego.

## Co działa dobrze
- Header, logo, boczne menu, retro-minimalistyczny styl, responsywność, blokada desktopów.
- Kod jest czytelny, łatwy do rozbudowy, dobrze skomentowany.

## Co wymaga uwagi/przyszłych poprawek
- Dolny pasek – do implementacji na wzór paska górnego.
- Testy na różnych urządzeniach i przeglądarkach.
- Dalsza rozbudowa bocznego menu, przyciski w dolnym pasku.

---

**Ten plik jest główną historią i przewodnikiem projektu. Używaj go w kolejnych czatach, by nie zgubić kontekstu!** 