const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let content = fs.readFileSync(file, 'utf8');

// The personalized message
const personalizedMessage = encodeURIComponent('¡Hola Julieta! Me gustaría hacer una consulta sobre tus servicios.');

// Replace the first WhatsApp link (without text)
content = content.replace(
  /href={`https:\/\/wa.me\/\${info.phone}`}/g,
  `href={\`https://wa.me/\${info.phone}?text=\${'${personalizedMessage}'}\`}`
);

// Replace the second WhatsApp link (with old text, garbled or not)
content = content.replace(
  /href={`https:\/\/wa.me\/\${info.phone}\?text=Hola!.*?`}/g,
  `href={\`https://wa.me/\${info.phone}?text=\${'${personalizedMessage}'}\`}`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done personalizing WhatsApp messages in CelebrarteCatalogo.jsx');
