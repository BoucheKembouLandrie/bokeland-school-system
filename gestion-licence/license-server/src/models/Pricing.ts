import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Pricing extends Model {
    public id!: number;
    public currency!: string;       // XAF, XOF, GNF, CDF...
    public amount!: number;          // Prix dans cette devise
    public days_added!: number;      // Durée de l'abonnement en jours
    public label!: string;           // Ex: "Abonnement annuel"
    public is_active!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Pricing.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        currency: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: false,
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        days_added: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 444,
        },
        label: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'Abonnement annuel',
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'pricings',
    }
);
