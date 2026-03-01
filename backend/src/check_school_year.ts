import sequelize from './config/database';

const run = async () => {
    try {
        console.log("Checking school years...");
        await sequelize.authenticate();

        const [years]: any = await sequelize.query(`
            SELECT id, name, start_year, end_year, is_active 
            FROM school_years 
            ORDER BY start_year DESC
        `);

        console.log("\n📅 Années scolaires dans la base de données:");
        console.log("=".repeat(60));

        if (years.length === 0) {
            console.log("❌ AUCUNE année scolaire trouvée !");
            console.log("Vous devez créer une année scolaire via Paramètres.");
        } else {
            years.forEach((year: any) => {
                const status = year.is_active ? "✅ ACTIVE" : "⚪ Inactive";
                console.log(`${status} | ${year.name} (${year.start_year}-${year.end_year}) | ID: ${year.id}`);
            });

            const activeYear = years.find((y: any) => y.is_active);
            if (activeYear) {
                console.log(`\n✅ Année scolaire active: ${activeYear.name}`);
            } else {
                console.log("\n❌ AUCUNE année scolaire n'est marquée comme active !");
                console.log("Solution: Activez une année via Paramètres → Années Scolaires");
            }
        }

    } catch (error: any) {
        console.error("❌ Error:", error.message);
    } finally {
        await sequelize.close();
    }
};

run();
