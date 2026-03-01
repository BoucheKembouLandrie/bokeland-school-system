import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const content = `
# Stratégie de Déploiement et d'Installation Client

Ce document propose une approche technique pour répondre aux défis d'installation et de déploiement de **Leuana School** chez le client final (non-informaticien).

## 1. Communication Client-Serveur (Mise en Production)

Actuellement, tout tourne en local (\`localhost\`). Pour la production, l'architecture doit être divisée :

### A. Serveur de Licence (En Ligne)
C'est le "Cerveau" qui gère les abonnements. Il doit être hébergé sur un VPS (ex: Hostinger, OVH, AWS).
- **URL Publique** : \`https://license.leuanaschool.com\` (exemple)
- **Base de données** : PostgreSQL ou MySQL (hébergée).

**Paramètres à modifier avant mise en ligne :**
1. **Frontend Client (\`.env\` ou config)** : 
   - Remplacer \`LICENSE_SERVER_URL=http://localhost:3001\` par \`https://license.leuanaschool.com\`.
2. **Backend Client** :
   - S'assurer qu'il pointe aussi vers l'URL publique pour vérifier les licences.

---

## 2. L'Installation "WordPress-style" (Wizard)

L'idée est d'avoir un installateur simple (\`setup.exe\`) qui lance une interface de configuration au premier démarrage.

### Le Flux Proposé :
1. **Installation Technique Silencieuse** : Le client lance le setup. En arrière-plan, l'installateur dépose les fichiers, installe les dépendances (voir point 3) sans poser de questions techniques.
2. **Premier Lancement (Wizard)** :
   - L'application s'ouvre sur une page : *"Bienvenue sur Leuana School"*.
   - **Étape 1 : Informations École** (Nom, Pays, Ville, Tel, Email, Site Web).
   - **Étape 2 : Création Admin** (Nom utilisateur, Mot de passe).
   - **Étape 3 : Finalisation**.

### Synchronisation Serveur :
- Au clic sur "Terminer", l'application locale envoie une requête \`POST https://license.leuanaschool.com/api/register\` avec les infos de l'école.
- Le serveur en ligne crée le client, génère un **Machine ID** unique, et démarre la période d'essai (ou attend l'activation).
- Les infos sont enregistrées localement dans la base de données de l'école.

---

## 3. Le Challenge de la Base de Données (Le "No-WAMP")

Demander à un directeur d'école d'installer WAMP est une **mauvaise expérience utilisateur** (trop complexe, risques de conflits de ports, etc.).

### Solution Recommandée : SQLite ou Embedded MySQL
Pour une application locale monoposte ou petit réseau, **SQLite** est souvent suffisant et ne nécessite AUCUNE installation serveur. C'est juste un fichier \`.sqlite\`.

**Si MySQL est obligatoire (pour des raisons de performance ou fonctionnalités spécifiques) :**
- **Ne pas utiliser WAMP**.
- Utiliser une version **Portable de MariaDB/MySQL** incluse dans votre dossier d'installation.
- L'installateur configure MySQL pour tourner sur un port non-standard (ex: 3307) pour éviter les conflits, et l'installe comme un **Service Windows** invisible (\`LeuanaDBService\`).
- Tout cela se fait via des scripts batch (\`.bat\`) ou PowerShell lancés par l'installateur (Inno Setup ou Electron Builder).

### Architecture "Zero-Config" :
1. **Electron.js** (recommandé pour "emballer" votre appli React + Node).
2. Au démarrage, Electron lance le binaire du serveur Backend.
3. Le Backend vérifie si la DB existe. Si non -> Il la crée et lance le script de migration (tables tables).
4. Le Backend lance le navigateur par défaut sur l'écran de configuration.

---

## Résumé du Plan d'Action Technique

| Problème | Solution Technique |
| :--- | :--- |
| **Serveur En Ligne** | Héberger \`license-server\` sur un VPS. Changer \`API_URL\` dans le code client. |
| **Installation Facile** | Utiliser **Electron** pour créer un \`.exe\`. |
| **Base de Données** | Migrer vers **SQLite** (plus simple) ou inclure **MariaDB Portable** dans l'installeur. |
| **Configuration** | Créer une route \`/setup\` dans l'appli React qui s'affiche si la table \`SchoolInfo\` est vide. |
| **Sync Auto** | La route \`/setup\` poste les données au serveur local ET au serveur de licence en ligne. |

---

## 4. Migration des Données Existantes (WAMP vers Nouvelle DB)

**Oui, c'est tout à fait possible de transférer vos données actuelles.**

Si vous avez déjà des données (élèves, paiements, etc.) dans WAMP :

1.  **Export (Sauvegarde)** :
    - On utilise \`mysqldump\` (un outil standard) pour extraire toutes les données de WAMP dans un fichier \`.sql\`.
    - Commande : \`mysqldump -u root -p nom_de_votre_base > sauvegarde_leuana.sql\`

2.  **Import (Transfert)** :
    - Lors de l'installation de la nouvelle version (avec MariaDB Portable ou SQLite), on lance un script qui lit ce fichier \`.sql\` et réinjecte tout dans la nouvelle base.

**Ce processus peut être automatisé** : L'installateur peut détecter si WAMP est installé, demander l'autorisation, copier les données, puis désactiver WAMP pour éviter les conflits.

---

## 5. Protection du Code Source (Propriété Intellectuelle)

Pour empêcher le client d'accéder à votre savoir-faire technique :

1.  **Frontend (L'interface)** :
    - Le code est "compilé" et "minifié".

2.  **Backend (Le Serveur)** :
    - **Production (Sécurisé)** : Nous utiliserons un outil comme \`pkg\`.
    - **Résultat** : Tout votre code serveur (API, logique métier) est transformé en un seul fichier **\`leuana-server.exe\`**.
    - **Avantage** : C'est un fichier binaire fermé.

---

## 6. Gestion des Mises à Jour (Auto-Update)

Pour que l'application évolue sans perdre de données :

1.  **Technologie** : Nous utiliserons **electronic-updater** (standard utilisé par VS Code, Discord...).
2.  **Le Principe** : L'application vérifie silencieusement au démarrage si une nouvelle version existe sur votre serveur (\`license-server\`) et la télécharge.
3.  **Protection des Données** : Le dossier du *Code* est séparé du dossier des *Données*. Lors de la mise à jour, seul le dossier *Code* est écrasé.
4.  **Migration de Base de Données** : Si une mise à jour ajoute une nouvelle fonctionnalité, le logiciel lance automatiquement un petit script de "Migration" pour ajuster la base sans effacer les données existantes.
`;

