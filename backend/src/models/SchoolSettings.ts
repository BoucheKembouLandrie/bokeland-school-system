import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class SchoolSettings extends Model {
    public id!: number;
    public school_name!: string;
    public website!: string;
    public address!: string;
    public phone!: string;
    public email!: string;
    public logo_url!: string;
    public date_format!: string;

    // License Fields
    public license_status!: string;
    public license_expiration_date!: Date;
    public license_check_date!: Date;

    // Onboarding Fields
    public country_code!: string;
    public country!: string;
    public language!: string;
    public is_onboarding_complete!: boolean;
}

SchoolSettings.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    school_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    license_status: {
        type: DataTypes.STRING, // 'ACTIVE', 'TRIAL', 'EXPIRED'
        defaultValue: 'TRIAL',
    },
    license_expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    license_check_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    date_format: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'dd/mm/yyyy',
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'fr',
    },
    is_onboarding_complete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    tableName: 'school_settings',
});

export default SchoolSettings;
