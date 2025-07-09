const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// Konfiguracja multer dla uploadu plików
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Upewnij się, że folder uploads istnieje
        const uploadDir = path.join(__dirname, 'uploads');
        if (!require('fs').existsSync(uploadDir)) {
            require('fs').mkdirSync(uploadDir, { recursive: true });
        }
        
        // Utwórz podkatalog dla projektu (jeśli mamy tytuł)
        let projectDir = uploadDir;
        if (req.body.title) {
            const projectName = req.body.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            projectDir = path.join(uploadDir, projectName);
            if (!require('fs').existsSync(projectDir)) {
                require('fs').mkdirSync(projectDir, { recursive: true });
            }
        }
        
        console.log(`Zapisywanie pliku ${file.originalname} do ${projectDir}`);
        cb(null, projectDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        console.log(`Nazwa pliku: ${filename}`);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB - bardzo duży limit
        files: 5, // max 5 plików
        fieldSize: 10 * 1024 * 1024 // 10MB dla pól tekstowych
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        console.log(`Sprawdzanie pliku: ${file.originalname}, mimetype: ${file.mimetype}, rozmiar: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
        
        if (mimetype && extname) {
            console.log(`Plik ${file.originalname} zaakceptowany`);
            return cb(null, true);
        } else {
            console.log(`Plik ${file.originalname} odrzucony - nieprawidłowy typ`);
            cb(new Error('Tylko pliki JPG/PNG są dozwolone!'));
        }
    }
});

// Funkcja do wykonania komend Git
function executeGitCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Błąd wykonania komendy: ${error}`);
                reject(error);
                return;
            }
            console.log(`Wykonano: ${command}`);
            resolve(stdout);
        });
    });
}

// Funkcja do określania typu projektu na podstawie tytułu i opisu
function determineProjectType(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('muzeum') || text.includes('galeria') || text.includes('teatr') || text.includes('kino') || text.includes('centrum kultury')) {
        return 'kulturalny';
    }
    if (text.includes('hotel') || text.includes('pensjonat') || text.includes('resort')) {
        return 'hotelowy';
    }
    if (text.includes('biuro') || text.includes('office') || text.includes('siedziba')) {
        return 'biurowy';
    }
    if (text.includes('przedszkole') || text.includes('szkoła') || text.includes('uniwersytet') || text.includes('uczelnia')) {
        return 'edukacyjny';
    }
    if (text.includes('dom') && (text.includes('jednorodzinny') || text.includes('willa') || text.includes('villa'))) {
        return 'jednorodzinny';
    }
    if (text.includes('apartament') || text.includes('mieszkanie') || text.includes('blok') || text.includes('osiedle')) {
        return 'mieszkaniowy';
    }
    
    return 'mieszkaniowy'; // domyślnie
}

// Funkcja do zapisu projektów do JSON
async function saveProjectToJSON(projectData) {
    try {
        // Wczytaj istniejące projekty
        const contentPath = path.join(__dirname, 'content.json');
        const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        
        // Generuj nowe ID
        const newId = Math.max(...content.projects.map(p => p.id), 0) + 1;
        
        // Normalizuj dane - jeśli pole jest tablicą, weź pierwszy element
        const normalizeField = (field) => {
            if (Array.isArray(field)) {
                return field[0] || '';
            }
            return field || '';
        };

        // Przygotuj nowy projekt
        const newProject = {
            id: newId,
            title: projectData.title,
            author: normalizeField(projectData.author) || 'Wojciech Conder',
            projectType: normalizeField(projectData.projectType) || determineProjectType(projectData.title, projectData.description),
            location: normalizeField(projectData.location) || 'Warszawa',
            year: normalizeField(projectData.year) || new Date().getFullYear().toString(),
            description: projectData.description,
            image: projectData.images && projectData.images.length > 0 ? projectData.images[0] : 'project-placeholder.jpg',
            type: normalizeField(projectData.projectType) || determineProjectType(projectData.title, projectData.description), // Zachowaj kompatybilność
            area: projectData.totalArea || projectData.usableArea || 'N/A',
            status: projectData.stage || 'w realizacji',
            link: '#',
            // Dodatkowe pola z formularza
            investor: projectData.investor,
            designer: projectData.designer,
            totalArea: projectData.totalArea,
            usableArea: projectData.usableArea,
            stage: projectData.stage,
            images: projectData.images || []
        };
        
        // Dodaj do listy projektów
        content.projects.push(newProject);
        
        // Zapisz z powrotem do pliku
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        
        return newProject;
    } catch (error) {
        console.error('Błąd zapisu do JSON:', error);
        throw error;
    }
}

