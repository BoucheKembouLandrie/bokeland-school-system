const { Sequelize } = require('sequelize');
const path = require('path');

async function resetDatabase() {
    console.log('🔄 Resetting leuana-school database...');

    const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3308,
        username: 'root',
        password: '',
        database: 'leuana_school_db',
        logging: false
    });

    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        // Drop all tables
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        const [tables] = await sequelize.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'leuana_school_db'
        `);

        for (const table of tables) {
            const tableName = table.table_name || table.TABLE_NAME;
            console.log(`  Dropping table: ${tableName}`);
            await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        }

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✅ All tables dropped successfully');
        console.log('');
        console.log('⚠️  IMPORTANT: Restart the backend server to recreate tables');
        console.log('   The server will automatically run migrations on startup');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

resetDatabase();
