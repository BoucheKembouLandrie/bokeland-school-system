async function testUpdateFlow() {
    console.log('--- Démarrage de la simulation de mise à jour ---');
    try {
        // 1. Publier une mise à jour sur license-server
        console.log('1. Publication de la mise à jour (license-server:5005)');
        const updateRes = await fetch('http://localhost:5005/api/admin/updates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                version: '1.2.3-SIMULATION',
                changelog: 'Nouvelles fonctionnalités de test, protection DB vérifiée.',
                manifest: {
                    files: ['frontend.zip', 'backend.zip'],
                    migrations: [{ type: 'add_column', table: 'clients', column: 'test_column' }]
                }
            })
        });
        const updateData = await updateRes.json();
        console.log('   -> Mise à jour publiée:', updateData.update?.version);

        // 2. Attendre que le socket.io de leuana-school/backend reçoive la notification
        console.log('2. Attente de la réception par le client (2s)...');
        await new Promise(r => setTimeout(r, 2000));

        // 3. Vérifier le statut de leuana-school via l\'API locale
        console.log('3. Vérification du statut sur leuana-school/backend (port 5006)');
        const statusRes = await fetch('http://localhost:5006/api/update/status');
        const statusData = await statusRes.json();
        console.log('   -> Statut:', statusData);

        if (!statusData.available) {
            throw new Error("❌ Le client n'a pas détecté la mise à jour !");
        }
        console.log('   ✅ Mise à jour bien détectée par le client !');

        // 4. Lancer l'installation (test migration DB protégée)
        console.log('4. Déclenchement de l\'installation...');
        const installRes = await fetch('http://localhost:5006/api/update/install', { method: 'POST' });
        const installData = await installRes.json();
        console.log('   -> Résultat:', installData);

        if (installData.success) {
            console.log('   ✅ Installation réussie, structure DB saine.');
        } else {
            throw new Error("❌ Échec de l'installation !");
        }

        console.log('--- Fin de la simulation (SUCCÈS) ---');
    } catch (error) {
        console.error('❌ ERREUR LORS DE LA SIMULATION:', error.message || error);
    }
}

testUpdateFlow();
