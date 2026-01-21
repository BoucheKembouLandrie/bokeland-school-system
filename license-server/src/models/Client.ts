import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface ClientAttributes {
    id?: number;
    machine_id: string;
    school_name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    trial_start_date: Date;
    subscription_end_date: Date;
    status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'BANNED';
    last_checkin?: Date;
}

export class Client extends Model<ClientAttributes> implements ClientAttributes {
    public id!: number;
    public machine_id!: string;
    public school_name!: string;
    public email!: string;
    public phone!: string;
    public address!: string;
    public city!: string;
    public country!: string;
    public trial_start_date!: Date;
    public subscription_end_date!: Date;
    public status!: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'BANNED';
    public last_checkin!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Client.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        machine_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        school_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        trial_start_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        subscription_end_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('TRIAL', 'ACTIVE', 'EXPIRED', 'BANNED'),
            defaultValue: 'TRIAL',
        },
        last_checkin: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'clients',
    }
);

// Relationships will be set up in server.ts after all models are loaded
