const fs = require('fs');
const path = require('path');

function fixEmojis(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/ðŸ“¦/g, '📦');
  content = content.replace(/ðŸ“·/g, '📸');
  content = content.replace(/ðŸ“ˆ/g, '📈');
  content = content.replace(/ðŸ””/g, '🔔');
  content = content.replace(/ðŸ‘‹/g, '👋');
  content = content.replace(/ðŸ“œ/g, '📜');
  content = content.replace(/ðŸ”‘/g, '🔑');
  content = content.replace(/ðŸ’¡/g, '💡');
  fs.writeFileSync(filePath, content, 'utf8');
}

fixEmojis(path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/panel/CelebrartePanel.jsx'));
fixEmojis(path.join(__dirname, 'frontend/src/catalogos/birromi/panel/BirromiPanel.jsx'));

console.log('Done fixing emojis');
