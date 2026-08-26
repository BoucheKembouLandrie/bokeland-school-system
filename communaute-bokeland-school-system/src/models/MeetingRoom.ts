import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MeetingRoomAttributes {
    id: string;
    title: string;
    host_key: string;
    host_name: string;
    scheduled_at_gmt: string;
    is_active: boolean;
    created_at: Date;
}

interface MeetingRoomCreationAttributes extends Optional<MeetingRoomAttributes, 'is_active' | 'created_at'> { }

export class MeetingRoom extends Model<MeetingRoomAttributes, MeetingRoomCreationAttributes>
    implements MeetingRoomAttributes {
    declare id: string;
    declare title: string;
    declare host_key: string;
    declare host_name: string;
    declare scheduled_at_gmt: string;
    declare is_active: boolean;
    declare created_at: Date;
}

MeetingRoom.init(
    {
        id: { type: DataTypes.STRING, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        host_key: { type: DataTypes.STRING, allowNull: false },
        host_name: { type: DataTypes.STRING, allowNull: false },
        scheduled_at_gmt: { type: DataTypes.STRING, allowNull: false },
        is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize,
        tableName: 'meeting_rooms',
        timestamps: false,
    }
);
