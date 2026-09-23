const fs = require('fs');
const path = require('path');

const fileCatalogo = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let contentCatalogo = fs.readFileSync(fileCatalogo, 'utf8');

// Add import if not exists
if (!contentCatalogo.includes("import imgFormulario from '../img/img-formulario.webp';")) {
  contentCatalogo = contentCatalogo.replace(
    /import logoImg from '\.\.\/img\/logo\.webp';/,
    "import logoImg from '../img/logo.webp';\nimport imgFormulario from '../img/img-formulario.webp';"
  );
}

// Replace string imageUrl with the variable
contentCatalogo = contentCatalogo.replace(
  /imageUrl="https:\/\/images\.unsplash\.com\/photo-1510812431401-41d2bd2722f3\?w=1200&auto=format&fit=crop&q=80"/g,
  "imageUrl={imgFormulario}"
);

fs.writeFileSync(fileCatalogo, contentCatalogo, 'utf8');
console.log('Done updating image in ContactForm.');
