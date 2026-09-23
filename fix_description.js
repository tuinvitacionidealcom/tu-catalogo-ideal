const fs = require('fs');
const path = require('path');

const fileCatalogo = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let contentCatalogo = fs.readFileSync(fileCatalogo, 'utf8');

const oldDescription = 'Soy Julieta y te ayudo a que tu evento sea inolvidable!!🎉\\nRealizo ambientaciones 🌟\\nFiesta del té ☕🎂\\nGlitter Bar ✨✨✨\\nCiudad Autónoma de BsAs';
const newDescription = 'Creamos experiencias y eventos únicos en CABA. Nos especializamos en Ambientaciones integrales, propuestas exclusivas de Fiesta del Té y Glitter Bar para darle un toque mágico a tu celebración. Cada detalle está pensado para que tu evento sea verdaderamente inolvidable.';

contentCatalogo = contentCatalogo.replace(oldDescription, newDescription);

fs.writeFileSync(fileCatalogo, contentCatalogo, 'utf8');
console.log('Done updating description to be more professional.');