// Funkcja do przetwarzania i optymalizacji obrazów
async function processAndOptimizeImage(filePath, projectName) {
    try {
        const sharp = require('sharp');
        const fs = require('fs').promises;
        
        // Wczytaj obraz
        const image = sharp(filePath);
        const metadata = await image.metadata();
        
        // Optymalizuj obraz do formatu 4:5 (pion)
        const optimizedImage = image
            .resize(800, 1000, { // Format 4:5 (800x1000px)
                fit: 'cover',
                position: 'center',
                withoutEnlargement: true
            })
            .jpeg({ 
                quality: 85,
                progressive: true
            });
        
        // Zapisz zoptymalizowany obraz
        const optimizedPath = filePath.replace(/\.[^/.]+$/, '_optimized.jpg');
        await optimizedImage.toFile(optimizedPath);
        
        // Usuń oryginalny plik i zmień nazwę zoptymalizowanego
        await fs.unlink(filePath);
        await fs.rename(optimizedPath, filePath);
        
        console.log(`Zoptymalizowano obraz: ${filePath}`);
        return path.basename(filePath);
        
    } catch (error) {
        console.log(`Błąd optymalizacji obrazu ${filePath}:`, error.message);
        return path.basename(filePath); // Zwróć oryginalną nazwę jeśli optymalizacja się nie udała
    }
}

// Endpoint do dodawania projektu
app.post('/api/addProject', upload.array('images', 5), async (req, res) => {
    try {
        console.log('Otrzymano żądanie dodania projektu');
        console.log('Dane formularza:', req.body);
        console.log('Liczba plików:', req.files ? req.files.length : 0);
        
        if (req.files && req.files.length > 0) {
            console.log('Nazwy plików:', req.files.map(f => f.filename));
        }
        
        // Przygotuj dane projektu
        const projectData = {
            title: req.body.title,
            author: req.body.author,
            projectType: req.body.projectType,
            location: req.body.location,
            year: req.body.year,
            investor: req.body.investor,
            designer: req.body.designer,
            totalArea: req.body.totalArea,
            usableArea: req.body.usableArea,
            stage: req.body.stage,
            description: req.body.description,
            images: []
        };
        
        // Przetwórz i zoptymalizuj obrazy
        if (req.files && req.files.length > 0) {
            const projectName = req.body.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            
            for (const file of req.files) {
                try {
                    const optimizedFileName = await processAndOptimizeImage(file.path, projectName);
                    projectData.images.push(`${projectName}/${optimizedFileName}`);
                } catch (error) {
                    console.error(`Błąd przetwarzania pliku ${file.filename}:`, error);
                    projectData.images.push(`${projectName}/${file.filename}`);
                }
            }
        }
        
        console.log('Dane projektu:', projectData);
        
        // Zapisz projekt do JSON
        const newProject = await saveProjectToJSON(projectData);
        
        // Wykonaj Git push
        try {
            await executeGitCommand('git add .');
            await executeGitCommand(`git commit -m "Dodano projekt: ${projectData.title}"`);
            await executeGitCommand('git push');
            console.log('Git push wykonany pomyślnie');
        } catch (gitError) {
            console.error('Błąd Git push:', gitError);
            // Nie zwracamy błędu - projekt został zapisany lokalnie
        }
        
        res.json({
            success: true,
            message: 'Projekt został dodany pomyślnie!',
            project: newProject,
            uploadedFiles: req.files ? req.files.map(f => f.filename) : []
        });
        
    } catch (error) {
        console.error('Błąd dodawania projektu:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas dodawania projektu: ' + error.message
        });
    }
});

