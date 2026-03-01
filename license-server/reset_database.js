const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

async function resetLicenseDatabase() {
    console.log('🔄 Resetting license-server database...');

    const dbPath = path.resolve(__dirname, '../license.sqlite');

    try {
        // Delete the SQLite database file
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log('✅ Deleted license.sqlite');
        } else {
            console.log('ℹ️  license.sqlite not found (already clean)');
        }

        console.log('✅ License database reset complete');
        console.log('');
        console.log('⚠️  IMPORTANT: Restart the license-server to recreate the database');
        console.log('   The server will automatically create tables on startup');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

resetLicenseDatabase();
