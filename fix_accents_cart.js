const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/componentes/CartModal.jsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/Tu carrito estÃ¡ vacÃ­o/g, 'Tu carrito está vacío');
content = content.replace(/Volver al catÃ¡logo/g, 'Volver al catálogo');
content = content.replace(/Por favor ingresÃ¡ tu/g, 'Por favor ingresá tu');
content = content.replace(/direcciÃ³n/g, 'dirección');
content = content.replace(/MÃ©todo de entrega/g, 'Método de entrega');
content = content.replace(/EnvÃ­o a Domicilio/g, 'Envío a Domicilio');
content = content.replace(/EnvÃ­o a domicilio/g, 'Envío a domicilio');
content = content.replace(/CatÃ¡logo/g, 'Catálogo');

fs.writeFileSync(file, content, 'utf8');
console.log('Done replacing garbled characters in CartModal.jsx');