// Middleware do obsługi błędów multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        console.error('Błąd Multer:', error);
        
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Plik jest za duży. Maksymalny rozmiar to 100MB.'
            });
        }
        
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Za dużo plików. Maksymalnie 5 zdjęć.'
            });
        }
        
        return res.status(400).json({
            success: false,
            message: 'Błąd uploadu pliku: ' + error.message
        });
    }
    
    next(error);
});

// Endpoint do pobierania projektów
app.get('/api/projects', async (req, res) => {
    try {
        const contentPath = path.join(__dirname, 'content.json');
        const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        res.json(content.projects);
    } catch (error) {
        console.error('Błąd pobierania projektów:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas pobierania projektów'
        });
    }
});

// Endpoint do sprawdzenia statusu
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Endpoint do usuwania projektu
app.delete('/api/deleteProject/:id', async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        
        // Wczytaj istniejące projekty
        const contentPath = path.join(__dirname, 'content.json');
        const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        
        // Znajdź projekt do usunięcia
        const projectIndex = content.projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Projekt nie został znaleziony'
            });
        }
        
        const project = content.projects[projectIndex];
        
        // Usuń zdjęcia projektu z folderu uploads
        if (project.images && project.images.length > 0) {
            for (const imageName of project.images) {
                try {
                    const imagePath = path.join(__dirname, 'uploads', imageName);
                    await fs.unlink(imagePath);
                    console.log(`Usunięto zdjęcie: ${imageName}`);
                } catch (error) {
                    console.log(`Nie można usunąć zdjęcia ${imageName}:`, error.message);
                }
            }
        }
        
        // Usuń projekt z listy
        content.projects.splice(projectIndex, 1);
        
        // Zapisz z powrotem do pliku
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        
        // Wykonaj Git push
        try {
            await executeGitCommand('git add .');
            await executeGitCommand(`git commit -m "Usunięto projekt: ${project.title}"`);
            await executeGitCommand('git push');
            console.log('Git push wykonany pomyślnie');
        } catch (gitError) {
            console.error('Błąd Git push:', gitError);
        }
        
        res.json({
            success: true,
            message: 'Projekt został usunięty pomyślnie'
        });
        
    } catch (error) {
        console.error('Błąd usuwania projektu:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas usuwania projektu: ' + error.message
        });
    }
});

// Endpoint do aktualizacji pojedynczego pola projektu
app.patch('/api/updateProjectField/:id', async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const { field, value } = req.body;
        
        console.log(`Aktualizacja pola ${field} dla projektu ${projectId}:`, value);
        
        // Wczytaj istniejące projekty
        const contentPath = path.join(__dirname, 'content.json');
        const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        
        // Znajdź projekt do aktualizacji
        const projectIndex = content.projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Projekt nie został znaleziony'
            });
        }
        
        const project = content.projects[projectIndex];
        
        // Aktualizuj pole
        project[field] = value;
        
        // Zapisz z powrotem do pliku
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        
        // Wykonaj Git push
        try {
            await executeGitCommand('git add .');
            await executeGitCommand(`git commit -m "Aktualizacja pola ${field} w projekcie: ${project.title}"`);
            await executeGitCommand('git push');
            console.log('Git push wykonany pomyślnie');
        } catch (gitError) {
            console.error('Błąd Git push:', gitError);
        }
        
        res.json({
            success: true,
            message: `Pole ${field} zostało zaktualizowane pomyślnie`
        });
        
    } catch (error) {
        console.error('Błąd aktualizacji pola projektu:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas aktualizacji pola: ' + error.message
        });
    }
});

