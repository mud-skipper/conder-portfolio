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

### [2025-07-04] Poprawka kąta skośnej linii w dolnym pasku (footer)
- Skośna linia w dolnym pasku (footer) została ustawiona na dokładnie 45° (różnica X=Y),
- Początek linii w tym samym miejscu co w headerze (400,80),
- Koniec linii wyliczony geometrycznie, pozostałe linie bez zmian,
- Zmiana wypchnięta na GitHub Pages.

### [2025-07-04] Poprawka punktu przecięcia linii w dolnym pasku (footer)
- Skośna linia 45° kończy się na dolnej krawędzi viewBox (460,140),
- Punkt przecięcia z linią poziomą jest teraz w granicach ekranu,
- Pozioma linia od (460,140) do (1000,120) tworzy "lufę" na wysokości 20px od dołu,
- Wszystkie punkty są w granicach viewBox (1000x140).

### [2025-07-04] Finalna poprawka punktu przecięcia - wysokość 20px od dołu
- Punkt przecięcia przesunięty na (440,120) - dokładnie 20px od dolnej krawędzi,
- Skośna linia 45°: (400,80) → (440,120) - różnica X=Y=40px,
- Pozioma linia: (440,120) → (1000,120) - "lufa" na wysokości 20px od dołu,
- Geometrycznie poprawny kąt 45° z punktem przecięcia w odpowiednim miejscu.

### [2025-07-04] Poprawka kąta 45° w obu paskach + optymalizacja cienia
- **Header**: skośna linia zmieniona z (400,40) → (600,120) na (400,40) → (480,120) - dokładnie 45°,
- **Footer**: skośna linia (400,80) → (440,120) - już była 45°,
- **Cień footer**: zmniejszone rozproszenie z stdDeviation="6" na "3" i przybliżony z dy="-6" na "-4",
- Oba paski mają teraz geometrycznie poprawny kąt 45° z zachowaniem proporcji "kolba" i "lufa".

### [2025-01-07] 🔧 Rozwiązanie problemu skalowania kąta 45° - podział headera
- **Problem**: Cały SVG headera skalował się, deformując kąt 45° na różnych szerokościach ekranu
- **Rozwiązanie**: Podział headera na dwie części:
  - **Kolba** (stała): SVG 480px szerokości, preserveAspectRatio="xMidYMid meet" - nie skalowana
  - **Lufa** (skalowana): SVG calc(100% - 480px) szerokości, preserveAspectRatio="none" - skalowana do ekranu
- **Rezultat**: Kąt 45° zachowany na wszystkich urządzeniach, kolba zawsze proporcjonalna
- **Implementacja**: Zastąpienie jednego SVG dwoma elementami z odpowiednimi CSS

### [2025-01-07] Walka z footerem - problemy ze skalowaniem
- **Problem**: Footer nie wyglądał poprawnie na urządzeniach mobilnych - "kolba" się rozciągała
- **Próba 1**: Split footer (fixed "kolba" SVG + flexible "lufa" div) - nie rozwiązało problemu
- **Próba 2**: Footer od zera bez ograniczeń szerokości - footer zniknął lub wylądował poza ekranem
- **Rozwiązanie**: Całkowite usunięcie footera ze wszystkich plików - czyste pole do pracy
- **Lekcja**: SVG z preserveAspectRatio="none" + flexbox + max-width powoduje konflikty skalowania
- **Status**: Footer usunięty, header bez zmian, gotowe do nowego podejścia

### [2025-01-07] Nowa implementacja footera - wzorowana na headerze
- **Podejście**: Footer zaimplementowany dokładnie na wzór headera, ale odwrócony względem osi X i Y
- **Struktura**: SVG z preserveAspectRatio="none", viewBox="0 0 1000 140", fixed positioning
- **Kształt**: Kolba po lewej stronie, lufa po prawej (odwrócony względem headera)
- **Kąt 45°**: Skośna linia (400,100) → (480,20) - różnica X=Y=80px, geometrycznie poprawny
- **Cień**: Skierowany w górę (dy="-6"), filter id="footerShadow"
- **Zawartość**: Dwa przyciski "wyślij" (czerwony) i "CV" (żółty) w centrum
- **Pozycjonowanie**: Fixed na dole ekranu, max-width: 767px, z-index: 1000
- **Status**: Footer zaimplementowany, header poprawiony na kąt 45°, gotowe do testów

### [2025-01-07] Przywrócenie stabilnej wersji i czyszczenie kodu
- **Przywrócenie**: Projekt przywrócony z backupu session_01_07_2025 - stabilna wersja bez footera SVG
- **Czyszczenie**: Usunięto wszystkie wzmianki o footerze z głównych plików (oprócz roadmapy pełnej)
- **Optymalizacja**: Dodana zmienna CSS --font-primary, usunięto duplikaty w selektorach
- **Backupy**: Ostatni backup z 07/04/2025 18:47 - wymagane częstsze backupy!
- **Lekcja**: Robić backupy po każdej większej zmianie, nie tylko po problemach
- **Status**: Projekt czysty, zoptymalizowany, gotowy do dalszej pracy

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
- **Dolny pasek** – całkowicie usunięty, wymaga nowego podejścia bez konfliktów skalowania
- **Backupy** – robić częściej, po każdej większej zmianie, nie tylko po problemach
- Testy na różnych urządzeniach i przeglądarkach.
- Dalsza rozbudowa bocznego menu, przyciski w dolnym pasku.
- **Priorytet**: Nowa implementacja footera bez problemów ze skalowaniem

---

**Ten plik jest główną historią i przewodnikiem projektu. Używaj go w kolejnych czatach, by nie zgubić kontekstu!** 