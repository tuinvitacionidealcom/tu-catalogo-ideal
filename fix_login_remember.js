const fs = require('fs');
const path = require('path');

const dirs = [
  'bakery-limon/panel/LoginPanel.jsx',
  'birromi/panel/LoginPanel.jsx',
  'celebrarte-julieta/panel/LoginPanel.jsx',
  'perla-fit/panel/LoginPanel.jsx'
];

dirs.forEach(relPath => {
  const fullPath = path.join(__dirname, 'frontend/src/catalogos', relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace useState('') for username and password
  content = content.replace(/const \[username, setUsername\] = useState\(''\);/, `const [username, setUsername] = useState(() => localStorage.getItem('panel_saved_user') || '');`);
  content = content.replace(/const \[password, setPassword\] = useState\(''\);/, `const [password, setPassword] = useState(() => localStorage.getItem('panel_saved_pass') || '');`);

  // Insert saving logic inside handleSubmit
  content = content.replace(/const handleSubmit = \(e\) => {\s*e\.preventDefault\(\);\s*onLogin\(username, password\);\s*};/, 
    `const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('panel_saved_user', username);
    localStorage.setItem('panel_saved_pass', password);
    onLogin(username, password);
  };`);

  fs.writeFileSync(fullPath, content, 'utf8');
});

console.log('Login panels updated to remember credentials');
