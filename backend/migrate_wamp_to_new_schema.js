const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1',
    port: 3308,
    user: 'leuana',
    password: 'leuana123',
    database: 'bokeland_school_system_db'
};

async function migrateSchema() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to DB. Starting migration...\n');

    try {
        // 1. Get the active school year ID
        const [years] = await connection.query('SELECT id FROM school_years WHERE is_active = 1 LIMIT 1');
        const activeYearId = years.length > 0 ? years[0].id : 4; // Default to ID 4 if none active
        console.log(`Active school year ID: ${activeYearId}\n`);

        // 2. Migrate STUDENTS table
        console.log('Migrating STUDENTS table...');

        // Add new columns if they don't exist
        const studentAlters = [
            "ALTER TABLE students ADD COLUMN nom VARCHAR(255)",
            "ALTER TABLE students ADD COLUMN prenom VARCHAR(255)",
            "ALTER TABLE students ADD COLUMN classe_id INT",
            "ALTER TABLE students ADD COLUMN school_year_id INT DEFAULT " + activeYearId,
            "ALTER TABLE students ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE students ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ];

        for (const query of studentAlters) {
            try {
                await connection.query(query);
                console.log('  ✓', query.substring(0, 60) + '...');
            } catch (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.log('  ⚠', err.message);
                }
            }
        }

        // Split nom_complet into nom/prenom
        await connection.query(`
            UPDATE students 
            SET nom = SUBSTRING_INDEX(nom_complet, ' ', -1),
                prenom = SUBSTRING_INDEX(nom_complet, ' ', 1)
            WHERE nom IS NULL OR prenom IS NULL
        `);
        console.log('  ✓ Split nom_complet into nom/prenom\n');

        // 3. Migrate CLASSES table
        console.log('Migrating CLASSES table...');

        const classAlters = [
            "ALTER TABLE classes ADD COLUMN school_year_id INT DEFAULT " + activeYearId,
            "ALTER TABLE classes ADD COLUMN nom VARCHAR(255)",
            "ALTER TABLE classes ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE classes ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ];

        for (const query of classAlters) {
            try {
                await connection.query(query);
                console.log('  ✓', query.substring(0, 60) + '...');
            } catch (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.log('  ⚠', err.message);
                }
            }
        }

        // Copy libelle to nom if nom is null
        await connection.query(`
            UPDATE classes 
            SET nom = libelle
            WHERE nom IS NULL
        `);
        console.log('  ✓ Copied libelle to nom\n');

        // 4. Link students to classes
        console.log('Linking students to classes...');
        await connection.query(`
            UPDATE students s
            INNER JOIN classes c ON s.classe = c.libelle
            SET s.classe_id = c.id
            WHERE s.classe_id IS NULL
        `);
        console.log('  ✓ Students linked to classes\n');

        // 5. Verify migration
        const [studentCount] = await connection.query('SELECT COUNT(*) as count FROM students WHERE school_year_id = ?', [activeYearId]);
        const [classCount] = await connection.query('SELECT COUNT(*) as count FROM classes WHERE school_year_id = ?', [activeYearId]);

        console.log('Migration complete!');
        console.log(`  - Students in active year: ${studentCount[0].count}`);
        console.log(`  - Classes in active year: ${classCount[0].count}`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrateSchema();
