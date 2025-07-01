# conder-portfolio\_layout\_roadmap2

## Wprowadzenie

Dokument ten opisuje kompletną **roadmapę layoutu** dla mobilnej strony portfolio **„conder-portfolio”**. Portfolio jest przeznaczone **wyłącznie dla urządzeń mobilnych** – na komputerach stacjonarnych i dużych ekranach będzie wyświetlany komunikat o braku dostępności (szczegóły poniżej). Strona składa się z czterech głównych sekcji: **Strona tytułowa**, **O mnie**, **Projekty** oraz **Kontakt**. W kolejnych rozdziałach przedstawiono strukturę tych sekcji oraz nowe funkcjonalności i ulepszenia, takie jak stałe menu górne, przewijane kolorowe paski nawigacyjne, panel administracyjny do dodawania projektów (zapisujący dane do pliku JSON) oraz automatyczną aktualizację repozytorium GitHub po dodaniu nowych treści. Wszystkie przykłady kodu (HTML, CSS, JS) zostały podane z uwzględnieniem najlepszych praktyk – w tym aspektów stylistycznych, architektonicznych i dostępności.

## Sekcje i struktura HTML

Strona zawiera 4 główne sekcje:

- **Strona tytułowa** (hero, z dużym zdjęciem i tytułem)
- **O mnie** (biogram, nagłówek z paskiem koloru #FFC000)
- **Projekty** (lista projektów z obrazami, tytułami i opisami, pasek #FF8700)
- **Kontakt** (dane + formularz, pasek #FF0000)

Układ oparty na czystym HTML/CSS/JS, z nagłówkiem strony jako `position: fixed` u góry, zawierającym logo i hamburger menu. Pod nim separator: cienka czarna linia (`border-bottom: 1px solid #000`).

Każda sekcja zawiera tytuł w postaci sticky headera z kolorowym tłem, który "przykleja się" 20px poniżej głównego menu podczas scrollowania.

## Tylko na telefon (mobile-first)

Strona wyświetla się **wyłącznie na telefonie**. Na desktopie wyświetlany jest komunikat:

```html
<div id="desktop-warning">Portfolio dostępne tylko na telefonach komórkowych.</div>
```

Z CSS:

```css
#desktop-warning { display: none; }
@media (min-width: 768px) {
  #main-content { display: none; }
  #desktop-warning {
    display: block;
    padding: 20px;
    text-align: center;
    font-weight: bold;
  }
}
```

## Scrollowane kolorowe paski (sticky headers)

Każda sekcja ma sticky header, np.:

```html
<h2 class="section-header section-about">O mnie</h2>
```

Z CSS:

```css
.section-header {
  position: sticky;
  top: 70px; /* 50px menu + 20px offset */
  z-index: 500;
  padding: 5px 10px;
  color: white;
  background-color: currentColor;
}
.section-about { color: #FFC000; }
.section-projects { color: #FF8700; }
.section-contact { color: #FF0000; }
```

Alternatywnie JS z IntersectionObserver.

## Formularz admina (admin.html)

Statyczny formularz do dodawania projektów:

- **Tytuł inwestycji**
- **Inwestor**
- **Projektant / współpraca**
- **Powierzchnia całkowita**
- **Powierzchnia użytkowa**
- **Etap** (select: koncepcja / projekt wykonawczy / realizacja)
- **Opis** (textarea, max 500 znaków, licznik znaków)
- **Zdjęcia** (3–5 plików, JPG/PNG, max 1600px szerokości, max 500KB każdy)

Fragment HTML:

```html
<form id="projectForm">
  <input type="text" id="title" required>
  <textarea id="description" maxlength="500"></textarea>
  <div id="charCounter">0/500</div>
  <input type="file" id="images" multiple accept=".jpg,.jpeg,.png">
  <button type="submit">Wyślij do conder-portfolio</button>
</form>
```

JS do licznika znaków:

```js
description.addEventListener('input', () => {
  charCounter.textContent = `${description.value.length}/500`;
});
```

JS do walidacji zdjęć:

```js
if(files.length > 5) alert('Max 5 zdjęć');
files.forEach(f => { if(f.size > 500000) alert(f.name + ' za duży'); });
```

## Zapis danych i push do GitHub

Po kliknięciu "Wyślij", dane mają zostać:

1. Zapisane do `projects.json`
2. Wgrane do GitHuba (lokalne `git add . && git commit && git push`)

Możliwości:

- skrypt Node.js lokalnie (odbierze dane, zaktualizuje `projects.json` i wykona Git)
- lub lokalny Express + fetch w admin.js (wysyła POST do `/addProject`)

Minimalny skrypt Node:

```js
fs.writeFileSync('projects.json', JSON.stringify([...projects, newProject], null, 2));
exec('git add . && git commit -m "Add project" && git push');
```

## Styl i UX

- Główne menu (`#main-header`) zawsze widoczne, oddzielone czarną linią
- Sticky headers każdej sekcji z offsetem 70px
- Wszystkie czcionki bezszeryfowe (np. Figtree, fallback: sans-serif)
- Tylko jedno `<h1>` na stronie (tytuł główny)
- Projekty formatowane jako lista `<ul><li>` z obrazkiem, `<h3>`, `<p>`
- Styl formularza zgodny ze stylem strony, responsywny, czytelny na telefonie

## Uwagi końcowe

- Strona działa jako one-page scroll, menu przenosi do sekcji
- Kolorowe paski pomagają orientować się w nawigacji
- Panel admin lokalny, nie wymaga backendu ani hostingu
- Portfolio łatwe do aktualizacji bez kodowania
- Łatwa rozbudowa (np. o podstrony projektu lub galerię)

GOTOWE ✅

