# Guide de démarrage rapide - Bokeland School System

## 🎉 Félicitations !

Votre application Bokeland School System fonctionne maintenant ! Voici ce qui est opérationnel :

## ✅ Ce qui fonctionne actuellement

### Backend (API)
- ✅ Serveur Node.js sur http://localhost:5000
- ✅ 40+ endpoints API REST
- ✅ Base de données MySQL connectée
- ✅ Authentification JWT
- ✅ Toutes les routes CRUD pour :
  - Élèves
  - Classes
  - Enseignants
  - Matières
  - Notes
  - Paiements
  - Présences
  - Utilisateurs

### Frontend
- ✅ Application React sur http://localhost:5174
- ✅ Page de connexion fonctionnelle
- ✅ Dashboard simple
- ✅ Authentification locale (sans appel API pour l'instant)

## 🔑 Connexion

**URL** : http://localhost:5174/login

**Identifiants** :
- Username : `admin`
- Password : `admin123`

## 📝 Prochaines étapes pour compléter l'application

### Option 1 : Version simple (actuelle)

L'application fonctionne avec une authentification locale simple. Vous pouvez :
- Vous connecter
- Voir le dashboard
- Vous déconnecter

### Option 2 : Version complète avec API

Pour connecter le frontend au backend et avoir toutes les fonctionnalités CRUD, il faut :

1. **Réintégrer Redux** pour la gestion d'état
2. **Connecter les pages au backend** via Axios
3. **Ajouter les pages manquantes** (déjà créées dans le code mais non utilisées) :
   - `Students.tsx` - Gestion des élèves
   - `Classes.tsx` - Gestion des classes
   - Teachers, Subjects, Grades, Payments, Attendance

## 🛠️ Comment tester le backend directement

Vous pouvez tester les API avec un outil comme **Postman** ou **Thunder Client** :

### 1. Créer un utilisateur admin (déjà fait)
```bash
cd backend
npm run create-admin
```

### 2. Se connecter via l'API
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Vous recevrez un token JWT.

### 3. Tester les autres endpoints

**Récupérer tous les élèves** :
```http
GET http://localhost:5000/api/students
Authorization: Bearer VOTRE_TOKEN_JWT
```

**Créer un élève** :
```http
POST http://localhost:5000/api/students
Authorization: Bearer VOTRE_TOKEN_JWT
Content-Type: application/json

{
  "nom": "Koné",
  "prenom": "Abou",
  "date_naissance": "2012-05-15",
  "sexe": "M",
  "adresse": "Abidjan, Cocody",
  "parent_tel": "0701111111",
  "classe_id": 1
}
```

Le matricule sera généré automatiquement (ex: LEU-2025-0001).

## 📂 Structure des fichiers

```
leuana-school/
├── backend/              ← API Node.js (FONCTIONNE ✅)
│   ├── src/
│   │   ├── controllers/  ← Logique métier
│   │   ├── routes/       ← Routes API
│   │   ├── models/       ← Modèles Sequelize
│   │   └── server.ts     ← Point d'entrée
│   └── .env              ← Configuration DB
│
├── frontend/             ← Application React (VERSION SIMPLE ✅)
│   ├── src/
│   │   ├── App.tsx       ← Version simplifiée sans Redux
│   │   ├── pages/        ← Login, Dashboard (+ autres pages disponibles)
│   │   └── main.tsx      ← Point d'entrée
│   └── index.html
│
└── database/
    ├── schema.sql        ← Structure de la base
    └── seed.sql          ← Données de test
```

## 🚀 Commandes utiles

### Démarrer l'application

**Terminal 1 - Backend** :
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend** :
```bash
cd frontend
npm run dev
```

### Arrêter les serveurs
Appuyez sur `Ctrl+C` dans chaque terminal.

### Recréer l'admin
```bash
cd backend
npm run create-admin
```

## 🔧 Dépannage

### Le frontend affiche une page blanche
1. Vérifiez que le backend tourne (http://localhost:5000)
2. Vérifiez que Vite tourne (http://localhost:5174)
3. Ouvrez la console du navigateur (F12) pour voir les erreurs
4. Rechargez la page (F5)

### Erreur de connexion à la base de données
1. Vérifiez que WAMP est démarré (icône verte)
2. Vérifiez le fichier `backend/.env` :
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=leuana_school_db
   ```
3. Vérifiez que la base `leuana_school_db` existe dans phpMyAdmin

### Le port 5173 ou 5174 est déjà utilisé
Vite choisira automatiquement un autre port. Regardez dans le terminal pour voir le port utilisé.

## 📖 Documentation complète

Consultez le fichier `README.md` à la racine du projet pour :
- Instructions d'installation détaillées
- Documentation API complète
- Guide de déploiement en production

## 💡 Besoin d'aide ?

Consultez les fichiers suivants :
- `README.md` - Documentation complète
- `walkthrough.md` - Détails de la migration
- `database/schema.sql` - Structure de la base de données

---

**Bon développement avec Leuana School ! 🎓**
