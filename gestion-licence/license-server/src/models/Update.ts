import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface UpdateAttributes {
    id?: number;
    version: string;
    changelog?: string;
    manifest: string; // JSON string of files and migrations
    release_date?: Date;
}

export class Update extends Model<UpdateAttributes> implements UpdateAttributes {
    public id!: number;
    public version!: string;
    public changelog!: string;
    public manifest!: string;
    public release_date!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Update.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        version: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        changelog: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        manifest: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        release_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'updates',
    }
);
