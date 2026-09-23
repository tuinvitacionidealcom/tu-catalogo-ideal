const fs = require('fs');
const path = require('path');

function fixMojibake(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/Ã¡/g, 'á');
  content = content.replace(/Ã©/g, 'é');
  content = content.replace(/Ã­/g, 'í');
  content = content.replace(/Ã³/g, 'ó');
  content = content.replace(/Ãº/g, 'ú');
  content = content.replace(/Ã±/g, 'ñ');
  content = content.replace(/Â¿/g, '¿');
  content = content.replace(/Â¡/g, '¡');
  content = content.replace(/Â©/g, '©');
  content = content.replace(/â€¢/g, '•'); // bullets in password placeholder
  fs.writeFileSync(filePath, content, 'utf8');
}

fixMojibake(path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/panel/LoginPanel.jsx'));
fixMojibake(path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/panel/CelebrartePanel.jsx'));

console.log('Done fixing mojibake');
