const fs = require('fs');
const path = require('path');

const normalizeFn = `
  const normalizeStr = (str) => (str || '').normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();`;

const dirs = [
  'bakery-limon/page/BakeryLimonCatalogo.jsx',
  'birromi/page/BirromiCatalogo.jsx',
  'celebrarte-julieta/page/CelebrarteCatalogo.jsx',
  'perla-fit/page/PerlaFitCatalogo.jsx'
];

dirs.forEach(relPath => {
  const fullPath = path.join(__dirname, 'frontend/src/catalogos', relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace old Birromi and Celebrarte
  content = content.replace(/const query = searchQuery\.toLowerCase\(\);\s*const matchesSearch = product\.name\.toLowerCase\(\)\.includes\(query\) \|\| product\.description\.toLowerCase\(\)\.includes\(query\);/, 
    `const query = normalizeStr(searchQuery);\n    const matchesSearch = normalizeStr(product.name).includes(query) || normalizeStr(product.description).includes(query);`);
  
  // Replace old PerlaFit and Bakery
  content = content.replace(/const matchesSearch = product\.name\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\) \|\| \s*product\.description\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\);/,
    `const query = normalizeStr(searchQuery);\n    const matchesSearch = normalizeStr(product.name).includes(query) || normalizeStr(product.description).includes(query);`);

  // Insert normalizeStr function right before the filtering happens, 
  // usually inside filteredProducts useMemo or similar.
  // Actually, we can just replace 'const query = normalizeStr' with the function definition followed by it.
  content = content.replace(/const query = normalizeStr\(searchQuery\);/, 
    `const normalizeStr = (str) => (str || '').normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();\n    const query = normalizeStr(searchQuery);`);

  fs.writeFileSync(fullPath, content, 'utf8');
});

console.log('Search logic updated for accents');
