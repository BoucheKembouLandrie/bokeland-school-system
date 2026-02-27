
import { sequelize } from './models';
import SchoolYear from './models/SchoolYear';

const run = async () => {
    try {
        await sequelize.authenticate();
        const years = await SchoolYear.findAll();
        console.log(`School Years found: ${years.length}`);
        if (years.length > 0) {
            console.log("Years:", years.map(y => y.toJSON()));
        } else {
            console.log("NO SCHOOL YEARS FOUND!");
        }
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
};

run();
