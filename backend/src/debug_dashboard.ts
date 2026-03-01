import db from './models';

async function debugDashboard() {
    try {
        console.log('=== DEBUGGING DASHBOARD DATA ===\n');

        // Check school years
        const schoolYears = await db.SchoolYear.findAll();
        console.log(`📅 School Years: ${schoolYears.length}`);
        schoolYears.forEach((year: any) => {
            console.log(`   - ${year.name} (ID: ${year.id}, Start: ${year.startYear}, End: ${year.endYear}, Active: ${year.isActive})`);
        });

        // Check classes
        const classes = await db.Class.findAll();
        console.log(`\n🏫 Classes: ${classes.length}`);
        classes.forEach((cls: any) => {
            console.log(`   - ${cls.nom} (ID: ${cls.id}, Year: ${cls.annee})`);
        });

        // Check students
        const students = await db.Student.findAll();
        console.log(`\n👨‍🎓 Students: ${students.length}`);
        if (students.length > 0) {
            console.log(`   First 5 students:`);
            students.slice(0, 5).forEach((student: any) => {
                console.log(`   - ${student.nom} ${student.prenom} (Class ID: ${student.classe_id})`);
            });
        }

        // Check teachers
        const teachers = await db.Teacher.findAll();
        console.log(`\n👨‍🏫 Teachers: ${teachers.length}`);

        // Check payments
        const payments = await db.Payment.findAll();
        console.log(`\n💰 Payments: ${payments.length}`);
        if (payments.length > 0) {
            console.log(`   First 3 payments:`);
            payments.slice(0, 3).forEach((payment: any) => {
                console.log(`   - ${payment.montant} FCFA on ${payment.date_paiement}`);
            });
        }

        // Check if there's a mismatch between class years and school years
        if (schoolYears.length > 0 && classes.length > 0) {
            console.log('\n🔍 YEAR MATCHING ANALYSIS:');
            const activeYear = schoolYears.find((y: any) => y.isActive);
            if (activeYear) {
                console.log(`   Active year: ${activeYear.name}`);
                const matchingClasses = classes.filter((c: any) => c.annee === activeYear.name);
                console.log(`   Classes matching active year: ${matchingClasses.length}`);

                if (matchingClasses.length === 0) {
                    console.log('   ⚠️  WARNING: No classes match the active school year!');
                    console.log('   Available class years:');
                    const uniqueYears = [...new Set(classes.map((c: any) => c.annee))];
                    uniqueYears.forEach(year => {
                        console.log(`      - ${year}`);
                    });
                }
            } else {
                console.log('   ⚠️  WARNING: No active school year found!');
            }
        }

        console.log('\n=== END DEBUG ===');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugDashboard();
