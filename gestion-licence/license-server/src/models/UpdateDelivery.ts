import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface UpdateDeliveryAttributes {
    id?: number;
    update_id: number;
    client_id: number;
    status: 'PENDING' | 'DELIVERED' | 'INSTALLED';
    delivered_at?: Date | null;
    acknowledged_at?: Date | null;
}

export class UpdateDelivery extends Model<UpdateDeliveryAttributes> implements UpdateDeliveryAttributes {
    public id!: number;
    public update_id!: number;
    public client_id!: number;
    public status!: 'PENDING' | 'DELIVERED' | 'INSTALLED';
    public delivered_at!: Date | null;
    public acknowledged_at!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

UpdateDelivery.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        update_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(20),
            defaultValue: 'PENDING',
            validate: { isIn: [['PENDING', 'DELIVERED', 'INSTALLED']] }
        },
        delivered_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        acknowledged_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'update_deliveries',
    }
);
