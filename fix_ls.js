const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let content = fs.readFileSync(file, 'utf8');

// Change local storage key to ignore old beer products cached in local storage
content = content.replace(/LOCAL_STORAGE_PRODUCTS_KEY = 'celebrarte_products_custom'/g, "LOCAL_STORAGE_PRODUCTS_KEY = 'celebrarte_products_v2'");
content = content.replace(/LOCAL_STORAGE_INFO_KEY = 'celebrarte_info_custom'/g, "LOCAL_STORAGE_INFO_KEY = 'celebrarte_info_v2'");

fs.writeFileSync(file, content, 'utf8');
console.log('Done updating local storage keys in CelebrarteCatalogo.jsx');
