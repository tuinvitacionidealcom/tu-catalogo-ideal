const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/componentes/CartModal.jsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/🍻 \*PEDIDO DESDE EL CATÁLOGO DIGITAL\* 🍔/g, '🎉 *PEDIDO DESDE EL CATÁLOGO DIGITAL* 🌟');
content = content.replace(/¡Agregá tus bebidas favoritas para empezar!/g, '¡Agregá los servicios que te interesan para empezar!');
content = content.replace(/LATAS IPAS' : 'LATAS CLÁSICAS'/g, `SERVICIOS' : 'SERVICIOS'`);

fs.writeFileSync(file, content, 'utf8');
console.log('Done replacing in CartModal.jsx');
