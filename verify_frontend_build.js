const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Verifying Frontend Build...');

try {
    console.log('📦 Installing Dependencies...');
    execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

    console.log('🏗️ Building Frontend...');
    execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

    const distPath = path.join(__dirname, 'frontend', 'dist', 'index.html');
    if (fs.existsSync(distPath)) {
        console.log('✅ Frontend Build Successful!');
    } else {
        console.error('❌ Build completed but index.html missing!');
        process.exit(1);
    }

} catch (error) {
    console.error('❌ Frontend build failed:', error.message);
    process.exit(1);
}
