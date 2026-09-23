const fs = require('fs');
const path = require('path');

function fixEmojis(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/âš /g, '⚠️');
  content = content.replace(/âš/g, '⚠️'); // just in case without space
  fs.writeFileSync(filePath, content, 'utf8');
}

fixEmojis(path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/panel/CelebrartePanel.jsx'));
fixEmojis(path.join(__dirname, 'frontend/src/catalogos/birromi/panel/BirromiPanel.jsx'));

console.log('Done fixing warning emoji');
