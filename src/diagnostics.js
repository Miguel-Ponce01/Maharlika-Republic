const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Maharlika Republic Next.js Platform Diagnostics...\n');

const rootDir = path.join(__dirname, '..');

const filesToCheck = [
    { name: 'package.json', path: path.join(rootDir, 'package.json') },
    { name: 'next.config.mjs', path: path.join(rootDir, 'next.config.mjs') },
    { name: 'tsconfig.json', path: path.join(rootDir, 'tsconfig.json') },
    { name: 'app/page.tsx', path: path.join(rootDir, 'app', 'page.tsx') },
    { name: 'app/layout.tsx', path: path.join(rootDir, 'app', 'layout.tsx') },
    { name: 'src/db/schema.ts', path: path.join(__dirname, 'db', 'schema.ts') },
    { name: 'src/db/index.ts', path: path.join(__dirname, 'db', 'index.ts') },
    { name: 'src/store/useCartStore.ts', path: path.join(__dirname, 'store', 'useCartStore.ts') },
    { name: 'src/store/useThemeStore.ts', path: path.join(__dirname, 'store', 'useThemeStore.ts') },
    { name: '.env.example', path: path.join(rootDir, '.env.example') }
];

let errors = 0;

// 1. Check Core File Existence
console.log('📂 Verifying file structure...');
filesToCheck.forEach(file => {
    if (fs.existsSync(file.path)) {
        console.log(`  ✅ ${file.name} is present.`);
    } else {
        console.log(`  ❌ ${file.name} is MISSING! (Path: ${file.path})`);
        errors++;
    }
});

// 2. Validate package.json dependencies
console.log('\n📦 Verifying project dependencies...');
const packageJsonPath = path.join(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const requiredDeps = ['next', 'drizzle-orm', '@supabase/supabase-js', 'framer-motion', 'zustand'];
        
        requiredDeps.forEach(dep => {
            if (pkg.dependencies && pkg.dependencies[dep]) {
                console.log(`  ✅ Dependency '${dep}' is installed (${pkg.dependencies[dep]}).`);
            } else {
                console.log(`  ❌ Dependency '${dep}' is MISSING in package.json!`);
                errors++;
            }
        });
    } catch (e) {
        console.log(`  ❌ Error reading package.json: ${e.message}`);
        errors++;
    }
}

console.log(`\n📊 Diagnostics Complete. Errors found: ${errors}`);

if (errors > 0) {
    console.log('❌ Project diagnostics failed. Please resolve the missing assets.');
    process.exit(1);
} else {
    console.log('🚀 Next.js project is fully configured and ready!\n');
    process.exit(0);
}
