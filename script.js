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
    initAutoRefresh();
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
        // Dodaj cache-busting parameter
        const timestamp = new Date().getTime();
        const response = await fetch(`content.json?t=${timestamp}`);
        const data = await response.json();
        
        if (data.projects && data.projects.length > 0) {
            displayProjects(data.projects);
            console.log(`Załadowano ${data.projects.length} projektów`);
        } else {
            displayEmptyProjects();
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

    if (projects.length === 0) {
        displayEmptyProjects();
        return;
    }

    const projectsHTML = projects.map(project => {
        // Sprawdź czy projekt ma zdjęcia
        const hasImages = project.images && project.images.length > 0;
        const mainImage = hasImages ? project.images[0] : (project.image || 'project-placeholder.jpg');
        
        // Przygotuj HTML dla zdjęć
        const imagesHTML = hasImages ? `
            <div class="project-images">
                ${project.images.map((image, index) => `
                    <img src="uploads/${image}" 
                         alt="${project.title} - zdjęcie ${index + 1}" 
                         class="project-image ${index === 0 ? 'main-image' : 'secondary-image'}"
                         onerror="this.src='project-placeholder.jpg'; this.style.display='none';"
                         loading="lazy">
                `).join('')}
            </div>
        ` : `
            <div class="project-images">
                <img src="${mainImage.startsWith('uploads/') ? mainImage : `uploads/${mainImage}`}" 
                     alt="${project.title}" 
                     class="project-image main-image"
                     onerror="this.src='project-placeholder.jpg';"
                     loading="lazy">
            </div>
        `;

        return `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-meta">
                        <span class="project-year">${project.year}</span>
                        <span class="project-location">${project.location}</span>
                    </div>
                </div>
                
                ${imagesHTML}
                
                <div class="project-content">
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-details">
                        <div class="project-detail">
                            <strong>Typ:</strong> ${project.type || 'Brak'}
                        </div>
                        <div class="project-detail">
                            <strong>Powierzchnia:</strong> ${project.area || 'Brak'}
                        </div>
                        <div class="project-detail">
                            <strong>Status:</strong> ${project.status || 'Brak'}
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
                </div>
            </div>
        `;
    }).join('');

    projectsGrid.innerHTML = projectsHTML;
}

