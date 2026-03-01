// Run this script to add ALL missing columns to school_settings table
// Usage: node add_all_missing_columns.js

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('leuana_school_db', 'root', '', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    logging: console.log,
});

async function addAllMissingColumns() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('✓ Connected successfully');

        const queryInterface = sequelize.getQueryInterface();
        const tableName = 'school_settings';

        console.log('\nChecking existing columns...');
        const tableDescription = await queryInterface.describeTable(tableName);
        console.log('Existing columns:', Object.keys(tableDescription));

        // Add license_status column
        if (!tableDescription.license_status) {
            console.log('\nAdding column: license_status');
            await queryInterface.addColumn(tableName, 'license_status', {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'NOT_REGISTERED',
            });
            console.log('✓ Added license_status');
        } else {
            console.log('✓ license_status already exists');
        }

        // Add license_expiration_date column
        if (!tableDescription.license_expiration_date) {
            console.log('\nAdding column: license_expiration_date');
            await queryInterface.addColumn(tableName, 'license_expiration_date', {
                type: DataTypes.DATE,
                allowNull: true,
            });
            console.log('✓ Added license_expiration_date');
        } else {
            console.log('✓ license_expiration_date already exists');
        }

        // Add license_check_date column
        if (!tableDescription.license_check_date) {
            console.log('\nAdding column: license_check_date');
            await queryInterface.addColumn(tableName, 'license_check_date', {
                type: DataTypes.DATE,
                allowNull: true,
            });
            console.log('✓ Added license_check_date');
        } else {
            console.log('✓ license_check_date already exists');
        }

        // Add date_format column
        if (!tableDescription.date_format) {
            console.log('\nAdding column: date_format');
            await queryInterface.addColumn(tableName, 'date_format', {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'dd/mm/yyyy',
            });
            console.log('✓ Added date_format');
        } else {
            console.log('✓ date_format already exists');
        }

        console.log('\n✅ All missing columns added successfully!');
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

addAllMissingColumns();
