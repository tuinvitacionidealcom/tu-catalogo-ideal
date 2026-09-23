const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/componentes/ProductModal.jsx');
let content = fs.readFileSync(file, 'utf8');

// Replace the garbled characters with standard text
content = content.replace(/Nota de cata e informaciÃ³n/g, 'Detalle e información');
content = content.replace(/No hay descripciÃ³n disponible para esta variedad./g, 'No hay descripción disponible para este servicio.');

fs.writeFileSync(file, content, 'utf8');
console.log('Done replacing garbled strings in ProductModal.jsx');
