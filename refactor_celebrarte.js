const fs = require('fs');
const path = require('path');

const fileCatalogo = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let content = fs.readFileSync(fileCatalogo, 'utf8');

// Add catalogId state
content = content.replace(
  /const \[viewMode, setViewMode\] = useState\('grid'\);/,
  "const [viewMode, setViewMode] = useState('grid');\n  const [catalogId, setCatalogId] = useState(null);"
);

// We need to replace the entire useEffect that does the data fetching.
// It starts right after the states.
const regexUseEffect = /useEffect\(\(\) => \{\s*\/\/ Registrar visita al catálogo[\s\S]*?return \(\) => \{\s*document\.body\.classList\.remove\('celebrarte-theme'\);\s*document\.title = originalTitle;\s*if \(faviconLink\) \{\s*faviconLink\.href = originalFavicon;\s*\}\s*\};\s*\}, \[\]\);/;

const newUseEffect = `useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';

    // 1. Obtener ID del catálogo por SLUG
    fetch(\`\${API_BASE}/?request=catalogs/celebrarte\`)
      .then(res => res.json())
      .then(catalogData => {
        if (catalogData.status === 'ok' && catalogData.data) {
          const currentCatalogId = catalogData.data.id;
          setCatalogId(currentCatalogId);

          // 2. Registrar visita usando el ID dinámico
          fetch(\`\${API_BASE}/?request=visits\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ catalog_id: currentCatalogId })
          }).catch(() => {});

          // 3. Cargar productos desde MySQL usando el ID dinámico
          fetch(\`\${API_BASE}/?request=products/\${currentCatalogId}\`)
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
        }
      }).catch(() => {});

    // Aplicar clase de tema para colores marrones
    document.body.classList.add('celebrarte-theme');

    const savedInfo = localStorage.getItem(LOCAL_STORAGE_INFO_KEY);
    let currentInfo = defaultInfo;
    if (savedInfo) {
      currentInfo = JSON.parse(savedInfo);
      setInfo(currentInfo);
    }

    // Guardar favicon y título originales
    const originalTitle = document.title;
    const faviconLink = document.querySelector("link[rel*='icon']");
    const originalFavicon = faviconLink ? faviconLink.href : '/favicon.svg';

    // Establecer título y favicon del negocio
    document.title = \`\${currentInfo.name} | Catálogo Digital\`;
    if (faviconLink && currentInfo.logo) {
      faviconLink.href = currentInfo.logo;
    }

    // Cleanup: Restaurar valores originales al salir del catálogo
    return () => {
      document.body.classList.remove('celebrarte-theme');
      document.title = originalTitle;
      if (faviconLink) {
        faviconLink.href = originalFavicon;
      }
    };
  }, []);`;

content = content.replace(regexUseEffect, newUseEffect);

// Replace catalogId in ContactForm
content = content.replace(
  /catalogId=\{1\}/,
  "catalogId={catalogId || 1}"
);

// Pass catalogId to CartModal
content = content.replace(
  /cartItems=\{cart\}/,
  "cartItems={cart}\n        catalogId={catalogId || 1}"
);

// Pass catalogId to ProductModal
content = content.replace(
  /product=\{selectedProduct\}/,
  "product={selectedProduct}\n        catalogId={catalogId || 1}"
);

fs.writeFileSync(fileCatalogo, content, 'utf8');
console.log('Done refactoring CelebrarteCatalogo.jsx');
