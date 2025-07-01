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
        console.log(`Zapisywanie pliku ${file.originalname} do ${uploadDir}`);
        cb(null, uploadDir);
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
        fileSize: 512000, // 500KB
        files: 5 // max 5 plików
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        console.log(`Sprawdzanie pliku: ${file.originalname}, mimetype: ${file.mimetype}`);
        
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
        
        // Przygotuj nowy projekt
        const newProject = {
            id: newId,
            title: projectData.title,
            year: new Date().getFullYear().toString(),
            location: projectData.location || 'Warszawa',
            description: projectData.description,
            image: projectData.images && projectData.images.length > 0 ? projectData.images[0] : 'project-placeholder.jpg',
            type: determineProjectType(projectData.title, projectData.description), // Automatyczne określanie typu
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
            investor: req.body.investor,
            designer: req.body.designer,
            totalArea: req.body.totalArea,
            usableArea: req.body.usableArea,
            stage: req.body.stage,
            description: req.body.description,
            images: req.files ? req.files.map(file => file.filename) : []
        };
        
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