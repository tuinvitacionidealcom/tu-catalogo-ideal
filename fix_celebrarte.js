const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let content = fs.readFileSync(file, 'utf8');

// The file might contain the string correctly encoded or garbled depending on how node reads it.
// To be safe, we'll replace using regex that matches the static parts of the string.
content = content.replace(/placeholder="Buscar variedades cl.*?as, IPAs, combos o promos..."/g, 'placeholder="Buscar servicios, opciones o detalles..."');
content = content.replace(/title="Buscar variedades"/g, 'title="Buscar servicios"');
content = content.replace(/No encontramos productos que coincidan con tu b.*?squeda./g, 'No encontramos servicios que coincidan con tu búsqueda.');

fs.writeFileSync(file, content, 'utf8');
console.log('Done replacing strings in CelebrarteCatalogo.jsx');
