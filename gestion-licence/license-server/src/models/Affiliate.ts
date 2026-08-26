import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface AffiliateAttributes {
    id?: number;
    email: string;
    phone_number?: string | null;
    password_hash?: string | null;
    balance: number;
    status: 'GHOST' | 'ACTIVE' | 'BANNED';
    custom_commission_rate?: number | null;
    otp_code?: string | null;
    otp_expires_at?: Date | null;
    currency?: string | null;
}

export class Affiliate extends Model<AffiliateAttributes> implements AffiliateAttributes {
    public id!: number;
    public email!: string;
    public phone_number!: string | null;
    public password_hash!: string | null;
    public balance!: number;
    public status!: 'GHOST' | 'ACTIVE' | 'BANNED';
    public custom_commission_rate!: number | null;
    public otp_code!: string | null;
    public otp_expires_at!: Date | null;
    public currency!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Affiliate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'GHOST',
            validate: { isIn: [['GHOST', 'ACTIVE', 'BANNED']] }
        },
        custom_commission_rate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        otp_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otp_expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        currency: {
            type: DataTypes.STRING(10),
            allowNull: true,
            defaultValue: null,
        }
    },
    {
        sequelize,
        tableName: 'affiliates',
    }
);
