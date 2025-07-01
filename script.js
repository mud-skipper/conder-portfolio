// ===== GŁÓWNE FUNKCJE =====

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    loadProjectsFromJSON();
    initContactForm();
    initSmoothScrolling();
    initAnimations();
    initSectionTabs();
    initBottomPanel();
});

// ===== MENU HAMBURGER - POPRAWIONE =====
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Sprawdź czy menu istnieje, jeśli nie - utwórz je
    if (!navMenu) {
        createNavMenu();
    }
    
    const navMenuNew = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenuNew.classList.toggle('active');
    });

    // Zamykanie menu po kliknięciu w link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenuNew.classList.remove('active');
        });
    });

    // Zamykanie menu po kliknięciu poza nim
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenuNew.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenuNew.classList.remove('active');
        }
    });
}

// Tworzenie menu nawigacyjnego
function createNavMenu() {
    const nav = document.createElement('nav');
    nav.className = 'nav-menu';
    nav.id = 'nav-menu';
    
    nav.innerHTML = `
        <ul>
            <li><a href="#home" class="nav-link">Strona główna</a></li>
            <li><a href="#about" class="nav-link">O mnie</a></li>
            <li><a href="#projects" class="nav-link">Projekty</a></li>
            <li><a href="#contact" class="nav-link">Kontakt</a></li>
        </ul>
    `;
    
    document.body.appendChild(nav);
}

// ===== WCZYTYWANIE PROJEKTÓW Z JSON =====
async function loadProjectsFromJSON() {
    try {
        const response = await fetch('content.json');
        const data = await response.json();
        
        if (data.projects && data.projects.length > 0) {
            displayProjects(data.projects);
        } else {
            console.log('Brak projektów w pliku JSON');
        }
    } catch (error) {
        console.error('Błąd podczas wczytywania projektów:', error);
        // Fallback - wyświetl przykładowy projekt
        displayFallbackProject();
    }
}

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid) {
        console.error('Nie znaleziono elementu projects-grid');
        return;
    }

    // Wyczyść istniejące projekty
    projectsGrid.innerHTML = '';

    // Wyświetl każdy projekt
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project-id', project.id);

    // Określ ikonę na podstawie typu projektu
    const projectIcon = getProjectIcon(project.type);
    
    // Sprawdź czy projekt ma obrazek
    const hasImage = project.image && project.image !== 'project-placeholder.jpg';
    
    card.innerHTML = `
        <div class="project-image">
            ${hasImage ? 
                `<img src="${project.image}" alt="${project.title}" loading="lazy">` :
                `<div class="image-placeholder">
                    <span>${projectIcon}</span>
                    <p>${project.title}</p>
                </div>`
            }
        </div>
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-meta">
                <span class="project-year">${project.year}</span>
                <span class="project-location">${project.location}</span>
                <span class="project-status">${project.status}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-details">
                <span class="project-area">Powierzchnia: ${project.area}</span>
            </div>
            <a href="${project.link}" class="project-link">Zobacz szczegóły</a>
        </div>
    `;

    // Dodaj animację przy scrollowaniu
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);

    return card;
}

function getProjectIcon(type) {
    const icons = {
        'mieszkaniowy': '🏢',
        'biurowy': '🏢',
        'kulturalny': '🎭',
        'jednorodzinny': '🏠',
        'hotelowy': '🏨',
        'edukacyjny': '🎓'
    };
    return icons[type] || '🏗️';
}

function displayFallbackProject() {
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        projectsGrid.innerHTML = `
            <div class="project-card">
                <div class="project-image">
                    <div class="image-placeholder">
                        <span>🏗️</span>
                        <p>Muzeum Pamięci Palmiry</p>
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">Muzeum Pamięci Palmiry</h3>
                    <div class="project-meta">
                        <span class="project-year">2009</span>
                        <span class="project-location">Warszawa</span>
                        <span class="project-status">ukończony</span>
                    </div>
                    <p class="project-description">
                        Projekt w ramach WXCA, zwycięski w przetargu. Realizacja muzeum z ekspozycją historyczną w lesie pod Warszawą.
                    </p>
                    <div class="project-details">
                        <span class="project-area">Powierzchnia: 2,500 m²</span>
                    </div>
                    <a href="#" class="project-link">Zobacz szczegóły</a>
                </div>
            </div>
        `;
    }
}

