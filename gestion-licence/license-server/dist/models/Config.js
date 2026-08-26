"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Config extends sequelize_1.Model {
}
exports.Config = Config;
Config.init({
    key: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'configs',
});
