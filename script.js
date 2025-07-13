// ===== INICJALIZACJA =====
document.addEventListener('DOMContentLoaded', function() {
    loadProjectsFromJSON();
    loadAboutData();
    initAutoRefresh();
    
    // Usunięto automatyczne przewijanie do sekcji "O mnie" - może powodować konflikty z menu
    // setTimeout(() => {
    //     safeScrollToSection('home');
    // }, 100);
});

// ================= LOGO HAMBURGER MENU =================
document.addEventListener('DOMContentLoaded', function() {
    const logoHamburger = document.getElementById('logoHamburger');
    const sideMenu = document.getElementById('sideMenu');
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');
    const sideMenuClose = document.getElementById('sideMenuClose');
    const sideMenuLinks = document.querySelectorAll('.side-menu-link');
    
    // Funkcja otwierania menu
    function openSideMenu() {
        sideMenu.classList.add('active');
        sideMenuOverlay.classList.add('active');
        logoHamburger.classList.add('menu-open');
        document.body.style.overflow = 'hidden'; // Blokuje scroll na body
    }
    
    // Funkcja zamykania menu
    function closeSideMenu() {
        sideMenu.classList.remove('active');
        sideMenuOverlay.classList.remove('active');
        logoHamburger.classList.remove('menu-open');
        document.body.style.overflow = ''; // Przywraca scroll
    }
    
    // Kliknięcie w logo hamburger
    if (logoHamburger) {
        logoHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openSideMenu();
        });
    }
    
    // Kliknięcie w przycisk zamknięcia
    if (sideMenuClose) {
        sideMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeSideMenu();
        });
    }
    
    // Kliknięcie w overlay (poza menu)
    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener('click', function(e) {
            if (e.target === sideMenuOverlay) {
                closeSideMenu();
            }
        });
    }
    
    // Kliknięcie w linki menu
    sideMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetSection = this.getAttribute('data-section');
            
            // Zamykanie menu najpierw
            closeSideMenu();
            
            // Natychmiastowe przewijanie bez opóźnienia
            safeScrollToSection(targetSection);
        });
    });
    
    // Zamykanie menu klawiszem Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeSideMenu();
        }
    });
});
// ================= KONIEC LOGO HAMBURGER MENU =================

// ================= OBSŁUGA PRZYCISKÓW FOOTER =================
document.addEventListener('DOMContentLoaded', function() {
    const footerSendButton = document.getElementById('footerSendButton');
    const footerCvButton = document.getElementById('footerCvButton');

    if (footerSendButton) {
        footerSendButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'mailto:wojtek.conder@gmail.com';
        });
    }
    if (footerCvButton) {
        footerCvButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('uploads/Wojciech Conder - CV 2025.pdf', '_blank');
        });
    }
});
// ================= KONIEC OBSŁUGI PRZYCISKÓW FOOTER =================

// ===== WCZYTYWANIE PROJEKTÓW Z JSON =====
async function loadProjectsFromJSON() {
    try {
        // Dodaj cache-busting parameter
        const timestamp = new Date().getTime();
        const response = await fetch(`content.json?t=${timestamp}`);
        const data = await response.json();
        
        if (data.projects && data.projects.length > 0) {
            // Sortuj projekty po dacie realizacji (od najnowszego do najstarszego)
            const sortedProjects = data.projects.sort((a, b) => {
                const yearA = parseInt(a.year) || 0;
                const yearB = parseInt(b.year) || 0;
                return yearB - yearA; // Malejąco (najnowsze pierwsze)
            });
            
            displayProjects(sortedProjects);
        } else {
            displayEmptyProjects();
        }
    } catch (error) {
        displayEmptyProjects();
    }
}

