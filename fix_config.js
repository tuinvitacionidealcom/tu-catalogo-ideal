const fs = require('fs');
const path = require('path');

const fileConfig = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/config.js');
let contentConfig = fs.readFileSync(fileConfig, 'utf8');

contentConfig = contentConfig.replace(/SÃ¡bados/g, 'Sábados');
contentConfig = contentConfig.replace(/AutÃ³noma/g, 'Autónoma');

fs.writeFileSync(fileConfig, contentConfig, 'utf8');
console.log('Done fixing encoding in config.js');
