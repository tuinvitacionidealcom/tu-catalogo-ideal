const fs = require('fs');
const path = require('path');

const fileCatalogo = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let contentCatalogo = fs.readFileSync(fileCatalogo, 'utf8');

const fetchBlock = `    // Cargar productos actualizados desde MySQL
    fetch(\`\${API_BASE}/?request=products/1\`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.data)) {
          const dbProducts = data.data.map(p => {
            if (!p.image || p.image.trim() === '') {
              const defaultProd = defaultProducts.find(dp => dp.id === p.id || dp.name.toLowerCase() === p.name.toLowerCase());
              if (defaultProd) {
                p.image = defaultProd.image;
              }
            }
            return p;
          });
          setProducts(dbProducts);
        }
      })
      .catch(() => {});`;

const commentedFetchBlock = `    /*
    // Cargar productos actualizados desde MySQL - DESHABILITADO para no traer las cervezas de Ludus
    fetch(\`\${API_BASE}/?request=products/1\`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.data)) {
          const dbProducts = data.data.map(p => {
            if (!p.image || p.image.trim() === '') {
              const defaultProd = defaultProducts.find(dp => dp.id === p.id || dp.name.toLowerCase() === p.name.toLowerCase());
              if (defaultProd) {
                p.image = defaultProd.image;
              }
            }
            return p;
          });
          setProducts(dbProducts);
        }
      })
      .catch(() => {});
    */`;

contentCatalogo = contentCatalogo.replace(fetchBlock, commentedFetchBlock);

fs.writeFileSync(fileCatalogo, contentCatalogo, 'utf8');
console.log('Disabled product fetch from DB');
