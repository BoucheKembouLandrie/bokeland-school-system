const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Build Process...');

// Set local cache for electron-builder to avoid permission issues
process.env.ELECTRON_BUILDER_CACHE = path.join(__dirname, '.builder-cache');
console.log(`📂 enhanced cache path: ${process.env.ELECTRON_BUILDER_CACHE}`);

// 1. Clean dist folders
console.log('🧹 Cleaning dist folders...');
const backendDist = path.join(__dirname, 'backend', 'dist');
const frontendDist = path.join(__dirname, 'frontend', 'dist');

if (fs.existsSync(backendDist)) fs.rmdirSync(backendDist, { recursive: true });
if (fs.existsSync(frontendDist)) fs.rmdirSync(frontendDist, { recursive: true });

// 2. Build Backend
console.log('🛠️ Building Backend...');
try {
    execSync('cd backend && npm install && npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Backend build failed!');
    process.exit(1);
}

// 3. Build Frontend
console.log('🎨 Building Frontend...');
try {
    execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Frontend build failed!');
    process.exit(1);
}

// 4. Verify outputs
if (!fs.existsSync(path.join(backendDist, 'server.js'))) {
    console.error('❌ Backend server.js missing!');
    process.exit(1);
}
if (!fs.existsSync(path.join(frontendDist, 'index.html'))) {
    console.error('❌ Frontend index.html missing!');
    process.exit(1);
}

// 4. Run Electron Builder
console.log('📦 Packaging Electron App...');
try {
    execSync('npx electron-builder', { stdio: 'inherit' });
    console.log('✅ Installer created successfully!');
} catch (error) {
    console.error('❌ Electron packaging failed!');
    process.exit(1);
}

console.log('✅ Build Complete! Installer is in /dist folder.');
