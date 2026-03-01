const { Sequelize, DataTypes } = require('sequelize');

// Configuration
const sequelize = new Sequelize(
    'bokeland_school_system_db',
    'root',
    '',
    {
        host: 'localhost',
        port: 3308,
        dialect: 'mysql',
        logging: false,
    }
);

async function checkExpenses() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        // Raw query to check table columns
        const [results, metadata] = await sequelize.query("SELECT * FROM expenses LIMIT 1");
        console.log('Columns found:', Object.keys(results[0] || {}));

        if (results.length === 0) {
            console.log('Table exists but is empty.');
            // Check columns via DESCRIBE
            const [columns] = await sequelize.query("DESCRIBE expenses");
            console.log('Table Structure:', columns.map(c => c.Field));
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkExpenses();