// ===== WYŚWIETLANIE PROJEKTÓW =====
function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid) {
        return;
    }

    if (projects.length === 0) {
        displayEmptyProjects();
        return;
    }

    const projectsHTML = projects.map((project, projectIndex) => {
        // Sprawdź czy projekt ma zdjęcia
        const hasImages = project.images && project.images.length > 0;
        const mainImage = hasImages ? project.images[0] : (project.image || 'project-placeholder.jpg');
        
        // Przygotuj HTML dla zdjęć z minimalistycznymi strzałkami
        const imagesHTML = hasImages ? `
            <div class="project-images" data-project-id="${project.id}">
                <div class="image-container">
                    ${project.images.map((image, index) => `
                        <img src="uploads/${image}" 
                             alt="${project.title} - zdjęcie ${index + 1}" 
                             class="project-image ${index === 0 ? 'active' : ''}"
                             data-index="${index}"
                             onerror="this.src='project-placeholder.jpg'; this.style.display='none';"
                             loading="lazy">
                    `).join('')}
                    
                    ${project.images.length > 1 ? `
                        <button class="image-nav-btn image-nav-prev" onclick="changeImage(${project.id}, -1)">
                            <span class="nav-arrow">‹</span>
                        </button>
                        <button class="image-nav-btn image-nav-next" onclick="changeImage(${project.id}, 1)">
                            <span class="nav-arrow">›</span>
                        </button>
                        <div class="image-counter">1/${project.images.length}</div>
                    ` : ''}
                </div>
            </div>
        ` : `
            <div class="project-images">
                <div class="image-container">
                    <img src="${mainImage.startsWith('uploads/') ? mainImage : `uploads/${mainImage}`}" 
                         alt="${project.title}" 
                         class="project-image active"
                         onerror="this.src='project-placeholder.jpg';"
                         loading="lazy">
                </div>
            </div>
        `;

        // Normalizuj dane - jeśli pole jest tablicą, weź pierwszy element
        const normalizeField = (field) => {
            if (Array.isArray(field)) {
                return field[0] || '';
            }
            return field || '';
        };

        // Przygotuj dane do wyświetlenia
        const displayYear = normalizeField(project.year);
        const displayLocation = normalizeField(project.location);
        const displayType = normalizeField(project.type);
        const displayAuthor = normalizeField(project.author);
        const displayProjectType = normalizeField(project.projectType);

        return `
            <div class="project-card" data-project-id="${project.id}" id="project-${project.id}">
                <!-- 1. Nazwa inwestycji -->
                <h3 class="project-title">${project.title}</h3>
                
                <!-- 2. Lokalizacja -->
                <div class="project-location">${displayLocation}</div>
                
                <!-- 3. Zdjęcie z nawigacją -->
                ${imagesHTML}
                
                <!-- 4. Opis -->
                <div class="project-description">
                    <p>${project.description}</p>
                </div>
                
                <!-- 5. Dane szczegółowe -->
                <div class="project-details">
                    ${displayAuthor ? `
                        <div class="project-detail">
                            <strong>Autor:</strong> ${displayAuthor}
                        </div>
                    ` : ''}
                    <div class="project-detail">
                        <strong>Typ:</strong> ${displayProjectType || displayType || 'Brak'}
                    </div>
                    ${project.totalArea ? `
                        <div class="project-detail">
                            <strong>Powierzchnia całkowita:</strong> ${project.totalArea}
                        </div>
                    ` : ''}
                    ${project.usableArea ? `
                        <div class="project-detail">
                            <strong>Powierzchnia użytkowa:</strong> ${project.usableArea}
                        </div>
                    ` : ''}
                    ${!project.totalArea && !project.usableArea && project.area ? `
                        <div class="project-detail">
                            <strong>Powierzchnia:</strong> ${project.area}
                        </div>
                    ` : ''}
                    <div class="project-detail">
                        <strong>Status:</strong> ${project.stage || project.status || 'Brak'}${project.year ? ` (${project.year})` : ''}
                    </div>
                    ${project.investor ? `
                        <div class="project-detail">
                            <strong>Inwestor:</strong> ${project.investor}
                        </div>
                    ` : ''}
                    ${project.designer ? `
                        <div class="project-detail">
                            <strong>Projektant:</strong> ${project.designer}
                        </div>
                    ` : ''}
                </div>
                
                ${projectIndex < projects.length - 1 ? '<div class="project-separator"></div>' : ''}
            </div>
        `;
    }).join('') + '<div class="projects-section-end"></div>';

    projectsGrid.innerHTML = projectsHTML;
}

// ===== FUNKCJE POMOCNICZE =====
function displayEmptyProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid) {
        return;
    }

    projectsGrid.innerHTML = `
        <div class="empty-projects">
            <p>Brak projektów do wyświetlenia</p>
            <p>Dodaj pierwszy projekt przez panel administratora</p>
        </div>
    `;
}

// Funkcja sprawdzająca czy projekty są załadowane
function areProjectsLoaded() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return false;
    
    // Sprawdź czy są projekty lub komunikat o braku projektów
    return projectsGrid.children.length > 0 && 
           !projectsGrid.querySelector('.loading-projects');
}

