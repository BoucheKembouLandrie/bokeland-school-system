import sequelize from './config/database';

const run = async () => {
    try {
        console.log("Checking database for attendance table...");
        await sequelize.authenticate();
        console.log("✅ Connected to database.");

        // Check if attendance table exists
        const [tables]: any = await sequelize.query("SHOW TABLES");
        console.log("\n📋 All tables in database:");
        tables.forEach((table: any) => {
            const tableName = Object.values(table)[0];
            console.log(`  - ${tableName}`);
        });

        const attendanceExists = tables.some((table: any) =>
            Object.values(table)[0] === 'attendance'
        );

        if (attendanceExists) {
            console.log("\n✅ Table 'attendance' EXISTS");

            // Show table structure
            const [columns]: any = await sequelize.query("DESCRIBE attendance");
            console.log("\n📊 Structure of 'attendance' table:");
            columns.forEach((col: any) => {
                console.log(`  ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'REQUIRED' : 'OPTIONAL'}`);
            });

            // Count records
            const [count]: any = await sequelize.query("SELECT COUNT(*) as total FROM attendance");
            console.log(`\n📈 Total records: ${count[0].total}`);

        } else {
            console.log("\n❌ Table 'attendance' DOES NOT EXIST!");
            console.log("The table needs to be created.");
        }

    } catch (error: any) {
        console.error("❌ Error:", error.message);
    } finally {
        await sequelize.close();
    }
};

run();
