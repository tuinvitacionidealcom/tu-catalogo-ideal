const fs = require('fs');
const path = require('path');

const loginFile = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/panel/LoginPanel.jsx');
let loginContent = fs.readFileSync(loginFile, 'utf8');

// Replace Beer with PartyPopper
loginContent = loginContent.replace('Beer,', 'PartyPopper,');
loginContent = loginContent.replace('<Beer size={32} color="#fff" />', '<PartyPopper size={32} color="#fff" />');

// Replace Colors
loginContent = loginContent.replace(/#1a0a00/g, '#2a111a');
loginContent = loginContent.replace(/#2d1200/g, '#4a212d');
loginContent = loginContent.replace(/rgba\(180,100,20,0\.15\)/g, 'rgba(197,137,150,0.15)');
loginContent = loginContent.replace(/rgba\(180,100,20,0\.1\)/g, 'rgba(197,137,150,0.1)');
loginContent = loginContent.replace(/#d4a017/g, '#c58996');
loginContent = loginContent.replace(/rgba\(212,160,23,0\.2\)/g, 'rgba(197,137,150,0.2)');
loginContent = loginContent.replace(/#b46414/g, '#9a5a69');
loginContent = loginContent.replace(/rgba\(180,100,20,0\.4\)/g, 'rgba(197,137,150,0.4)');
loginContent = loginContent.replace(/rgba\(180,100,20,0\.12\)/g, 'rgba(197,137,150,0.12)');
loginContent = loginContent.replace(/rgba\(180,100,20,0\.2\)/g, 'rgba(197,137,150,0.2)');

fs.writeFileSync(loginFile, loginContent, 'utf8');


const panelFile = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/panel/CelebrartePanel.jsx');
let panelContent = fs.readFileSync(panelFile, 'utf8');

panelContent = panelContent.replace(/#b46414/g, '#9a5a69');
panelContent = panelContent.replace(/#d4a017/g, '#c58996');
panelContent = panelContent.replace(/rgba\(180,100,20,0\.3\)/g, 'rgba(197,137,150,0.3)');
panelContent = panelContent.replace(/#fffbf5/g, '#fcf0f2');

fs.writeFileSync(panelFile, panelContent, 'utf8');

console.log('Done customizing Celebrarte colors');
