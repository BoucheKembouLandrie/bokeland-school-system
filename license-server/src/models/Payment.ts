import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Payment extends Model {
    public id!: number;
    public client_id!: number;
    public amount!: number;
    public payment_date!: Date;
    public payment_method!: string;
    public transaction_id!: string;
    public external_reference!: string;
    public invoice_number!: string;
    public status!: string;
    public days_added!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Clients',
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        payment_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        payment_method: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'manual',
            comment: 'stripe, mobile_money, bank_transfer, manual'
        },
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        external_reference: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'completed',
            comment: 'pending, completed, failed, refunded'
        },
        days_added: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 444,
        },
    },
    {
        sequelize,
        tableName: 'Payments',
        timestamps: true,
    }
);
