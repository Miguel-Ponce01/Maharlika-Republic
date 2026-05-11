const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Maharlika Republic Diagnostic Tests...\n');

const rootDir = path.join(__dirname, '..');

const filesToCheck = [
    { name: 'index.html', path: path.join(rootDir, 'index.html') },
    { name: 'style.css', path: path.join(__dirname, 'style.css') },
    { name: 'main.js', path: path.join(__dirname, 'main.js') },
    { name: 'package.json', path: path.join(rootDir, 'package.json') },
    { name: 'Dockerfile', path: path.join(rootDir, 'Dockerfile') }
];

let errors = 0;

// 1. Check File Existence
filesToCheck.forEach(file => {
    if (fs.existsSync(file.path)) {
        console.log(`✅ ${file.name} exists.`);
    } else {
        console.log(`❌ ${file.name} is missing at ${file.path}!`);
        errors++;
    }
});

// 2. Check index.html for core elements
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    
    if (content.includes('MAHARLIKA REPUBLIC')) {
        console.log('✅ Branding: Maharlika Republic found in index.html.');
    } else {
        console.log('❌ Branding: Maharlika Republic missing from index.html!');
        errors++;
    }

    if (content.includes('gsap.min.js')) {
        console.log('✅ Dependencies: GSAP is linked.');
    } else {
        console.log('❌ Dependencies: GSAP is NOT linked!');
        errors++;
    }
}

console.log(`\n📊 Diagnostics Complete. Errors found: ${errors}`);

if (errors > 0) {
    process.exit(1);
} else {
    console.log('🚀 Project is in great shape!\n');
    process.exit(0);
}
