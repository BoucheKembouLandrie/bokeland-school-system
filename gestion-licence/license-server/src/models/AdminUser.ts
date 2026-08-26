import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface AdminUserAttributes {
    id?: number;
    username: string;
    password_hash: string;
    email: string;
    is_default: boolean;
}

export class AdminUser extends Model<AdminUserAttributes> implements AdminUserAttributes {
    public id!: number;
    public username!: string;
    public password_hash!: string;
    public email!: string;
    public is_default!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

AdminUser.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'admin_users',
    }
);
