// Run this script to add onboarding columns to school_settings table
// Usage: node run_migration.js

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('leuana_school_db', 'root', '', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    logging: console.log,
});

async function runMigration() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('✓ Connected successfully');

        const queryInterface = sequelize.getQueryInterface();
        const tableName = 'school_settings';

        console.log('\nChecking existing columns...');
        const tableDescription = await queryInterface.describeTable(tableName);
        console.log('Existing columns:', Object.keys(tableDescription));

        // Add country_code column
        if (!tableDescription.country_code) {
            console.log('\nAdding column: country_code');
            await queryInterface.addColumn(tableName, 'country_code', {
                type: DataTypes.STRING(10),
                allowNull: true,
            });
            console.log('✓ Added country_code');
        } else {
            console.log('✓ country_code already exists');
        }

        // Add country column
        if (!tableDescription.country) {
            console.log('\nAdding column: country');
            await queryInterface.addColumn(tableName, 'country', {
                type: DataTypes.STRING(100),
                allowNull: true,
            });
            console.log('✓ Added country');
        } else {
            console.log('✓ country already exists');
        }

        // Add language column
        if (!tableDescription.language) {
            console.log('\nAdding column: language');
            await queryInterface.addColumn(tableName, 'language', {
                type: DataTypes.STRING(5),
                allowNull: true,
                defaultValue: 'fr',
            });
            console.log('✓ Added language');
        } else {
            console.log('✓ language already exists');
        }

        // Add is_onboarding_complete column
        if (!tableDescription.is_onboarding_complete) {
            console.log('\nAdding column: is_onboarding_complete');
            await queryInterface.addColumn(tableName, 'is_onboarding_complete', {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            });
            console.log('✓ Added is_onboarding_complete');
        } else {
            console.log('✓ is_onboarding_complete already exists');
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('\nVerifying final schema...');
        const finalDescription = await queryInterface.describeTable(tableName);
        console.log('Final columns:', Object.keys(finalDescription));

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        await sequelize.close();
        process.exit(1);
    }
}

runMigration();
