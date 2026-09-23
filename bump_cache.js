const fs = require('fs');
const path = require('path');

const fileCatalogo = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let contentCatalogo = fs.readFileSync(fileCatalogo, 'utf8');

contentCatalogo = contentCatalogo.replace(
  /const LOCAL_STORAGE_INFO_KEY = 'celebrarte_info_v2';/,
  "const LOCAL_STORAGE_INFO_KEY = 'celebrarte_info_v3';"
);

fs.writeFileSync(fileCatalogo, contentCatalogo, 'utf8');
console.log('Bumped INFO cache key to v3');
