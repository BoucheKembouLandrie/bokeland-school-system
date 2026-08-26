import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface BroadcastImageAttributes {
    id: string;
    filename: string;
    imageUrl: string;
}

export interface BroadcastImageCreationAttributes {
    id?: string;
    filename: string;
    imageUrl: string;
}

export class BroadcastImage extends Model<BroadcastImageAttributes, BroadcastImageCreationAttributes> implements BroadcastImageAttributes {
    public id!: string;
    public filename!: string;
    public imageUrl!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

BroadcastImage.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'broadcast_images',
    }
);
