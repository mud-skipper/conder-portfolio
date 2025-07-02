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
        
        // Optymalizuj obraz
        const optimizedImage = image
            .resize(1200, 1600, { // Format telefonu
                fit: 'inside',
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

// Endpoint do aktualizacji sekcji "O mnie"
app.post('/api/updateAbout', upload.single('profileImage'), async (req, res) => {
    try {
        console.log('Otrzymano żądanie aktualizacji "O mnie"');
        console.log('Dane formularza:', req.body);
        
        // Wczytaj istniejące dane
        const contentPath = path.join(__dirname, 'content.json');
        const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
        
        // Przygotuj dane do aktualizacji
        const aboutData = {
            name: content.about?.name || 'Wojciech Conder',
            title: content.about?.title || 'Architekt',
            bio: req.body.aboutText || content.about?.bio || '',
            experience: content.about?.experience || '8+ lat',
            specializations: content.about?.specializations || [
                'Architektura mieszkaniowa',
                'Projektowanie biur',
                'Adaptacje zabytków',
                'Zrównoważone budownictwo'
            ],
            education: content.about?.education || 'Politechnika Warszawska, Wydział Architektury',
            location: content.about?.location || 'Warszawa / zdalnie'
        };
        
        // Przetwórz zdjęcie profilowe jeśli zostało przesłane
        if (req.file) {
            try {
                // Utwórz folder profile jeśli nie istnieje
                const profileDir = path.join(__dirname, 'uploads', 'profile');
                await fs.mkdir(profileDir, { recursive: true });
                
                // Zoptymalizuj i zapisz zdjęcie
                const optimizedFileName = await processAndOptimizeImage(req.file.path, 'profile');
                aboutData.profileImage = `profile/${optimizedFileName}`;
                
                console.log(`Zapisywanie zdjęcia profilowego: ${aboutData.profileImage}`);
            } catch (error) {
                console.error('Błąd przetwarzania zdjęcia profilowego:', error);
                // Kontynuuj bez zdjęcia
            }
        }
        
        // Aktualizuj dane
        content.about = aboutData;
        
        // Zapisz z powrotem do pliku
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        
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
            about: aboutData
        });
        
    } catch (error) {
        console.error('Błąd aktualizacji "O mnie":', error);
        res.status(500).json({
            success: false,
            message: 'Błąd podczas aktualizacji sekcji "O mnie": ' + error.message
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