// Funkcja do bezpiecznego przewijania z uwzględnieniem dynamicznych elementów
function safeScrollToSection(sectionId) {
    /*
     * Uproszczona logika przewijania (aktualizacja 2025-01-10):
     * - home: 0px (bez offsetu)
     * - projects: 0px (bez offsetu)
     * - contact: 0px (bez offsetu)
     * - project-* (pojedynczy projekt): 120px
     */
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;

    // Sprawdź czy strona jest w pełni załadowana
    if (document.readyState !== 'complete') {
        setTimeout(() => safeScrollToSection(sectionId), 100);
        return;
    }

    // Jeśli to sekcja projektów, poczekaj na załadowanie
    if (sectionId === 'projects' && !areProjectsLoaded()) {
        setTimeout(() => safeScrollToSection(sectionId), 200);
        return;
    }

    // Specjalna obsługa dla sekcji kontakt - może wymagać dodatkowego czasu
    if (sectionId === 'contact') {
        // Sprawdź czy sekcja kontakt jest w pełni wyrenderowana
        const contactSection = document.querySelector('.contact-section');
        if (contactSection && contactSection.offsetHeight < 100) {
            setTimeout(() => safeScrollToSection(sectionId), 150);
            return;
        }
        
        // Dodatkowe sprawdzenie czy strona jest w pełni załadowana
        if (document.readyState !== 'complete' || window.scrollY === 0) {
            setTimeout(() => safeScrollToSection(sectionId), 200);
            return;
        }
        
        // Dodatkowe sprawdzenie czy sekcja kontakt jest w pełni pozycjonowana
        const contactRect = contactSection.getBoundingClientRect();
        if (contactRect.height < 400) {
            setTimeout(() => safeScrollToSection(sectionId), 100);
            return;
        }
        
        // Dodatkowe sprawdzenie czy sekcja kontakt jest w pełni załadowana
        if (contactSection.offsetTop === 0) {
            setTimeout(() => safeScrollToSection(sectionId), 100);
            return;
        }
    }

    let scrollOffset = 0; // bez offsetu dla wszystkich sekcji
    if (sectionId.startsWith('project-')) {
        scrollOffset = 120; // offset dla pojedynczego projektu
    }

    // Płynne przewijanie z lepszym zarządzaniem animacjami
    const targetPosition = targetElement.offsetTop - scrollOffset;
    
    // Sprawdź czy już jesteśmy blisko celu
    const currentScroll = window.scrollY;
    const distance = Math.abs(currentScroll - targetPosition);
    
    // Jeśli jesteśmy już blisko, przewiń natychmiast
    if (distance < 50) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'auto'
        });
    } else {
        // W przeciwnym razie użyj płynnej animacji
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Automatyczne odświeżanie projektów co 30 sekund
function initAutoRefresh() {
    setInterval(() => {
        loadProjectsFromJSON();
        loadAboutData();
    }, 30000); // 30 sekund
}

// ===== FUNKCJA NAWIGACJI ZDJĘĆ =====
function changeImage(projectId, direction) {
    const projectImages = document.querySelectorAll(`[data-project-id="${projectId}"] .project-image`);
    const counter = document.querySelector(`[data-project-id="${projectId}"] .image-counter`);
    
    if (projectImages.length <= 1) return;
    
    let currentIndex = 0;
    projectImages.forEach((img, index) => {
        if (img.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Ukryj aktualne zdjęcie
    projectImages[currentIndex].classList.remove('active');
    
    // Oblicz nowy indeks
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = projectImages.length - 1;
    if (newIndex >= projectImages.length) newIndex = 0;
    
    // Pokaż nowe zdjęcie
    projectImages[newIndex].classList.add('active');
    
    // Zaktualizuj licznik
    if (counter) {
        counter.textContent = `${newIndex + 1}/${projectImages.length}`;
    }
}

// ================= DYNAMICZNE LINKI DO PROJEKTÓW W MENU BOCZNYM =================
function updateSideMenuProjectLinks(projects) {
    const sideMenu = document.getElementById('sideMenu');
    if (!sideMenu) return;
    const navList = sideMenu.querySelector('.side-menu-nav');
    if (!navList) return;

    // Usuń stare linki projektów (jeśli istnieją)
    const oldProjectLinks = navList.querySelectorAll('.side-menu-project-link');
    oldProjectLinks.forEach(link => link.parentElement.remove());

    // Znajdź pozycję "Projekty"
    const projectsMenuItem = navList.querySelector('a[data-section="projects"]');
    if (!projectsMenuItem) return;
    const projectsLi = projectsMenuItem.closest('li');
    if (!projectsLi) return;

    // Dodaj linki do projektów pod "Projekty" (odwrócone względem sekcji - od najnowszego do najstarszego)
    projects.slice().reverse().forEach(project => {
        const li = document.createElement('li');
        li.className = 'side-menu-item';
        const a = document.createElement('a');
        a.className = 'side-menu-link side-menu-project-link';
        a.href = `#project-${project.id}`;
        a.textContent = project.title;
        li.appendChild(a);
        projectsLi.after(li);
    });
}

// Modyfikacja displayProjects, by wywołać updateSideMenuProjectLinks
const originalDisplayProjects = displayProjects;
displayProjects = function(projects) {
    originalDisplayProjects(projects);
    updateSideMenuProjectLinks(projects);
}
// ================= KONIEC DYNAMICZNYCH LINKÓW =================

// ===== ŁADOWANIE DANYCH "O MNIE" =====
async function loadAboutData() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`content.json?t=${timestamp}`);
        const data = await response.json();
        
        console.log('Dane "O mnie" załadowane:', data.about);
        
        if (data.about) {
            // Ustaw hero-image na zdjęcie profilowe
            const mainProfileImage = document.getElementById('mainProfileImage');
            if (mainProfileImage && data.about.profileImage && data.about.profileImage.trim() !== '') {
                const imagePath = `uploads/${data.about.profileImage}`;
                mainProfileImage.src = imagePath;
                mainProfileImage.style.display = 'block';
                mainProfileImage.onload = function() { console.log('Zdjęcie profilowe załadowane pomyślnie'); };
                mainProfileImage.onerror = function() { console.error('Błąd ładowania zdjęcia profilowego:', imagePath); };
            } else if (mainProfileImage) {
                mainProfileImage.src = 'conder-portfolio_layout.01-photo.jpg';
                mainProfileImage.style.display = 'block';
            }

            // Funkcja pomocnicza do formatowania tekstu jako lista
            const formatTextAsList = (text) => {
                if (!text) return '';
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                return lines.map(line => `<li>${line.trim()}</li>`).join('');
            };
            // Funkcja pomocnicza do formatowania zwykłego tekstu
            const formatText = (text) => {
                if (!text) return '';
                return text.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
            };
            // Pobierz aktualny język
            const lang = (typeof currentLang !== 'undefined' ? currentLang : (localStorage.getItem('portfolio_lang') || 'pl'));
            // Helper do pobierania pola z fallbackiem
            const getField = (obj, field) => {
                if (lang === 'en' && obj[field + '_en'] && obj[field + '_en'].trim() !== '') {
                    return obj[field + '_en'];
                }
                return obj[field] || '';
            };
            // Opis "O mnie"
            const aboutBio = document.getElementById('aboutBio');
            if (aboutBio) {
                aboutBio.innerHTML = formatText(getField(data.about, 'bio'));
            }
            // Edukacja
            const educationSection = document.getElementById('educationSection');
            const educationText = document.getElementById('educationText');
            const educationVal = getField(data.about, 'education');
            if (educationSection && educationText && educationVal.trim() !== '') {
                educationText.innerHTML = formatTextAsList(educationVal);
                educationSection.style.display = 'block';
            }
            // Doświadczenie
            const experienceSection = document.getElementById('experienceSection');
            const experienceText = document.getElementById('experienceText');
            const experienceVal = getField(data.about, 'experience');
            if (experienceSection && experienceText && experienceVal.trim() !== '') {
                experienceText.innerHTML = formatTextAsList(experienceVal);
                experienceSection.style.display = 'block';
            }
            // Kluczowe osiągnięcia
            const achievementsSection = document.getElementById('achievementsSection');
            const achievementsText = document.getElementById('achievementsText');
            const achievementsVal = getField(data.about, 'achievements');
            if (achievementsSection && achievementsText && achievementsVal.trim() !== '') {
                achievementsText.innerHTML = formatTextAsList(achievementsVal);
                achievementsSection.style.display = 'block';
            }
            // Współpraca
            const collaborationSection = document.getElementById('collaborationSection');
            const collaborationText = document.getElementById('collaborationText');
            const collaborationVal = getField(data.about, 'collaboration');
            if (collaborationSection && collaborationText && collaborationVal.trim() !== '') {
                collaborationText.innerHTML = formatTextAsList(collaborationVal);
                collaborationSection.style.display = 'block';
            }
            // Umiejętności
            const skillsSection = document.getElementById('skillsSection');
            const skillsText = document.getElementById('skillsText');
            const skillsVal = getField(data.about, 'skills');
            if (skillsSection && skillsText && skillsVal.trim() !== '') {
                skillsText.innerHTML = formatTextAsList(skillsVal);
                skillsSection.style.display = 'block';
            }
            // Programy komputerowe
            const softwareSection = document.getElementById('softwareSection');
            const softwareText = document.getElementById('softwareText');
            const softwareVal = getField(data.about, 'software');
            if (softwareSection && softwareText && softwareVal.trim() !== '') {
                softwareText.innerHTML = formatTextAsList(softwareVal);
                softwareSection.style.display = 'block';
            }
            // Zainteresowania
            const interestsSection = document.getElementById('interestsSection');
            const interestsText = document.getElementById('interestsText');
            const interestsVal = getField(data.about, 'interests');
            if (interestsSection && interestsText && interestsVal.trim() !== '') {
                interestsText.innerHTML = formatTextAsList(interestsVal);
                interestsSection.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Błąd ładowania danych "O mnie":', error);
    }
}

/* Usunięta nieużywana funkcja nawigacji zdjęć */

/* Usunięte nieużywane event listenery dla przycisków */ 

// ====== WIELOJĘZYCZNOŚĆ: ŁADOWANIE I PRZEŁĄCZANIE JĘZYKA ======
const LANG_KEY = 'portfolio_lang';
const DEFAULT_LANG = 'pl';
let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
let translations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        translations = await response.json();
    } catch (e) {
        translations = {};
    }
}

function updateStaticTexts() {
    // Menu boczne
    const menuAbout = document.querySelector('.side-menu-link[data-section="home"] .menu-text');
    const menuProjects = document.querySelector('.side-menu-link[data-section="projects"] .menu-text');
    const menuContact = document.querySelector('.side-menu-link[data-section="contact"] .menu-text');
    if (menuAbout && translations.menu) menuAbout.textContent = translations.menu.about;
    if (menuProjects && translations.menu) menuProjects.textContent = translations.menu.projects;
    if (menuContact && translations.menu) menuContact.textContent = translations.menu.contact;
    // Nagłówki sekcji
    const sectionAbout = document.querySelector('.section-header-yellow');
    const sectionProjects = document.querySelector('.section-header-orange');
    const sectionContact = document.querySelector('.section-header-red');
    if (sectionAbout && translations.sections) sectionAbout.textContent = translations.sections.about;
    if (sectionProjects && translations.sections) sectionProjects.textContent = translations.sections.projects;
    if (sectionContact && translations.sections) sectionContact.textContent = translations.sections.contact;
    // Przyciski footer
    const btnSend = document.getElementById('footerSendButton');
    const btnCv = document.getElementById('footerCvButton');
    if (btnSend && translations.footer) btnSend.setAttribute('aria-label', translations.footer.send);
    if (btnCv && translations.footer) btnCv.textContent = translations.footer.cv;
}

function setActiveLangButton() {
    const btnPl = document.getElementById('langBtnPl');
    const btnEn = document.getElementById('langBtnEn');
    if (btnPl && btnEn) {
        btnPl.classList.toggle('active', currentLang === 'pl');
        btnEn.classList.toggle('active', currentLang === 'en');
    }
}

async function switchLanguage(lang) {
    if (lang !== 'pl' && lang !== 'en') lang = DEFAULT_LANG;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    await loadTranslations(lang);
    updateStaticTexts();
    setActiveLangButton();
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja języka
    switchLanguage(currentLang);
    // Obsługa kliknięć w przyciski języka
    const btnPl = document.getElementById('langBtnPl');
    const btnEn = document.getElementById('langBtnEn');
    if (btnPl) btnPl.addEventListener('click', () => switchLanguage('pl'));
    if (btnEn) btnEn.addEventListener('click', () => switchLanguage('en'));
});
// ====== KONIEC WIELOJĘZYCZNOŚCI ====== 