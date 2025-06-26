# 📱 Projekt: Wojciech Conder Portfolio (Mobile-first) — Kompletny Plan Rozwoju dla Cursor + AI

---

### 🎯 CEL PROJEKTU
Stworzenie w pełni responsywnej, estetycznej strony portfolio architekta w stylu retro, zoptymalizowanej na telefony komórkowe z opcją łatwego dostępu przez QR-kod i możliwością zarządzania treścią z poziomu administratora (CMS).

---

## 🔧 TECHNOLOGIE I SYSTEMY
| Obszar | Technologia |
|--------|-------------|
| Frontend | HTML5 + CSS3 (mobile-first), JS optional |
| CMS (edytor treści) | Plik JSON lub Firebase (opcja) |
| Hosting | GitHub Pages lub Netlify (darmowe) |
| QR-kod | Generator QR (np. qrcode-monkey.com) |
| AI/Dev Assist | Cursor + AI agent (np. ChatGPT w edytorze) |

---

## 🧱 STRUKTURA STRONY (Układ mobilny)

### 1. Strona Główna
- Logo (góra lewa)
- Menu (hamburger, prawa strona)
- Nagłówek: "Wojciech Conder - Architekt"
- Podtytuł: "Projektuję przestrzeń do życia i pracy"
- Przycisk CTA: "Zobacz projekty" (scroll do sekcji)

### 2. Sekcja O mnie
- Zdjęcie profilowe (retro styl)
- Krótkie bio (2–3 zdania)
- Link "czytaj więcej" (otwiera timeline kariery)

### 3. Sekcja Projekty
- Kafelki (1–2 kolumny, responsywnie)
- Elementy:
  - Zdjęcie projektu
  - Tytuł
  - Rok
  - Lokalizacja
  - Krótki opis
  - Link "zobacz szczegóły"
- (Opcja) Filtrowanie po typie/roku/lokalizacji

### 4. Sekcja Kontakt
- Mini formularz (imię, e-mail, wiadomość)
- Ikony social media (FB/Insta/LinkedIn)
- Lokalizacja: "Warszawa / zdalnie"

### 5. Stopka
- "© 2025 Wojciech Conder"
- Polityka prywatności (link)
- "Stworzone z ♥ w HTML"

---

## 🌈 STYL I KOLORYSTYKA
- Tło: kremowe
- Ukośne pasy: żółty, pomarańczowy, czerwony (w stylu kaset VHS)
- Font: nowoczesny (np. Inter, DM Sans)
- Przycisk CTA: białe tło, czarna ramka / pomarańczowy border (hover)

---

## 🗂️ MENU (hamburger)
Po kliknięciu:
- Strona główna (scroll)
- O mnie
- Projekty
- Kontakt
- Język (PL/EN)
- Tryb jasny/ciemny (opcja)
- Udostępnij (linki social / kopiuj URL)

---

## 🔗 QR-KOD + HOSTING
- Finalna wersja strony hostowana na GitHub Pages lub Netlify
- Generowany QR z linkiem do strony
- Wstawiany do CV / wizytówek / plansz

---

## 🧠 SYSTEM ADMINISTRACYJNY (CMS Light)
- Dane treści przechowywane w pliku `content.json` lub online (np. Firebase)
- Administrator (czyli Ty) może edytować:
  - Zdjęcia projektów (upload do folderu lub link)
  - Tytuły, opisy, rok, lokalizacje
- Opcjonalnie prosty formularz admin (local only) + autoryzacja hasłem

---

## 🤖 INSTRUKCJE DLA AGENTA AI W CURSOR

**Krok 1:** Utwórz nowy projekt `conder-portfolio`

**Krok 2:** Utwórz pliki:
- `index.html`
- `style.css`
- `content.json` (dane projektów)

**Krok 3:** Zakoduj strukturę strony wg sekcji powyżej
- Użyj semantycznego HTML5 (section, header, main, footer)
- Stylizuj wg stylu retro (kolory, typografia, pasy tła)

**Krok 4:** Dodaj przycisk "Zobacz projekty" jako anchor do sekcji `#projekty`

**Krok 5:** Zakoduj menu hamburgerowe (JS lub checkbox hack)

**Krok 6:** Zintegruj `content.json` z sekcją "Projekty"
- Dynamiczne wstawianie danych za pomocą JS (lub na sztywno w HTML jako fallback)

**Krok 7:** Wygeneruj QR-kod z adresem docelowym strony (placeholder na start)

**Krok 8:** Przetestuj stronę w rozdzielczościach mobile: 320–768 px

**Krok 9:** Opublikuj na GitHub Pages lub Netlify

**Krok 10:** Wygeneruj QR i dodaj do CV

**Koniec misji!** ✅
