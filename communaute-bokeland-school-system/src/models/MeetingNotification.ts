import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MeetingNotificationAttributes {
    id: number;
    meeting_id: string;
    initiator_key: string;
    initiator_name: string;
    target_school_email: string;
    title: string;
    scheduled_at_gmt: string;
    created_at: Date;
}

interface MeetingNotificationCreationAttributes extends Optional<MeetingNotificationAttributes, 'id' | 'created_at'> { }

export class MeetingNotification extends Model<MeetingNotificationAttributes, MeetingNotificationCreationAttributes>
    implements MeetingNotificationAttributes {
    declare id: number;
    declare meeting_id: string;
    declare initiator_key: string;
    declare initiator_name: string;
    declare target_school_email: string;
    declare title: string;
    declare scheduled_at_gmt: string;
    declare created_at: Date;
}

MeetingNotification.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        meeting_id: { type: DataTypes.STRING, allowNull: false },
        initiator_key: { type: DataTypes.STRING, allowNull: false },
        initiator_name: { type: DataTypes.STRING, allowNull: false },
        target_school_email: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        scheduled_at_gmt: { type: DataTypes.STRING, allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize,
        tableName: 'meeting_notifications',
        timestamps: false,
    }
);
