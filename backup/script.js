// ===== GŁÓWNE FUNKCJE =====

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    loadProjectsFromJSON();
    initContactForm();
    initSmoothScrolling();
    initAnimations();
});

// ===== MENU HAMBURGER =====
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Zamykanie menu po kliknięciu w link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Zamykanie menu po kliknięciu poza nim
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
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
    
    card.innerHTML = `
        <div class="project-image">
            <div class="image-placeholder">
                <span>${projectIcon}</span>
                <p>${project.title}</p>
            </div>
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
                        <p>Przykładowy projekt</p>
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">Przykładowy projekt</h3>
                    <div class="project-meta">
                        <span class="project-year">2024</span>
                        <span class="project-location">Warszawa</span>
                    </div>
                    <p class="project-description">
                        Krótki opis projektu architektonicznego z uwzględnieniem 
                        głównych założeń i rozwiązań.
                    </p>
                    <a href="#" class="project-link">Zobacz szczegóły</a>
                </div>
            </div>
        `;
    }
}

// ===== FORMULARZ KONTAKTOWY =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleFormSubmission();
        });
    }
}

function handleFormSubmission() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    
    // Pobierz dane z formularza
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Walidacja
    if (!name || !email || !message) {
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
    
    // Style dla powiadomienia
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Kolory w zależności od typu
    if (type === 'success') {
        notification.style.background = '#4CAF50';
    } else if (type === 'error') {
        notification.style.background = '#f44336';
    } else {
        notification.style.background = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    // Animacja wejścia
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Automatyczne usunięcie po 5 sekundach
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// ===== PŁYNE PRZEWIJANIE =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMACJE =====
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
    const animatedElements = document.querySelectorAll('.project-card, .about-content, .contact-form');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// ===== UTILITY FUNCTIONS =====

// Funkcja do formatowania daty
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Funkcja do walidacji URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Funkcja do debounce (ograniczenie częstotliwości wywołań)
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

// ===== EVENT LISTENERS DODATKOWE =====

// Obsługa klawisza Escape do zamykania menu
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Lazy loading dla obrazów (gdy będą dodane)
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

// Inicjalizacja lazy loading jeśli są obrazy
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// ===== DEBUG I LOGI =====
console.log('🎨 Portfolio Wojciecha Condera - JavaScript załadowany!');
console.log('📱 Strona w pełni responsywna i gotowa do użycia');
console.log('🎯 Menu hamburger, projekty z JSON i formularz kontaktowy aktywne'); 