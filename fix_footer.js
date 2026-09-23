const fs = require('fs');
const path = require('path');

const fileCatalogo = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let contentCatalogo = fs.readFileSync(fileCatalogo, 'utf8');

// Replace the garbled description with standard text and emojis
contentCatalogo = contentCatalogo.replace(
  /Soy Julieta y te ayudo a que tu evento sea inolvidable!!.*\\n.*Ciudad AutÃ³noma de BsAs/s,
  'Soy Julieta y te ayudo a que tu evento sea inolvidable!!🎉\\nRealizo ambientaciones 🌟\\nFiesta del té ☕🎂\\nGlitter Bar ✨✨✨\\nCiudad Autónoma de BsAs'
);

// Fallback regex if the multi-line match didn't work
contentCatalogo = contentCatalogo.replace(/ðŸŽ‰/g, '🎉');
contentCatalogo = contentCatalogo.replace(/ðŸŒŸ/g, '🌟');
contentCatalogo = contentCatalogo.replace(/â˜•ï¸ /g, '☕ ');
contentCatalogo = contentCatalogo.replace(/ðŸŽ‚/g, '🎂');
contentCatalogo = contentCatalogo.replace(/âœ¨ï¸ /g, '✨ ');
contentCatalogo = contentCatalogo.replace(/Ciudad AutÃ³noma/g, 'Ciudad Autónoma');
contentCatalogo = contentCatalogo.replace(/Fiesta del tÃ©/g, 'Fiesta del té');

fs.writeFileSync(fileCatalogo, contentCatalogo, 'utf8');

const fileFooter = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/componentes/FooterCatalogo.jsx');
let contentFooter = fs.readFileSync(fileFooter, 'utf8');

// Replace garbled copy symbol
contentFooter = contentFooter.replace(/Â©/g, '©');
contentFooter = contentFooter.replace(/SÃ¡bados/g, 'Sábados');

fs.writeFileSync(fileFooter, contentFooter, 'utf8');

console.log('Done fixing footer text and emojis');