const doc = new PDFDocument();
const outputPath = path.join(__dirname, '../public/Strategy_Deployment.pdf');

// Ensure public directory exists
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

doc.pipe(fs.createWriteStream(outputPath));

doc.font('Helvetica-Bold').fontSize(20).text('Stratégie de Déploiement - Leuana School', { align: 'center' });
doc.moveDown();

// Simple markdown-like parser for the PDF
const lines = content.split('\n');
for (const line of lines) {
    if (line.startsWith('## ')) {
        doc.font('Helvetica-Bold').fontSize(16).text(line.replace('## ', ''), { underline: true });
        doc.moveDown(0.5);
    } else if (line.startsWith('### ')) {
        doc.font('Helvetica-Bold').fontSize(14).text(line.replace('### ', ''));
        doc.moveDown(0.5);
    } else if (line.startsWith('**Paramètres')) {
        doc.font('Helvetica-Bold').fontSize(12).text(line);
    } else if (line.startsWith('- ')) {
        doc.font('Helvetica').fontSize(12).text('• ' + line.replace('- ', ''), { indent: 20 });
    } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        doc.font('Helvetica').fontSize(12).text(line, { indent: 20 });
    } else if (line.trim().length > 0) {
        doc.font('Helvetica').fontSize(12).text(line);
        doc.moveDown(0.5);
    }
}

doc.end();
console.log('PDF generated at:', outputPath);
