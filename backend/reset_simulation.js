const { Sequelize } = require('sequelize');

const config = {
    username: 'root',
    password: '',
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    logging: false
};

async function resetDatabases() {
    // Connect to sys/root to drop databases
    const sequelize = new Sequelize('', config.username, config.password, config);

    try {
        console.log('Connecting to MySQL...');
        await sequelize.authenticate();

        // 1. Reset Application DB
        console.log('Resetting leuana_school_db...');
        await sequelize.query('DROP DATABASE IF EXISTS leuana_school_db');
        await sequelize.query('CREATE DATABASE leuana_school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        console.log('✅ leuana_school_db recreated empty.');

        // 2. Clean License DB (SQLite)
        const fs = require('fs');
        const path = require('path');
        const licenseDbPath = path.resolve(__dirname, '../../license-server/license.sqlite');

        if (fs.existsSync(licenseDbPath)) {
            console.log(`Deleting license DB at ${licenseDbPath}...`);
            fs.unlinkSync(licenseDbPath);
            console.log('✅ license.sqlite deleted.');
        } else {
            console.log('ℹ️ license.sqlite not found, nothing to delete.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

resetDatabases();
