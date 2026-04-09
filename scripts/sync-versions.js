const fs = require('fs');
const path = require('path');

// Read root package.json
const rootPkgPath = path.join(__dirname, '..', 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const version = rootPkg.version;

console.log(`Syncing version ${version} to sub-packages...`);

const subPackages = [
  'frontend/package.json',
  'backend/package.json'
];

subPackages.forEach(subPath => {
  const fullPath = path.join(__dirname, '..', subPath);
  if (fs.existsSync(fullPath)) {
    const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    pkg.version = version;
    fs.writeFileSync(fullPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Updated ${subPath}`);
  } else {
    console.log(`Skipped ${subPath} (not found)`);
  }
});

console.log('Version sync complete!');
