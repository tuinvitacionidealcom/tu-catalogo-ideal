const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let content = fs.readFileSync(file, 'utf8');

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

// Let's replace it with a commented out version or just remove it
content = content.replace(fetchBlock, `    // Cargar productos actualizados desde MySQL (Deshabilitado temporalmente para usar datos locales de Celebrarte)
    /*
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
    */`);

fs.writeFileSync(file, content, 'utf8');
console.log('Done disabling fetch in CelebrarteCatalogo.jsx');
