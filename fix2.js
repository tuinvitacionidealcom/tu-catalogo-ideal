const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/componentes/CartModal.jsx');
let content = fs.readFileSync(file, 'utf8');

// Replace the garbled characters with standard text
content = content.replace(/ðŸ º \*PEDIDO DESDE EL CATÃ LOGO DIGITAL\* ðŸ ”/g, '🎉 *NUEVO PEDIDO DESDE EL CATÁLOGO DIGITAL* 🌟');
content = content.replace(/Â¡AgregÃ¡ tus bebidas favoritas para empezar!/g, '¡Agregá los servicios que te interesan para empezar!');
content = content.replace(/LATAS IPAS' : 'LATAS CLÃ SICAS'/g, `SERVICIOS' : 'SERVICIOS'`);
content = content.replace(/Â¡Muchas gracias!/g, '¡Muchas gracias!');

fs.writeFileSync(file, content, 'utf8');
console.log('Done replacing garbled strings in CartModal.jsx');
