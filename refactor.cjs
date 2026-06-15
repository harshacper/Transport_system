const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace single-quoted URLs
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  
  // Replace backtick-quoted URLs
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");

  // Handle bare string initializations like io('http://localhost:5000') -> io(import.meta.env.VITE_API_URL || 'http://localhost:5000')
  content = content.replace(/io\('http:\/\/localhost:5000'\)/g, "io(import.meta.env.VITE_API_URL || 'http://localhost:5000')");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir('company_frontend/src');
walkDir('driver_frontend/src');
console.log('Done refactoring!');