// ===== FORMULARZ KONTAKTOWY =====
function initContactForm() {
    const contactForm = document.querySelector('.contact-form-block');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleFormSubmission();
        });
    }
}

function handleFormSubmission() {
    const form = document.querySelector('.contact-form-block');
    const email = form.querySelector('.contact-input').value;
    const message = form.querySelector('.contact-textarea').value;
    
    // Walidacja
    if (!email || !message) {
        showNotification('Proszę wypełnić wszystkie pola', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Proszę podać poprawny adres email', 'error');
        return;
    }
    
    // Symulacja wysłania (w rzeczywistej implementacji byłby tu fetch do serwera)
    showNotification('Dziękuję za wiadomość! Odpowiem najszybciej jak to możliwe.', 'success');
    
    // Wyczyść formularz
    form.reset();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Usuń istniejące powiadomienia
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Utwórz nowe powiadomienie
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style powiadomienia
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    // Usuń powiadomienie po 3 sekundach
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scrolling jest już obsługiwane przez CSS scroll-behavior: smooth
    // Dodatkowo obsługujemy linki z hash
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== ANIMACJE =====
function initAnimations() {
    // Animacje fade-in dla elementów przy scrollowaniu
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Obserwuj elementy do animacji
    const animatedElements = document.querySelectorAll('.about-text-block, .project-info-block, .contact-info-block');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// ===== UTILITARIA =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== LOGI =====
console.log('🚀 Portfolio Wojciecha Condera - wersja mobile-first');
console.log('📱 Strona w pełni responsywna i gotowa do użycia');
console.log('🎯 Menu hamburger, projekty z JSON i formularz kontaktowy aktywne');
console.log('🎨 Nowy layout z sticky paskami nawigacyjnymi');

// ===== STICKY ZAKŁADKI I NAWIGACJA - POPRAWIONE =====
function initSectionTabs() {
    const tabButtons = document.querySelectorAll('.tab');
    const sections = [
        { id: 'home', tab: '.tab-omnie' },
        { id: 'about', tab: '.tab-omnie' },
        { id: 'projects', tab: '.tab-projekty' },
        { id: 'contact', tab: '.tab-kontakt' }
    ];

    // Smooth scroll po kliknięciu zakładki
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const target = btn.getAttribute('data-target');
            if (target && document.querySelector(target)) {
                e.preventDefault();
                document.querySelector(target).scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });

    // Scrollspy - podświetlanie aktywnej zakładki (poprawione - sekwencyjne)
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const headerHeight = 160; // Wysokość sticky header (2x większy)
        
        // Znajdź aktualną sekcję na podstawie pozycji scroll
        let currentSection = 'home';
        
        const homeSection = document.getElementById('home');
        const aboutSection = document.getElementById('about');
        const projectsSection = document.getElementById('projects');
        const contactSection = document.getElementById('contact');
        
        // Sekwencyjne przełączanie - każda sekcja ma swoją strefę
        if (contactSection && scrollTop >= contactSection.offsetTop - headerHeight - 200) {
            currentSection = 'contact';
        } else if (projectsSection && scrollTop >= projectsSection.offsetTop - headerHeight - 200) {
            currentSection = 'projects';
        } else if (aboutSection && scrollTop >= aboutSection.offsetTop - headerHeight - 200) {
            currentSection = 'about';
        } else {
            currentSection = 'home';
        }
        
        // Zmień aktywność zakładek - tylko jedna aktywna na raz
        tabButtons.forEach(btn => {
            const target = btn.getAttribute('data-target');
            if (target === '#' + currentSection) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });

    // Obsługa przycisku CV (placeholder)
    const cvBtns = document.querySelectorAll('.contact-btn-cv');
    cvBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Tutaj będzie pobieranie CV lub link do pliku.');
        });
    });
}

// ===== DOLNY PANEL Z PRZYCISKAMI AKCJI =====
function initBottomPanel() {
    const emailBtn = document.querySelector('.action-email');
    const cvBtn = document.querySelector('.action-cv');
    
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            // Przewiń do sekcji kontakt
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (cvBtn) {
        cvBtn.addEventListener('click', function() {
            // Tutaj możesz dodać logikę dla CV
            // Na przykład otwarcie PDF lub nowej strony
            alert('CV będzie dostępne wkrótce!');
        });
    }
} 