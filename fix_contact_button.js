const fs = require('fs');
const path = require('path');

const fileCatalogo = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let contentCatalogo = fs.readFileSync(fileCatalogo, 'utf8');

contentCatalogo = contentCatalogo.replace(
  /imageUrl=\{imgFormulario\}\s*\/>/m,
  'imageUrl={imgFormulario}\n          buttonBackground="var(--color-brand)"\n          buttonShadow="0 8px 20px rgba(197, 137, 150, 0.3)"\n        />'
);

fs.writeFileSync(fileCatalogo, contentCatalogo, 'utf8');
console.log('Done updating ContactForm props in CelebrarteCatalogo.');
