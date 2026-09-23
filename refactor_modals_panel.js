const fs = require('fs');
const path = require('path');

// Update CartModal
const fileCart = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/componentes/CartModal.jsx');
let contentCart = fs.readFileSync(fileCart, 'utf8');
contentCart = contentCart.replace(
  /const CartModal = \(\{ isOpen, onClose, cartItems, products, onAdd, onRemove, onClear, whatsappNumber \}\) => \{/,
  "const CartModal = ({ isOpen, onClose, cartItems, products, onAdd, onRemove, onClear, whatsappNumber, catalogId = 1 }) => {"
);
contentCart = contentCart.replace(
  /catalog_id: 1,/g,
  "catalog_id: catalogId,"
);
fs.writeFileSync(fileCart, contentCart, 'utf8');
console.log('Done CartModal');

// Update ProductModal
const fileProduct = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/componentes/ProductModal.jsx');
let contentProduct = fs.readFileSync(fileProduct, 'utf8');
contentProduct = contentProduct.replace(
  /const ProductModal = \(\{ isOpen, onClose, product, whatsappNumber \}\) => \{/,
  "const ProductModal = ({ isOpen, onClose, product, whatsappNumber, catalogId = 1 }) => {"
);
contentProduct = contentProduct.replace(
  /catalog_id: 1,/g,
  "catalog_id: catalogId,"
);
fs.writeFileSync(fileProduct, contentProduct, 'utf8');
console.log('Done ProductModal');

// Update CelebrartePanel
const filePanel = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/panel/CelebrartePanel.jsx');
let contentPanel = fs.readFileSync(filePanel, 'utf8');
contentPanel = contentPanel.replace(
  /const catalogId = user\?\.catalog_id \|\| 1;/g,
  "const catalogId = user?.catalog_id;"
);
contentPanel = contentPanel.replace(
  /catalog_id: user\?\.catalog_id \|\| 1,/g,
  "catalog_id: user?.catalog_id,"
);
// Also need to make sure API calls in panel only trigger if catalogId is present, but let's just let it be since user?.catalog_id is guaranteed when logged in.
fs.writeFileSync(filePanel, contentPanel, 'utf8');
console.log('Done CelebrartePanel');
