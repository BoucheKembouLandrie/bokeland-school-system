import sequelize from './config/database';
import Attendance from './models/Attendance';

const run = async () => {
    try {
        console.log("Testing direct DB insertion...");
        await sequelize.authenticate();
        console.log("Connected to database.");

        // Test 1: Check if attendance table exists
        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log("Tables:", tables);

        // Test 2: Try to insert a record directly
        const testRecord = await Attendance.create({
            eleve_id: 1,
            date: '2026-02-16',
            statut: 'retard',
            motif: 'Test insertion',
            time: '08:30',
            school_year_id: 1
        });
        console.log("✅ Record created:", testRecord.toJSON());

        // Test 3: Fetch all records
        const all = await Attendance.findAll();
        console.log(`Total attendance records: ${all.length}`);

    } catch (error: any) {
        console.error("❌ Error:", error.message);
        console.error("Stack:", error.stack);
    } finally {
        await sequelize.close();
    }
};

run();