// Endpoint do aktualizacji sekcji "O mnie"
app.post('/api/updateAbout', upload.single('profileImage'), async (req, res) => {
    try {
        console.log('Otrzymano żądanie aktualizacji "O mnie"');
        console.log('Dane formularza:', req.body);
        if (req.file) {
            console.log('Otrzymano plik profilowy:', req.file.originalname, req.file.path);
        }
        
        // Wczytaj istniejące dane
        const contentPath = path.join(__dirname, 'content.json');
        let content;
        try {
            content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        } catch (err) {
            console.error('Błąd odczytu content.json:', err);
            return res.status(500).json({ success: false, message: 'Błąd odczytu pliku content.json: ' + err.message });
        }
        
        // Sprawdź czy to aktualizacja pojedynczego pola (JSON) czy całego formularza
        const isSingleFieldUpdate = req.headers['content-type'] === 'application/json';
        
        if (isSingleFieldUpdate) {
            // Aktualizacja pojedynczego pola
            const updateData = req.body;
            const fieldName = Object.keys(updateData)[0];
            const fieldValue = updateData[fieldName];
            
            console.log(`Aktualizacja pojedynczego pola: ${fieldName} = ${fieldValue}`);
            
            // Inicjalizuj sekcję about jeśli nie istnieje
            if (!content.about) {
                content.about = {
                    name: 'Wojciech Conder',
                    title: 'Architekt',
                    bio: '',
                    profileImage: '',
                    education: '',
                    experience: '',
                    achievements: '',
                    collaboration: '',
                    skills: '',
                    software: '',
                    interests: '',
                    experience_years: '8+ lat',
                    specializations: [
                        'Architektura mieszkaniowa',
                        'Projektowanie biur',
                        'Adaptacje zabytków',
                        'Zrównoważone budownictwo'
                    ],
                    location: 'Warszawa / zdalnie'
                };
            }
            
            // Aktualizuj konkretne pole
            content.about[fieldName] = fieldValue;
            
        } else {
            // Aktualizacja całego formularza (FormData)
            const aboutData = {
                name: content.about?.name || 'Wojciech Conder',
                title: content.about?.title || 'Architekt',
                bio: req.body.aboutText || content.about?.bio || '',
                profileImage: content.about?.profileImage || '',
                education: req.body.education || content.about?.education || '',
                experience: req.body.experience || content.about?.experience || '',
                achievements: req.body.achievements || content.about?.achievements || '',
                collaboration: req.body.collaboration || content.about?.collaboration || '',
                skills: req.body.skills || content.about?.skills || '',
                software: req.body.software || content.about?.software || '',
                interests: req.body.interests || content.about?.interests || '',
                experience_years: content.about?.experience_years || '8+ lat',
                specializations: content.about?.specializations || [
                    'Architektura mieszkaniowa',
                    'Projektowanie biur',
                    'Adaptacje zabytków',
                    'Zrównoważone budownictwo'
                ],
                location: content.about?.location || 'Warszawa / zdalnie'
            };
            
            // Przetwórz zdjęcie profilowe jeśli zostało przesłane
            if (req.file) {
                try {
                    const profileDir = path.join(__dirname, 'uploads', 'profile');
                    await fs.mkdir(profileDir, { recursive: true });
                    const optimizedFileName = await processAndOptimizeImage(req.file.path, 'profile');
                    let finalProfilePath = path.join(profileDir, optimizedFileName);
                    let sourcePath = req.file.path;

                    // ===== BLOK ZABEZPIECZAJĄCY: UPEWNIJ SIĘ, ŻE PLIK JEST W uploads/profile/ =====
                    if (sourcePath !== finalProfilePath) {
                        // Jeśli plik nie jest w uploads/profile/, przenieś go tam
                        try {
                            await fs.rename(sourcePath, finalProfilePath);
                        } catch (moveErr) {
                            // Jeśli już istnieje, usuń źródłowy
                            try { await fs.unlink(sourcePath); } catch {}
                        }
                    }
                    // Sprawdź czy plik istnieje w uploads/profile/
                    try {
                        await fs.access(finalProfilePath);
                        aboutData.profileImage = `profile/${optimizedFileName}`;
                        console.log(`[SAFE] Zdjęcie profilowe na miejscu: ${aboutData.profileImage}`);
                    } catch (notFoundErr) {
                        // Jeśli nie ma pliku, zgłoś błąd
                        console.error('[SAFE] Błąd: zdjęcie profilowe nie istnieje w uploads/profile/');
                        return res.status(500).json({ success: false, message: 'Błąd: zdjęcie profilowe nie zostało poprawnie zapisane.' });
                    }
                    // ===== KONIEC BLOKU ZABEZPIECZAJĄCEGO =====
                } catch (error) {
                    console.error('Błąd przetwarzania zdjęcia profilowego:', error);
                    return res.status(500).json({ success: false, message: 'Błąd przetwarzania zdjęcia profilowego: ' + error.message });
                }
            }
            
            content.about = aboutData;
        }
        
        // Zapisz z powrotem do pliku
        try {
            await fs.writeFile(contentPath, JSON.stringify(content, null, 2), 'utf8');
        } catch (err) {
            console.error('Błąd zapisu content.json:', err);
            return res.status(500).json({ success: false, message: 'Błąd zapisu pliku content.json: ' + err.message });
        }
        
        // Wykonaj Git push
        try {
            await executeGitCommand('git add .');
            await executeGitCommand('git commit -m "Aktualizacja sekcji O mnie"');
            await executeGitCommand('git push');
            console.log('Git push wykonany pomyślnie');
        } catch (gitError) {
            console.error('Błąd Git push:', gitError);
        }
        
        res.json({
            success: true,
            message: 'Sekcja "O mnie" została zaktualizowana pomyślnie!',
            about: content.about
        });
    } catch (error) {
        console.error('Błąd aktualizacji "O mnie":', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas aktualizacji sekcji "O mnie": ' + error.message
        });
    }
});

