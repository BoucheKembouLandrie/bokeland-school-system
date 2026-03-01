import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class UpdateVersion extends Model {
    public id!: number;
    public version!: string; // Extracted from latest.yml or filename
    public filename!: string;
    public type!: 'yml' | 'exe';
    public size!: number;
    public readonly createdAt!: Date;
}

UpdateVersion.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('yml', 'exe'),
        allowNull: false,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'update_versions',
});
