
import { sequelize } from './models';

const run = async () => {
    try {
        await sequelize.authenticate();
        const queryInterface = sequelize.getQueryInterface();

        try {
            await queryInterface.addColumn('grades', 'observation', {
                type: 'VARCHAR(255)',
                allowNull: true
            });
            console.log("Column 'observation' added successfully.");
        } catch (error: any) {
            if (error.message.includes('Duplicate column')) {
                console.log("Column 'observation' already exists.");
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error("Error updating schema:", error);
    } finally {
        await sequelize.close();
    }
};

run();