// Endpoint do dodawania zdjęć do istniejącego projektu
app.post('/api/addImagesToProject', upload.array('images', 5), async (req, res) => {
    try {
        const projectId = parseInt(req.body.projectId);
        
        console.log(`Dodawanie zdjęć do projektu ${projectId}`);
        console.log('Liczba plików:', req.files ? req.files.length : 0);
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nie wybrano żadnych plików'
            });
        }
        
        // Wczytaj istniejące projekty
        const contentPath = path.join(__dirname, 'content.json');
        const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        
        // Znajdź projekt
        const project = content.projects.find(p => p.id === projectId);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projekt nie został znaleziony'
            });
        }
        
        // Sprawdź limit zdjęć (maksymalnie 5 na projekt)
        const currentImageCount = project.images ? project.images.length : 0;
        if (currentImageCount + req.files.length > 5) {
            return res.status(400).json({
                success: false,
                message: `Za dużo zdjęć. Projekt może mieć maksymalnie 5 zdjęć (obecnie: ${currentImageCount})`
            });
        }
        
        // Przygotuj folder dla projektu
        const projectName = project.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const projectDir = path.join(__dirname, 'uploads', projectName);
        await fs.mkdir(projectDir, { recursive: true });
        
        // Przetwórz i zoptymalizuj obrazy
        const newImages = [];
        for (const file of req.files) {
            try {
                const optimizedFileName = await processAndOptimizeImage(file.path, projectName);
                const imagePath = `${projectName}/${optimizedFileName}`;
                newImages.push(imagePath);
                console.log(`Dodano zdjęcie: ${imagePath}`);
            } catch (error) {
                console.error(`Błąd przetwarzania pliku ${file.filename}:`, error);
                newImages.push(`${projectName}/${file.filename}`);
            }
        }
        
        // Dodaj nowe zdjęcia do projektu
        if (!project.images) {
            project.images = [];
        }
        project.images.push(...newImages);
        
        // Zapisz z powrotem do pliku
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        
        // Wykonaj Git push
        try {
            await executeGitCommand('git add .');
            await executeGitCommand(`git commit -m "Dodano ${newImages.length} zdjęć do projektu: ${project.title}"`);
            await executeGitCommand('git push');
            console.log('Git push wykonany pomyślnie');
        } catch (gitError) {
            console.error('Błąd Git push:', gitError);
        }
        
        res.json({
            success: true,
            message: `Dodano ${newImages.length} zdjęć do projektu`,
            newImages: newImages
        });
        
    } catch (error) {
        console.error('Błąd dodawania zdjęć do projektu:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas dodawania zdjęć: ' + error.message
        });
    }
});

