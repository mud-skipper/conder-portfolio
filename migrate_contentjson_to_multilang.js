// Skrypt migracyjny: dodaje pola EN do projektów i sekcji 'about' w content.json
const fs = require('fs');

const file = 'content.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Pola do tłumaczenia w projektach
const projectFields = [
  'title', 'author', 'projectType', 'location', 'description', 'type', 'area', 'status', 'investor', 'designer', 'totalArea', 'usableArea', 'stage'
];

// Pola do tłumaczenia w sekcji about
const aboutFields = [
  'title', 'bio', 'education', 'experience', 'achievements', 'collaboration', 'skills', 'software', 'interests', 'experience_years', 'location'
];

// Migracja projektów
if (Array.isArray(data.projects)) {
  data.projects.forEach(project => {
    projectFields.forEach(field => {
      const enField = field + '_en';
      if (!project.hasOwnProperty(enField)) {
        project[enField] = project[field] || '';
      }
    });
  });
}

// Migracja sekcji about
if (data.about) {
  aboutFields.forEach(field => {
    const enField = field + '_en';
    if (!data.about.hasOwnProperty(enField)) {
      data.about[enField] = data.about[field] || '';
    }
  });
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log('Migracja zakończona. Dodano pola EN do content.json.'); 