const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let content = fs.readFileSync(file, 'utf8');

// The file might contain the string correctly encoded or garbled depending on how node reads it.
content = content.replace(/Tu carrito estÃƒÂ¡ vacÃƒÂ­o/g, 'Tu carrito está vacío');
content = content.replace(/El carrito estÃƒÂ¡ vacÃƒÂ­o en este momento./g, 'El carrito está vacío en este momento.');
content = content.replace(/CatÃƒÂ¡logo/g, 'Catálogo');
content = content.replace(/catÃƒÂ¡logo/g, 'catálogo');
content = content.replace(/bÃƒÂºsqueda/g, 'búsqueda');
content = content.replace(/cuadrÃƒÂ­cula/g, 'cuadrícula');
content = content.replace(/TÃƒÂ­tulo/g, 'Título');
content = content.replace(/tÃƒÂ­tulo/g, 'título');
content = content.replace(/Escribinos por WhatsApp/g, 'Escribinos por WhatsApp');
content = content.replace(/QuerÃƒÂ­a hacerles una consulta./g, 'Quería hacerles una consulta.');

fs.writeFileSync(file, content, 'utf8');
console.log('Done replacing garbled characters in CelebrarteCatalogo.jsx');
