const fs = require('fs');
const path = require('path');

const dirs = [
  'bakery-limon/componentes/CartModal.jsx',
  'birromi/componentes/CartModal.jsx',
  'celebrarte-julieta/componentes/CartModal.jsx',
  'perla-fit/componentes/CartModal.jsx'
];

dirs.forEach(relPath => {
  const fullPath = path.join(__dirname, 'frontend/src/catalogos', relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace unicode escapes with literal emojis
  content = content.replace(/\\uD83C\\uDF89/g, '🎉');
  content = content.replace(/\\uD83C\\uDF1F/g, '🌟');
  content = content.replace(/\\uD83D\\uDC64/g, '👤');
  content = content.replace(/\\uD83D\\uDCC5/g, '📅');
  content = content.replace(/\\uD83C\\uDFAD/g, '🎭');
  content = content.replace(/\\uD83D\\uDCCD/g, '📍');
  content = content.replace(/\\uD83D\\uDC65/g, '👥');
  content = content.replace(/\\uD83D\\uDED2/g, '🛒');
  content = content.replace(/\\uD83D\\uDCB0/g, '💰');
  
  // Also replace any corrupted mojibake just in case
  content = content.replace(/ðŸŽ‰/g, '🎉');
  content = content.replace(/ðŸŒŸ/g, '🌟');
  content = content.replace(/ðŸ‘¤/g, '👤');
  content = content.replace(/ðŸ“…/g, '📅');
  content = content.replace(/ðŸŽ­/g, '🎭');
  content = content.replace(/ðŸ“ /g, '📍');
  content = content.replace(/ðŸ‘¥/g, '👥');
  content = content.replace(/ðŸ›’/g, '🛒');
  content = content.replace(/ðŸ’°/g, '💰');
  
  // Also remove corrupted characters (U+FFFD)
  content = content.replace(/\uFFFD/g, '');

  fs.writeFileSync(fullPath, content, 'utf8');
});

console.log('Done fixing emojis in CartModals');
