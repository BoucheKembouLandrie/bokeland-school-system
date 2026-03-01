/**
 * Migration: Add onboarding fields to school_settings table
 * 
 * This migration adds the following columns:
 * - country_code: VARCHAR(10) - Phone country code (e.g., "+237")
 * - country: VARCHAR(100) - Country name (e.g., "Cameroon")
 * - language: VARCHAR(5) DEFAULT 'fr' - Application language (fr/en)
 * - is_onboarding_complete: BOOLEAN DEFAULT false - Onboarding completion flag
 * 
 * Run this migration manually using:
 * mysql -u root -p leuana_school < add_onboarding_fields.sql
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
    const tableName = 'school_settings';

    // Check if columns already exist before adding them
    const tableDescription = await queryInterface.describeTable(tableName);

    if (!tableDescription.country_code) {
        await queryInterface.addColumn(tableName, 'country_code', {
            type: DataTypes.STRING(10),
            allowNull: true,
        });
        console.log('Added column: country_code');
    }

    if (!tableDescription.country) {
        await queryInterface.addColumn(tableName, 'country', {
            type: DataTypes.STRING(100),
            allowNull: true,
        });
        console.log('Added column: country');
    }

    if (!tableDescription.language) {
        await queryInterface.addColumn(tableName, 'language', {
            type: DataTypes.STRING(5),
            allowNull: true,
            defaultValue: 'fr',
        });
        console.log('Added column: language');
    }

    if (!tableDescription.is_onboarding_complete) {
        await queryInterface.addColumn(tableName, 'is_onboarding_complete', {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        });
        console.log('Added column: is_onboarding_complete');
    }

    console.log('Migration completed successfully!');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    const tableName = 'school_settings';

    await queryInterface.removeColumn(tableName, 'country_code');
    await queryInterface.removeColumn(tableName, 'country');
    await queryInterface.removeColumn(tableName, 'language');
    await queryInterface.removeColumn(tableName, 'is_onboarding_complete');

    console.log('Migration rolled back successfully!');
}