// Endpoint do usuwania zdjęcia z projektu
app.post('/api/removeImage/:projectId', async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const { imageName } = req.body;
        
        // Wczytaj istniejące projekty
        const contentPath = path.join(__dirname, 'content.json');
        const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        
        // Znajdź projekt
        const project = content.projects.find(p => p.id === projectId);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projekt nie został znaleziony'
            });
        }
        
        // Usuń zdjęcie z listy
        const imageIndex = project.images.indexOf(imageName);
        if (imageIndex > -1) {
            project.images.splice(imageIndex, 1);
            
            // Jeśli to było główne zdjęcie, ustaw nowe
            if (project.image === imageName) {
                project.image = project.images.length > 0 ? project.images[0] : 'project-placeholder.jpg';
            }
        }
        
        // Usuń plik z folderu uploads
        try {
            const imagePath = path.join(__dirname, 'uploads', imageName);
            await fs.unlink(imagePath);
            console.log(`Usunięto zdjęcie: ${imageName}`);
        } catch (error) {
            console.log(`Nie można usunąć pliku ${imageName}:`, error.message);
        }
        
        // Zapisz z powrotem do pliku
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        
        // Wykonaj Git push
        try {
            await executeGitCommand('git add .');
            await executeGitCommand(`git commit -m "Usunięto zdjęcie z projektu: ${project.title}"`);
            await executeGitCommand('git push');
            console.log('Git push wykonany pomyślnie');
        } catch (gitError) {
            console.error('Błąd Git push:', gitError);
        }
        
        res.json({
            success: true,
            message: 'Zdjęcie zostało usunięte pomyślnie'
        });
        
    } catch (error) {
        console.error('Błąd usuwania zdjęcia:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas usuwania zdjęcia: ' + error.message
        });
    }
});

// Endpoint do zmiany kolejności zdjęć w projekcie
app.post('/api/moveImage/:projectId', async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const { imageIndex, direction } = req.body;
        
        // Wczytaj istniejące projekty
        const contentPath = path.join(__dirname, 'content.json');
        const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        
        // Znajdź projekt
        const project = content.projects.find(p => p.id === projectId);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projekt nie został znaleziony'
            });
        }
        
        if (!project.images || project.images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Projekt nie ma żadnych zdjęć'
            });
        }
        
        // Sprawdź poprawność indeksu
        if (imageIndex < 0 || imageIndex >= project.images.length) {
            return res.status(400).json({
                success: false,
                message: 'Nieprawidłowy indeks zdjęcia'
            });
        }
        
        // Zmień kolejność
        if (direction === 'up' && imageIndex > 0) {
            // Przesuń w górę
            const temp = project.images[imageIndex];
            project.images[imageIndex] = project.images[imageIndex - 1];
            project.images[imageIndex - 1] = temp;
        } else if (direction === 'down' && imageIndex < project.images.length - 1) {
            // Przesuń w dół
            const temp = project.images[imageIndex];
            project.images[imageIndex] = project.images[imageIndex + 1];
            project.images[imageIndex + 1] = temp;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Nie można przesunąć zdjęcia w tym kierunku'
            });
        }
        
        // Ustaw pierwsze zdjęcie jako główne
        if (project.images.length > 0) {
            project.image = project.images[0];
        }
        
        // Zapisz z powrotem do pliku
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        
        // Wykonaj Git push
        try {
            await executeGitCommand('git add .');
            await executeGitCommand(`git commit -m "Zmieniono kolejność zdjęć w projekcie: ${project.title}"`);
            await executeGitCommand('git push');
            console.log('Git push wykonany pomyślnie');
        } catch (gitError) {
            console.error('Błąd Git push:', gitError);
        }
        
        res.json({
            success: true,
            message: 'Kolejność zdjęć została zmieniona pomyślnie'
        });
        
    } catch (error) {
        console.error('Błąd zmiany kolejności zdjęcia:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas zmiany kolejności zdjęcia: ' + error.message
        });
    }
});

