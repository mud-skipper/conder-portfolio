// ===== INICJALIZACJA =====
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    loadProjectsFromJSON();
    initAutoRefresh();
});

// ===== MENU HAMBURGER =====
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });

    // Zamykanie menu po kliknięciu w link
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        });
    });

    // Zamykanie menu po kliknięciu poza nim
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        }
    });
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

    const projectsHTML = projects.map(project => {
        // Sprawdź czy projekt ma zdjęcia
        const hasImages = project.images && project.images.length > 0;
        const mainImage = hasImages ? project.images[0] : (project.image || 'project-placeholder.jpg');
        
        // Przygotuj HTML dla zdjęć z nawigacją
        const imagesHTML = hasImages ? `
            <div class="project-images" data-project-id="${project.id}">
                ${project.images.map((image, index) => `
                    <img src="uploads/${image}" 
                         alt="${project.title} - zdjęcie ${index + 1}" 
                         class="project-image ${index === 0 ? 'main-image active' : ''}"
                         data-index="${index}"
                         onerror="this.src='project-placeholder.jpg'; this.style.display='none';"
                         loading="lazy">
                `).join('')}
                
                ${project.images.length > 1 ? `
                    <button class="image-nav prev" onclick="changeImage(${project.id}, -1)">‹</button>
                    <button class="image-nav next" onclick="changeImage(${project.id}, 1)">›</button>
                    <div class="image-counter">1/${project.images.length}</div>
                ` : ''}
            </div>
        ` : `
            <div class="project-images">
                <img src="${mainImage.startsWith('uploads/') ? mainImage : `uploads/${mainImage}`}" 
                     alt="${project.title}" 
                     class="project-image main-image active"
                     onerror="this.src='project-placeholder.jpg';"
                     loading="lazy">
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
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-meta">
                        <span class="project-year">${displayYear}</span>
                        <span class="project-location">${displayLocation}</span>
                    </div>
                </div>
                
                ${imagesHTML}
                
                <div class="project-content">
                    <div class="project-description">
                        <p>${project.description}</p>
                    </div>
                    
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
                            <strong>Status:</strong> ${project.stage || project.status || 'Brak'}
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

// Automatyczne odświeżanie projektów co 30 sekund
function initAutoRefresh() {
    setInterval(() => {
        loadProjectsFromJSON();
    }, 30000); // 30 sekund
}

// ===== NAWIGACJA ZDJĘĆ =====
function changeImage(projectId, direction) {
    const projectImages = document.querySelector(`[data-project-id="${projectId}"]`);
    if (!projectImages) return;
    
    const images = projectImages.querySelectorAll('.project-image');
    const counter = projectImages.querySelector('.image-counter');
    const prevBtn = projectImages.querySelector('.image-nav.prev');
    const nextBtn = projectImages.querySelector('.image-nav.next');
    
    if (images.length <= 1) return;
    
    // Znajdź aktualnie aktywne zdjęcie
    let currentIndex = 0;
    images.forEach((img, index) => {
        if (img.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Oblicz nowy indeks
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    
    // Ukryj wszystkie zdjęcia
    images.forEach(img => {
        img.classList.remove('active');
        img.style.display = 'none';
    });
    
    // Pokaż nowe zdjęcie
    images[newIndex].classList.add('active');
    images[newIndex].style.display = 'block';
    
    // Aktualizuj licznik
    if (counter) {
        counter.textContent = `${newIndex + 1}/${images.length}`;
    }
    
    // Aktualizuj widoczność przycisków
    if (prevBtn && nextBtn) {
        prevBtn.classList.toggle('hidden', images.length <= 1);
        nextBtn.classList.toggle('hidden', images.length <= 1);
    }
}

// ===== PRZYCISKI DOLNEGO PANELU =====
document.addEventListener('DOMContentLoaded', function() {
    const emailBtn = document.querySelector('.action-email');
    const cvBtn = document.querySelector('.action-cv');

    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            window.location.href = 'mailto:wojtek.conder@gmail.com';
        });
    }

    if (cvBtn) {
        cvBtn.addEventListener('click', function() {
            // Jeśli plik cv.pdf istnieje, przekieruj, w przeciwnym razie alert
            fetch('cv.pdf', { method: 'HEAD' })
                .then(res => {
                    if (res.ok) {
                        window.open('cv.pdf', '_blank');
                    } else {
                        alert('CV będzie dostępne wkrótce');
                    }
                })
                .catch(() => {
                    alert('CV będzie dostępne wkrótce');
                });
        });
    }
}); 