// ===== FORMULARZ KONTAKTOWY =====
function initContactForm() {
    const contactForm = document.querySelector('.contact-form-block');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            handleFormSubmission(e);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const emailInput = document.querySelector('.contact-input');
    const messageInput = document.querySelector('.contact-textarea');
    
    if (!emailInput || !messageInput) {
        console.error('Nie znaleziono pól formularza');
        return;
    }
    
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Walidacja
    if (!email) {
        showNotification('Proszę podać adres email', 'error');
        emailInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Proszę podać poprawny adres email', 'error');
        emailInput.focus();
        return;
    }
    
    if (!message) {
        showNotification('Proszę wpisać wiadomość', 'error');
        messageInput.focus();
        return;
    }
    
    if (message.length < 10) {
        showNotification('Wiadomość musi mieć co najmniej 10 znaków', 'error');
        messageInput.focus();
        return;
    }
    
    // Symulacja wysłania (w rzeczywistej aplikacji tutaj byłby fetch do serwera)
    showNotification('Wysyłanie wiadomości...', 'info');
    
    setTimeout(() => {
        // Wyczyść formularz
        emailInput.value = '';
        messageInput.value = '';
        
        showNotification('Wiadomość została wysłana! Dziękujemy za kontakt.', 'success');
        
        // Otwórz email client jako fallback
        const subject = 'Nowa wiadomość z portfolio - Wojciech Conder';
        const body = `Email: ${email}\n\nWiadomość:\n${message}`;
        const mailtoLink = `mailto:wojtek.conder@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Usuń istniejące notyfikacje
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Utwórz nową notyfikację
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Dodaj style inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        max-width: 90%;
        text-align: center;
        animation: slideInDown 0.3s ease-out;
    `;
    
    // Dodaj do body
    document.body.appendChild(notification);
    
    // Obsługa zamknięcia
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Automatyczne zamknięcie po 5 sekundach
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutUp 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// ===== SMOOTH SCROLLING - POPRAWIONE =====
function initSmoothScrolling() {
    // Smooth scroll dla linków nawigacyjnych
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = window.innerHeight * 0.2; // 20vh
                const offset = headerHeight + 10; // Dodatkowy offset
                
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Smooth scroll dla przycisku "kontakt" w sekcji projektów
    const projectContactBtn = document.querySelector('.project-contact-btn');
    if (projectContactBtn) {
        projectContactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const headerHeight = window.innerHeight * 0.2;
                const stickyHeaderHeight = 50;
                const offset = headerHeight + stickyHeaderHeight + 10;
                
                const targetPosition = contactSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ===== ANIMACJE - POPRAWIONE =====
function initAnimations() {
    // Intersection Observer dla animacji przy scrollowaniu
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Obserwuj elementy do animacji
    const animatedElements = document.querySelectorAll('.project-card, .about-text-block, .contact-info-block');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    
    // Animacja hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        setTimeout(() => {
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'translateY(0)';
        }, 300);
    }
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

// ===== ZAKŁADKI SEKCJI - POPRAWIONE =====
function initSectionTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Usuń aktywną klasę ze wszystkich zakładek
                tabs.forEach(t => t.classList.remove('active'));
                
                // Dodaj aktywną klasę do klikniętej zakładki
                this.classList.add('active');
                
                // Przewiń do sekcji z offsetem dla sticky header
                const headerHeight = window.innerHeight * 0.2; // 20vh
                const stickyHeaderHeight = 50; // Wysokość sticky header
                const offset = headerHeight + stickyHeaderHeight + 10; // Dodatkowy offset
                
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Aktualizuj aktywną zakładkę podczas scrollowania
    window.addEventListener('scroll', debounce(function() {
        const sections = ['#about', '#projects', '#contact'];
        const headerHeight = window.innerHeight * 0.2;
        const stickyHeaderHeight = 50;
        const offset = headerHeight + stickyHeaderHeight;
        
        let currentSection = '';
        
        sections.forEach(sectionId => {
            const section = document.querySelector(sectionId);
            if (section) {
                const sectionTop = section.offsetTop - offset;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                    currentSection = sectionId;
                }
            }
        });
        
        // Aktualizuj aktywną zakładkę
        tabs.forEach(tab => {
            const tabTarget = tab.getAttribute('data-target');
            if (tabTarget === currentSection) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }, 100));
}

// ===== DOLNY PANEL Z PRZYCISKAMI AKCJI =====
function initBottomPanel() {
    const emailBtn = document.querySelector('.action-email');
    const cvBtn = document.querySelector('.action-cv');
    
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            // Otwórz email client
            const email = 'wojtek.conder@gmail.com';
            const subject = 'Zapytanie o portfolio - Wojciech Conder';
            const body = 'Dzień dobry,\n\nInteresuję się Państwa portfolio architektonicznym.\n\nPozdrawiam,';
            
            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink);
        });
    }
    
    if (cvBtn) {
        cvBtn.addEventListener('click', function() {
            // Tutaj możesz dodać link do CV lub wyświetlić CV w modal
            showNotification('CV będzie dostępne wkrótce!', 'info');
            
            // Alternatywnie - otwórz CV w nowym oknie
            // window.open('cv.pdf', '_blank');
        });
    }
}

// Automatyczne odświeżanie projektów co 30 sekund
function initAutoRefresh() {
    setInterval(() => {
        loadProjectsFromJSON();
    }, 30000); // 30 sekund
}

// ===== FUNKCJE POMOCNICZE =====
function getProjectTypeFromTitle(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('dom') || text.includes('mieszkanie') || text.includes('apartament')) {
        return 'mieszkaniowy';
    } else if (text.includes('biuro') || text.includes('office')) {
        return 'biurowy';
    } else if (text.includes('hotel') || text.includes('pensjonat')) {
        return 'hotelowy';
    } else if (text.includes('muzeum') || text.includes('galeria') || text.includes('kultura')) {
        return 'kulturalny';
    } else if (text.includes('szkoła') || text.includes('przedszkole') || text.includes('edukacja')) {
        return 'edukacyjny';
    } else {
        return 'mieszkaniowy'; // domyślny typ
    }
}

// Funkcja wyświetlająca pustą sekcję projektów
function displayEmptyProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid) {
        console.error('Nie znaleziono elementu projects-grid');
        return;
    }

    projectsGrid.innerHTML = `
        <div class="empty-projects">
            <p>Brak projektów do wyświetlenia</p>
            <p>Dodaj pierwszy projekt przez panel administratora</p>
        </div>
    `;
} 