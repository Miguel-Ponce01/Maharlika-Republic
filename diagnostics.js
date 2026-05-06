const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Maharlika Republic Diagnostic Tests...\n');

const filesToCheck = [
    'index.html',
    'style.css',
    'main.js',
    'package.json',
    'Dockerfile'
];

let errors = 0;

// 1. Check File Existence
filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} exists.`);
    } else {
        console.log(`❌ ${file} is missing!`);
        errors++;
    }
});

// 2. Check index.html for core elements
if (fs.existsSync(path.join(__dirname, 'index.html'))) {
    const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    
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
