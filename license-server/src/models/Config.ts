import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface ConfigAttributes {
    key: string;
    value: string;
}

export class Config extends Model<ConfigAttributes> implements ConfigAttributes {
    public key!: string;
    public value!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Config.init(
    {
        key: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'configs',
    }
);