// Endpoint do aktualizacji zdjęcia z kadrowaniem
app.post('/api/updateImageWithCrop', upload.single('croppedImage'), async (req, res) => {
    try {
        const projectId = parseInt(req.body.projectId);
        const imageIndex = parseInt(req.body.imageIndex);
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Nie otrzymano przyciętego zdjęcia'
            });
        }
        
        // Wczytaj istniejące projekty
        const contentPath = path.join(__dirname, 'content.json');
        const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        
        // Znajdź projekt
        const project = content.projects.find(p => p.id === projectId);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projekt nie został znaleziony'
            });
        }
        
        if (!project.images || imageIndex >= project.images.length) {
            return res.status(400).json({
                success: false,
                message: 'Nieprawidłowy indeks zdjęcia'
            });
        }
        
        // Przetwórz i zoptymalizuj przycięte zdjęcie
        const projectName = project.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const optimizedFileName = await processAndOptimizeImage(req.file.path, projectName);
        const newImagePath = `${projectName}/${optimizedFileName}`;
        
        // Usuń stare zdjęcie
        const oldImagePath = project.images[imageIndex];
        try {
            const oldImageFullPath = path.join(__dirname, 'uploads', oldImagePath);
            await fs.unlink(oldImageFullPath);
            console.log(`Usunięto stare zdjęcie: ${oldImagePath}`);
        } catch (error) {
            console.log(`Nie można usunąć starego zdjęcia ${oldImagePath}:`, error.message);
        }
        
        // Zaktualizuj ścieżkę zdjęcia w projekcie
        project.images[imageIndex] = newImagePath;
        
        // Zapisz z powrotem do pliku
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        
        // Wykonaj Git push
        try {
            await executeGitCommand('git add .');
            await executeGitCommand(`git commit -m "Zaktualizowano zdjęcie z kadrowaniem w projekcie: ${project.title}"`);
            await executeGitCommand('git push');
            console.log('Git push wykonany pomyślnie');
        } catch (gitError) {
            console.error('Błąd Git push:', gitError);
        }
        
        res.json({
            success: true,
            message: 'Zdjęcie zostało zaktualizowane pomyślnie',
            newImagePath: newImagePath
        });
        
    } catch (error) {
        console.error('Błąd aktualizacji zdjęcia z kadrowaniem:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas aktualizacji zdjęcia: ' + error.message
        });
    }
});

// Uruchom serwer
app.listen(PORT, () => {
    console.log(`🚀 Serwer conder-portfolio uruchomiony na porcie ${PORT}`);
    console.log(`📱 Panel admina: http://localhost:${PORT}/admin.html`);
    console.log(`🏠 Portfolio: http://localhost:${PORT}/`);
});

// Obsługa błędów
process.on('uncaughtException', (error) => {
    console.error('Nieobsłużony błąd:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Nieobsłużona Promise rejection:', reason);
}); 