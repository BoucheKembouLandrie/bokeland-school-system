import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface CommissionAttributes {
    id?: number;
    affiliate_id: number;
    client_id: number;
    payment_id: number;
    amount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
}

export class Commission extends Model<CommissionAttributes> implements CommissionAttributes {
    public id!: number;
    public affiliate_id!: number;
    public client_id!: number;
    public payment_id!: number;
    public amount!: number;
    public status!: 'PENDING' | 'PAID' | 'CANCELLED';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Commission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        affiliate_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        payment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'PENDING',
            validate: { isIn: [['PENDING', 'PAID', 'CANCELLED']] }
        }
    },
    {
        sequelize,
        tableName: 'commissions',
    }
);
