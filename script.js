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
            console.log(`Załadowano ${data.projects.length} projektów`);
        } else {
            displayEmptyProjects();
            console.log('Brak projektów w pliku JSON');
        }
    } catch (error) {
        console.error('Błąd podczas wczytywania projektów:', error);
        displayEmptyProjects();
    }
}

// ===== WYŚWIETLANIE PROJEKTÓW =====
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

// ===== FUNKCJE POMOCNICZE =====
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

// Automatyczne odświeżanie projektów co 30 sekund
function initAutoRefresh() {
    setInterval(() => {
        loadProjectsFromJSON();
    }, 30000); // 30 sekund
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
            // TODO: Dodać link do CV
            alert('CV będzie dostępne wkrótce');
        });
    }
}); 