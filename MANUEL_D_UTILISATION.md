# MANUEL D'UTILISATION OFFICIEL
## LOGICIEL DE GESTION SCOLAIRE : BOKELAND SCHOOL SYSTEM

---

## ℹ️ INTRODUCTION
Ce manuel d'utilisation a été conçu pour guider les administrateurs, secrétaires, intendants et enseignants dans l'utilisation quotidienne du logiciel **Bokeland School System**. Ce système permet de centraliser la gestion administrative, pédagogique et financière de votre établissement scolaire. 

Pour faciliter votre lecture, les conventions visuelles suivantes sont utilisées :
* `➕` **Bouton d'ajout** ou création d'une nouvelle entité.
* `✏️` **Bouton de modification** ou édition d'une information.
* `❌` **Bouton de suppression** ou d'annulation.
* `💾` **Bouton de validation** ou d'enregistrement.
* `🖨️` **Bouton d'impression** (bulletin, reçu, liste d'élèves).
* `📤` **Action d'exportation** (extraction de données vers Excel ou ZIP).
* `📥` **Action d'importation** (intégration de données depuis Excel ou ZIP).
* `💵` **Gestion financière** (pensions, salaires, charges).
* `📅` **Calendrier / Emploi du temps** (créneaux de cours, dates limites).
* `⚠️` **Avertissement de sécurité** ou contrainte technique majeure.

---

## CHAPITRE I : INSTALLATION ET PREMIERS PAS (WELCOME SCREEN)

L'écran d'accueil s'affiche automatiquement lors du premier démarrage du logiciel ou si aucune configuration d'établissement n'a été détectée. C'est l'assistant d'onboarding (mise en route) de l'application.

### 1. Choix de la langue de l'application
Au démarrage, l'assistant vous invite à définir la langue par défaut de l'interface utilisateur.
* **Langues disponibles** : Français et English.
* **Action** : Sélectionnez le bouton correspondant à la langue souhaitée, puis cliquez sur le bouton `Suivant`.

### 2. Saisie des informations de l'établissement
Cette étape permet d'initialiser les métadonnées de l'établissement qui figureront sur tous les documents officiels (reçus de paiement, bulletins de notes, listes d'élèves).
* **Champs requis** :
  * **Nom de l'établissement** (ex: *Collège Saint-Michel*)
  * **Adresse Email** (ex: *contact@ecole.com*)
  * **Numéro de Téléphone** (ex: *690000000*)
  * **Pays** (Sélectionnez dans la liste déroulante des pays africains pré-configurés, ex : Cameroun, Côte d'Ivoire, Gabon...)
  * **Localisation / Adresse** (ex: *Douala, Cameroun*)
* **Action** : Remplissez avec soin chaque champ du formulaire. Les champs obligatoires sont signalés par une astérisque. Cliquez sur `Suivant`.

### 3. Activation de la licence
Le logiciel s'active automatiquement avec une **période d'essai gratuite de 33 jours**.
* **Action** : L'écran récapitule vos informations pour validation finale. Cliquez sur le bouton `Activer maintenant` ou `Activer le logiciel`.
* `⚠️` **Attention** : Les informations saisies lors de cette phase d'onboarding sont enregistrées dans la base de données locale. Assurez-vous que l'adresse email de l'école est valide et fonctionnelle, car elle sert également d'identifiant pour les fonctionnalités de la communauté Bokeland.

---

## CHAPITRE II : L'INTERFACE D'AUTHENTIFICATION (CONNEXION)

La sécurité de vos données scolaires est essentielle. L'interface de connexion restreint l'accès aux personnes autorisées uniquement.

### 1. Accès sécurisé à l'écran de connexion
Chaque utilisateur doit disposer d'un compte avec un identifiant unique (nom d'utilisateur) et un mot de passe pour accéder à la plateforme.

### 2. Saisie des identifiants et mot de passe
* **Formulaire de connexion** :
  * **Nom d'utilisateur** : Entrez votre nom d'utilisateur (ex: `admin`).
  * **Mot de passe** : Entrez votre mot de passe associé (ex: `Admin@123` pour la configuration par défaut).
* **Validation** : Cliquez sur le bouton `Se connecter`.
* `⚠️` **Compte d'accès par défaut** : Lors de la première installation, connectez-vous avec le nom d'utilisateur `admin` et le mot de passe `Admin@123`. **Il est impératif de modifier ce mot de passe ou de créer des utilisateurs personnalisés dès votre première connexion (voir CHAPITRE XI).**

### 3. Gestion de la déconnexion et informations de version
* **Déconnexion** : Dans la barre supérieure de l'écran, cliquez sur le bouton rouge `Déconnexion` avec l'icône de sortie pour fermer votre session de travail en toute sécurité.
* **Version du logiciel** : L'écran de connexion indique la version active du logiciel (ex : *Version 1.0.0*) et les mentions légales de Bokeland Group Services.

### 4. Raccourci de débogage (Outils de développement)
* En cas de problème d'affichage (par exemple, page blanche), vous pouvez à tout moment ouvrir les outils de développement (Console Développeur) en appuyant sur la touche `F12` de votre clavier. Cela permettra aux équipes techniques de diagnostiquer et de résoudre d'éventuels problèmes de connexion ou d'affichage.

---

## CHAPITRE III : LE TABLEAU DE BORD (DASHBOARD)

Le tableau de bord est la page d'accueil après connexion. Il offre une vue à 360 degrés sur la situation administrative, académique et financière de l'école.

### 1. Présentation générale et navigation
Le tableau de bord est divisé en plusieurs zones interactives :
* **Le menu latéral de gauche** : Il permet de naviguer vers les différents modules (Élèves, Classes, Personnels, Matières, Examens, etc.) selon les autorisations de l'utilisateur connecté.
* **Le sélecteur d'année scolaire (en haut à gauche)** : Affiche et permet de basculer d'une année scolaire à une autre.
* **Le bouton de Déconnexion (en haut à droite)**.

### 2. Indicateurs statistiques de l'établissement
Quatre blocs de résumé affichent les totaux cumulés pour l'année scolaire en cours :
* **ÉLÈVES** : Le nombre total d'élèves actuellement inscrits.
* **CLASSES** : Le nombre total de classes créées.
* **ENSEIGNANTS** : Le nombre d'enseignants enregistrés dans le personnel.
* **PAIEMENTS** : Le montant total cumulé des versements de pension perçus.

### 3. Graphiques d'aperçu financier et Taux de réussite
* **Aperçu Financier (Année Scolaire)** : Un graphique affiche la courbe mensuelle des flux de trésorerie sur la période allant d'Août à Juillet de l'année scolaire en cours. Il compare en temps réel :
  * **Total Entrées (Pensions)** : Représenté en bleu/vert.
  * **Total Sorties (Charges & Salaires)** : Représenté en rouge.
* **Taux de Réussite** : Un graphique circulaire évalue les performances académiques. Un élève est considéré en réussite s'il obtient une moyenne générale supérieure ou égale à **10/20** pour l'évaluation sélectionnée.
  * **Filtres interactifs** : Sélectionnez une évaluation (ex: *Séquence 1*) et une classe spécifique pour mettre à jour instantanément le graphique du taux de réussite.

### 4. Module de transfert automatique des données entre années scolaires
Ce module permet de migrer facilement les données d'une année scolaire (Année Source) vers une nouvelle année (Année Cible), évitant d'avoir à tout ressaisir lors de la rentrée scolaire.
* **Types de transferts disponibles** :
  * **Transfert de classes** : Copie les classes configurées d'une année à l'autre.
  * **Transfert du personnel administratif** : Migre les comptes administratifs et les postes du personnel.
  * **Transfert d'enseignants** : Migre la base de données des enseignants.
  * **Transfert de matières** : Copie la liste des matières configurées.
  * **Transfert d'élèves** : Permet de faire passer les élèves admis (moyenne ≥ 10/20) ou échoués dans leurs nouvelles classes respectives dans l'année de destination.
  * **Transfert des configurations de bulletin** : Recopie les règles de décision de fin d'année et les grilles d'observations.
* **Procédure de transfert** :
  1. Cliquez sur le bouton correspondant au type de transfert souhaité.
  2. Sélectionnez l'**Année Source** (courante) et l'**Année Cible** (destination).
  3. Sélectionnez la classe source, cochez les éléments à transférer (ou sélectionnez "Tous").
  4. Pour le transfert d'élèves, sélectionnez le filtre de niveau académique : **Admis (Moyenne ≥ 10/20)** ou **Échoués (Moyenne < 10/20)**.
  5. Sélectionnez la classe de destination dans l'année cible.
  6. Cliquez sur `Valider le transfert` 💾.

### 5. Sélecteur d'année scolaire et gestion des exercices isolés
Le système gère les années scolaires de façon hermétique : chaque année scolaire possède sa propre base de données isolée.
* **Changer d'année** : Cliquez sur le sélecteur d'année scolaire dans le menu latéral. Sélectionnez l'année sur laquelle vous souhaitez travailler. L'interface se recharge automatiquement.
* **Ajouter une nouvelle année** `➕` : Cliquez sur l'icône de création de nouvelle année (représentée par une icône plus dans le sélecteur d'année). Entrez la date de début et de fin (ex: *Début : 2025-09-01, Fin : 2026-06-30*). Cliquez sur `Créer` 💾. Le système va initialiser un nouvel environnement de données vide pour cette période.

---

## CHAPITRE IV : GESTION DES CLASSES

Le module **Classes** permet de définir les structures d'accueil pédagogiques de votre établissement scolaire, de configurer le format d'immatriculation des élèves et de diviser la scolarité en tranches de versement.

### 1. Création, édition et suppression des classes
* **Créer une classe** `➕` :
  1. Cliquez sur le bouton `Nouvelle classe` situé en haut à droite.
  2. Renseignez les informations de base :
     * **Libellé** : Le nom de la classe (ex: *6ème M1*, *Terminale C*).
     * **Niveau** : Le niveau d'études (ex: *1*, *6*, *12*).
     * **Année Scolaire** : L'année courante (remplie automatiquement).
     * **Pension (XAF ou devise configurée)** : Le montant total annuel de la scolarité de cette classe.
  3. Cliquez sur `Ajouter` 💾.
* **Modifier une classe** `✏️` : Cliquez sur l'icône de crayon bleu à côté de la classe souhaitée, modifiez ses valeurs, puis cliquez sur `Enregistrer` 💾.
* **Dupliquer une classe** `📋` : Cliquez sur l'icône de copie violette (double page) pour copier instantanément la configuration de la classe (niveaux, pension, tranches de paiement, format de matricule et matières associées), à l'exception des élèves. La nouvelle classe sera automatiquement renommée en ajoutant un numéro entre parenthèses (ex : *6ème M1 (1)*) pour éviter les doublons.
* **Supprimer une classe** `❌` : Cliquez sur l'icône de corbeille rouge. Un message de confirmation s'affiche. Confirmez pour supprimer. 
* `⚠️` **Attention** : Supprimer une classe supprime également tous les élèves qui y sont affectés ainsi que leurs notes et leurs paiements associés.

### 2. Configuration dynamique du format de matricule des élèves
Pour chaque classe, vous pouvez définir comment le matricule des élèves sera généré automatiquement lors de l'inscription.
* **Segments du matricule** : Le matricule peut être composé de 1 à 3 segments.
* **Paramétrage de chaque segment** :
  * **Type** : `Lettre` ou `Chiffre`.
  * **Mode** : 
    * `AUTO` : Le système gère dynamiquement l'incrémentation (ex: *XX* générera le sigle de la classe ou de l'école ; *000* s'incrémentera de *001* à *999*).
    * `FIXE` : Vous imposez une valeur fixe (ex: *2025* pour l'année, ou *LEU* pour l'abréviation de l'établissement).
* **Aperçu** : Un champ dynamique affiche en temps réel la structure de prévisualisation du matricule (ex: `LEU2025000`).

### 3. Planification des tranches de paiement (Échéanciers de pension)
Le système vous permet de découper la pension totale de la classe en plusieurs échéances obligatoires (Tranches).
* **Ajouter une tranche** : Dans le formulaire de classe (droite), cliquez sur le bouton `+` rouge à côté du titre "Tranches de paiement".
* **Champs de la tranche** :
  * **Nom** : Nom de l'échéance (ex: *Tranche 1*, *Frais d'inscription*, *Tranche 2*).
  * **Montant (en XAF ou devise locale)** : Le montant dû pour cette tranche.
  * **Date limite** : La date butoir à laquelle cette tranche doit être soldée.
* `⚠️` **Règle de validation critique** : **La somme totale de toutes les tranches configurées doit être STRICTEMENT égale au montant de la pension annuelle défini pour la classe.** Le système affiche un indicateur en temps réel (ex: `150 000 / 150 000 XAF`). Si la somme ne correspond pas, un message d'erreur rouge s'affichera et empêchera la validation de la classe.

---

## CHAPITRE V : GESTION DU PERSONNEL ET DES ENSEIGNANTS

Le module **Personnel** permet de lister et de gérer tous les collaborateurs qui travaillent au sein de votre établissement scolaire. Il est scindé en deux sous-onglets.

### 1. Enregistrement et suivi des enseignants (Sous-onglet 1)
Ce sous-onglet regroupe les enseignants responsables des différentes matières.
* **Ajouter un enseignant** `➕` :
  1. Cliquez sur le bouton `Nouvel enseignant`.
  2. Renseignez les informations de la fiche :
     * **Nom** & **Prénom**
     * **Téléphone** (obligatoire)
     * **Adresse Email** (doit être unique si l'enseignant doit se connecter)
     * **Salaire (mensuel de base)** : Montant de sa rémunération fixe pour le suivi des charges.
  3. Cliquez sur `Ajouter` 💾.
* **Modification** `✏️` & **Suppression** `❌` : Fonctionnent via les icônes d'action en fin de ligne de tableau.

### 2. Enregistrement et suivi du personnel administratif (Sous-onglet 2)
Ce sous-onglet regroupe le personnel de bureau, d'entretien, de surveillance ou de direction (Comptables, Secrétaires, Censeurs, Veilleurs).
* **Ajouter un membre administratif** `➕` :
  1. Cliquez sur le bouton `Ajouter un poste`.
  2. Renseignez les informations :
     * **Titre / Poste** : (ex: *Comptable*, *Secrétaire*, *Sécurité*).
     * **Nom** & **Prénom**
     * **Téléphone**
     * **Email**
     * **Salaire** : Montant de son salaire mensuel de base.
  3. Cliquez sur `Enregistrer` 💾.

---

## CHAPITRE VI : GESTION DES MATIÈRES

Le module **Matières** centralise les disciplines enseignées au sein de l'établissement scolaire. Chaque matière doit être paramétrée pour permettre la saisie des notes et le calcul des moyennes.

### 1. Ajout et modification des matières
* **Ajouter une matière** `➕` :
  1. Cliquez sur `Nouvelle matière` en haut à droite.
  2. Saisissez les données dans le formulaire :
     * **Nom** : Le libellé de la matière (ex: *Mathématiques*, *Langue Française*, *Physique*).
     * **Coefficient** : Poids de la matière dans le calcul des moyennes (ex: *4*, *2*).
     * **Note maximale** : La note de barème maximum (ex: *20*, *100*). Le système utilise par défaut *20*.
     * **Catégorie** : Classement de la matière (ex : *Sciences*, *Lettres*).
     * **Enseignant** : Sélectionnez l'enseignant titulaire dans la liste déroulante (préalablement inscrit dans le personnel).
     * **Classe** : Sélectionnez la classe où cette matière est enseignée.
  3. Cliquez sur `Ajouter` 💾.

### 2. Attribution des matières aux classes et aux enseignants
Chaque ligne du tableau de matières affiche clairement :
* Le nom de la matière.
* La classe associée.
* Le coefficient de pondération.
* La note maximale possible.
* L'enseignant responsable.
* La catégorie.
Cette association est indispensable car elle détermine :
* Les matières qui s'affichent sur le bulletin d'une classe.
* Les matières accessibles à un enseignant spécifique sur son portail de saisie de notes (voir CHAPITRE XIV).

### 3. Création et gestion des catégories de matières
Pour organiser les bulletins de notes de manière professionnelle (ex: regrouper les matières scientifiques ensemble, les matières littéraires ensemble) :
1. Cliquez sur le bouton `Gérer les catégories` situé en haut.
2. Saisissez le nom de la catégorie (ex: *Matières Scientifiques*, *Langues & Littérature*).
3. Cliquez sur `Créer une catégorie` ➕.
4. Pour assigner une catégorie à une matière, modifiez simplement la matière `✏️` et sélectionnez sa catégorie dans la liste déroulante.

---

## CHAPITRE VII : GESTION DES ÉLÈVES

Le module **Élèves** est le cœur administratif de l'application. Il permet de gérer les dossiers individuels des apprenants, de suivre leur scolarité et de générer les listes officielles.

### 1. Inscription individuelle des élèves et formulaire d'information
Pour inscrire manuellement un élève :
1. Cliquez sur le bouton `Nouvel élève` `➕` en haut à droite.
2. Remplissez le formulaire d'inscription structuré :
   * **Photo de profil** : Cliquez sur le cercle de la photo par défaut pour téléverser une photo d'identité au format JPG/PNG depuis votre ordinateur.
   * **Nom** & **Prénom** (obligatoires).
   * **Date de naissance** (sélectionnez via le calendrier).
   * **Sexe** (`M` ou `F`).
   * **Catégorie** (`Non redoublant(e)` ou `Redoublant(e)`).
   * **Adresse physique** (ex: *Douala, Bonapriso*).
   * **Nom du Parent** (le tuteur légal).
   * **Téléphone du Parent** (très important pour les communications).
   * **Classe** : Sélectionnez la classe d'affectation de l'élève.
3. Cliquez sur `Ajouter` 💾. Le système va alors générer automatiquement le **Matricule unique** de l'élève en se basant sur le format configuré pour sa classe.

### 2. Recherche, filtres avancés et consultation
Pour retrouver rapidement un dossier d'élève :
* **Recherche textuelle** : Entrez les premières lettres du nom, du prénom ou du matricule dans la zone de recherche.
* **Filtre par classe** : Sélectionnez une classe spécifique dans la liste déroulante pour n'afficher que les élèves de cette classe.
* **Aperçu photo** : Cliquez sur la miniature de la photo d'un élève dans le tableau pour afficher sa photo d'identité en grand format.

### 3. Impression de la liste des élèves
Vous pouvez imprimer un document PDF officiel contenant la liste des élèves filtrés.
1. Appliquez les filtres souhaités (ex: sélectionner la classe *6ème M1*).
2. Cliquez sur le bouton `Imprimer` 🖨️.
3. Une fenêtre d'aperçu s'affiche montrant le document finalisé avec le logo de votre école, l'en-tête de l'établissement, le nombre total d'élèves, et un tableau récapitulatif (Matricule, Noms, Prénoms, Sexe, Catégorie, Pension versée/totale, Contact du parent).
4. Cliquez sur `Imprimer la sélection` pour envoyer le document à l'imprimante ou l'enregistrer sous format PDF.

### 4. Génération et impression des Cartes d'Identité Scolaires
Le logiciel permet de générer des cartes d'identité scolaires officielles prêtes à l'impression pour chaque élève inscrit.
* **Procédure d'impression des cartes** :
  1. Dans le module **Élèves**, sélectionnez la classe ou cochez les élèves concernés.
  2. Cliquez sur le bouton `Carte d'identité` 🖨️.
  3. L'application génère un document contenant les cartes au format standard (avec logo de l'école, photo de l'élève, matricule, classe, filigrane et informations du tuteur).
* **Gestion du cachet et de la signature du Directeur sur les cartes** :
  * Si la signature et le cachet du directeur ont été importés dans la page **Paramètres**, ils sont automatiquement superposés avec transparence en bas à droite de chaque carte d'identité.
  * **Comportement en l'absence de fichier** : Si la signature et le cachet n'ont pas encore été importés depuis la page Paramètres, cet emplacement **reste totalement vide** (aucun dessin ou symbole fictif par défaut n'est affiché).

### 5. Importation et exportation de masse
* **Exporter les élèves** `📤` : Cliquez sur le bouton `Exporter les élèves`. Le système télécharge instantanément un fichier Microsoft Excel (`eleves.xlsx`) contenant l'intégralité des fiches élèves de l'année ou de la classe filtrée.
* **Importer les élèves** `📥` : 
  1. Cliquez sur `Importer les élèves`.
  2. Sélectionnez le fichier Excel contenant vos listes d'élèves.
  3. Le système importe les lignes et affiche un bilan : (ex: *Importation terminée : 25 élèves ajoutés, 2 ignorés (doublons)*).
  * `⚠️` **Note** : Le système empêche automatiquement la création d'élèves en double en vérifiant les matricules et les combinaisons Nom/Prénom/Date de naissance.

---

## CHAPITRE VIII : PLANIFICATIONS ET AGENDAS (EMPLOI DU TEMPS ET AGENDA ANNUEL)

Le module **Planning** permet de gérer l'organisation temporelle de l'établissement. Il est divisé en deux onglets distincts qui s'adaptent automatiquement au format horaire (12h/24h) défini dans les paramètres généraux.

### 1. Agenda par Classe (Emploi du temps hebdomadaire)
Cet onglet permet de planifier les cours hebdomadaires de chaque classe sous forme de grille interactive.
* **Ajouter un cours à l'emploi du temps** `➕` :
  1. Cliquez sur le bouton `Ajouter un planning` en haut à droite.
  2. Saisissez les données requises :
     * **Classe** : Sélectionnez la classe concernée.
     * **Matière** : Sélectionnez la matière à planifier (seules les matières de la classe sélectionnée s'affichent).
     * **Jour de la semaine** : Choisissez du Lundi au Dimanche.
     * **Heure de début** & **Heure de fin** : Saisissez les heures à l'aide du sélecteur d'heure dynamique (TimePicker). *Note : le format de saisie (AM/PM ou 24h) correspond à votre configuration dans les paramètres.*
  3. Cliquez sur `Valider` 💾.
* **Modifier ou Supprimer un cours** : Cliquez directement sur la carte du cours affichée dans la grille de l'emploi du temps pour modifier ses horaires ou le supprimer `❌`.
* **Visualisation et Impression** `🖨️` : Sélectionnez une classe pour charger sa grille hebdomadaire colorée. Cliquez sur le bouton `Imprimer` en haut à droite pour générer une version paysage optimisée pour l'impression ou la sauvegarde PDF.
  * **Note esthétique, impression et multilinguisme** : Les couleurs de fond des cours à l'écran sont douces et contrastées pour un confort visuel optimal. Lors de l'impression, l'emploi du temps est optimisé avec le logo de l'établissement en filigrane d'arrière-plan. **Toutes les mentions de l'en-tête de l'emploi du temps s'adaptent instantanément à la langue de l'application** : en mode Anglais, les intitulés affichent automatiquement **TIMETABLE**, **School Year**, et **Class** (et en Français : **EMPLOI DU TEMPS**, **Année Scolaire**, **Classe**).

### 2. Agenda Annuel (Calendrier des événements de l'établissement)
Cet onglet propose un calendrier global pour enregistrer les réunions, examens, congés et autres événements marquants de l'année scolaire.
* **Navigation et Affichage** : Vous disposez de plusieurs modes de visualisation en haut à droite : `Mois`, `Semaine`, `Jour`, et `Liste`. L'affichage du calendrier et des mois (ex: *Août 2026* / *August 2026*) se synchronise automatiquement et dynamiquement avec la langue sélectionnée dans l'application.
* **Ajouter un événement** `➕` : Double-cliquez sur une date ou un créneau horaire dans le calendrier, renseignez le titre de l'événement, les heures de début/fin, et cliquez sur `Enregistrer` 💾.
* **Impression de la liste des événements** `🖨️` : 
  1. Basculez en mode d'affichage **Liste**. Les événements y sont présentés de manière chronologique, regroupés par mois.
  2. Cliquez sur le bouton `Imprimer` de la barre d'outils.
  3. Une fenêtre d'aperçu de type pop-up s'affiche (reprenant le design élégant des bulletins avec le logo et les informations de l'établissement).
  4. Vous pouvez fermer l'aperçu avec le bouton `Fermer` ou valider l'impression physique/PDF avec le bouton `Imprimer`.

---

## CHAPITRE IX : EXAMENS, NOTES ET BULLETINS DE NOTES

Ce module regroupe l'ensemble de la gestion pédagogique et des résultats des élèves. Il est structuré en plusieurs sous-onglets.

### 1. Planification des évaluations périodiques (Sous-onglet 1 : Évaluations)
Avant de saisir des notes, vous devez définir les périodes d'évaluation de l'année (ex: *Séquence 1*, *Trimestre 1*, *Contrôle Continu 1*).
* **Créer une évaluation** `➕` :
  1. Cliquez sur `Ajouter une évaluation`.
  2. Entrez :
     * **Nom de l'évaluation** (ex: *Séquence 1*).
     * **Date de début** et **Date de fin** de la période de composition.
  3. Cliquez sur `Ajouter` 💾.

### 2. Saisie des notes et calcul des moyennes coefficientées (Sous-onglet 2 : Notes)
* **Saisie manuelle des notes** :
  1. Sélectionnez l'**Évaluation**, la **Classe** et la **Matière**.
  2. Le tableau des élèves de la classe s'affiche.
  3. Entrez la note brute sur 20 (ou la note maximale définie pour la matière) pour chaque élève.
  4. Le système affiche automatiquement la **Note Finale** calculée (Note × Coefficient) et l'**Observation** automatique associée à cette note.
  5. Cliquez sur le bouton `Enregistrer` 💾 en bas du tableau pour valider les notes.

### 3. Configuration des logiques de décision de fin d'année (Sous-onglet 3 : Configurations)
Cette fonctionnalité permet d'automatiser les décisions du conseil de classe de fin d'année (Admis, Redouble, Exclu) en se basant sur des critères de notes et d'absences.
* **Ajouter une règle de décision** `➕` :
  1. Dans le tableau de configuration des règles, sélectionnez la **Catégorie** d'élèves (`Non redoublant(e)` ou `Redoublant(e)`) dans la première colonne intitulée **Catégorie**.
  2. Saisissez l'intervalle de **Moyenne de note** (ex: de *0* à *9.99* pour redoublement, ou de *10* à *20* pour admission).
  3. Saisissez la limite d'**Absence non justifiée** en heures (ex: si l'élève dépasse *50 heures* d'absences non justifiées, il est exclu).
  4. Associez le **Statut** correspondant : `Admis(e) en classe supérieure`, `Redouble la classe`, ou `Exclu(e)`.
  5. Cliquez sur `Valider` 💾.

### 4. Définition des observations automatiques (Sous-onglet 4 : Observations)
Configurez les appréciations qui s'affichent automatiquement en regard des notes de l'élève (ex: *Médiocre*, *Assez Bien*, *Excellent*).
* **Ajouter une tranche d'appréciation** :
  1. Saisissez la **Valeur minimale** et la **Valeur maximale** de la note (ex : de *12* à *13.99*).
  2. Saisissez l'**Observation** correspondante (ex : *Assez bien*).
  3. Cliquez sur `Valider` 💾.

### 5. Impression des bulletins de notes (Sous-onglet 5 : Impression)
Vous pouvez générer et imprimer les bulletins périodiques (trimestriels/séquentiels) ou annuels.
* **Impression périodique** :
  1. Sélectionnez l'**Évaluation** et la **Classe**.
  2. La liste des élèves s'affiche. Cochez les élèves dont vous souhaitez imprimer le bulletin (ou cliquez sur "Tout sélectionner").
  3. Cliquez sur `Imprimer la sélection` 🖨️. Le système génère le bulletin officiel avec le relevé de notes détaillé, les coefficients, le total des points, la moyenne générale de l'élève, son rang dans la classe, le bilan des absences et la décision finale.
* **Impression annuelle** : Sélectionnez le sous-onglet **Note Annuelle** pour générer les bulletins de synthèse de fin d'année intégrant les moyennes cumulées de toutes les évaluations et la décision du conseil de classe.

---

## CHAPITRE X : GESTION DES PENSIONS (PAIEMENTS)

Le module **Pensions** permet de suivre la santé financière de votre école en enregistrant les paiements de scolarité des élèves.

### 1. Enregistrement des versements et attribution automatique
Le système intègre une logique intelligente de répartition des paiements selon les tranches de scolarité configurées dans la classe.
1. Dans le sous-onglet **ENREGISTREMENT (individuel)**, sélectionnez la **Classe** et l'**Élève**.
2. Cliquez sur `Valider` 💾 pour charger le dossier financier de l'élève.
3. Le système affiche un résumé comptable en temps réel :
   * **Pension Totale** due pour sa classe.
   * **Déjà Payé** : Somme de ses versements passés.
   * **Reste à Payer** : Solde restant dû.
4. Pour enregistrer un versement :
   * Saisissez le **Montant** versé (ex: *50 000 XAF*).
   * Sélectionnez la **Date** du paiement.
   * Le système affiche instantanément un **Aperçu de la répartition** (ex: *Tranche 1 (SOLDÉE) + Tranche 2 (Partiel)*). Le système comble automatiquement les tranches dans l'ordre chronologique de leurs dates limites.
5. Cliquez sur le bouton `Valider` 💾 pour enregistrer définitivement le versement.

### 2. Gestion des Réductions / Remises de pension
Pour les élèves bénéficiant de bourses ou de remises spéciales, le système permet d'appliquer une réduction en pourcentage sur leur scolarité annuelle.
* **Appliquer une réduction** :
  1. Une fois l'élève validé dans le sous-onglet **ENREGISTREMENT**, cliquez sur le bouton `Modifier` à côté de l'étiquette **Réduction / Remise** dans le bloc récapitulatif.
  2. Saisissez le motif de la réduction (ex: *Bourse d'excellence*, *Enfant du personnel*) et le pourcentage de réduction (entre 0 et 100%).
  3. Cliquez sur `Enregistrer` 💾. La pension nette et le reste à payer de l'élève sont automatiquement recalculés.
* `⚠️` **Comportement des tranches avec réduction** : Lorsqu'une réduction est appliquée, le montant de la remise est **déduit en priorité sur la dernière tranche configurée** (et remonte sur les précédentes si le montant de la réduction excède la dernière tranche). Cela permet de préserver l'intégralité des tranches initiales (comme les frais d'inscription ou la première tranche).

### 3. Impression des reçus de pension
Une fois le versement enregistré ou lors de la consultation du dossier d'un élève :
1. Cliquez sur le bouton `Imprimer le reçu` 🖨️.
2. Le système génère un reçu officiel au format **A5 Paysage**, idéal pour une impression rapide sur papier standard.
3. Le reçu affiche le logo et les contacts de l'établissement, le numéro de reçu unique, les détails de l'élève (y compris la pension brute, le pourcentage de réduction, la pension nette), le montant versé, le solde restant à payer, un tableau récapitulatif de tous ses versements et les blocs de signature ("Le Directeur", "Le Comptable").

### 3. Consultation du journal des versements et filtres
Le sous-onglet **JOURNAL (des paiements)** permet de suivre l'historique complet de toutes les transactions de l'école.
* **Filtres de recherche** :
  * **Période** : Sélectionnez une Date de début et une Date de fin pour n'afficher que les paiements reçus durant cet intervalle.
  * **Classe** : Filtrez les versements pour une classe en particulier.
  * **Recherche rapide** : Tapez le nom d'un élève pour retrouver son historique.
* Le système calcule et affiche dynamiquement en bas de page le **Total versé filtré** (ex: *Total versé filtré : 1 250 000 XAF*).

### 4. Exportation Excel du journal
* Cliquez sur le bouton `Exporter en Excel` 📤 pour télécharger le journal des paiements affiché. Cela génère un fichier compatible avec tous les tableurs comptables.

---

## CHAPITRE XI : GESTION DES ABSENCES (PRÉSENCES)

Ce module permet de saisir et de suivre l'assiduité des élèves au cours de l'année scolaire. Les heures d'absences injustifiées ont un impact direct sur la décision de fin d'année (exclusion).

### 1. Enregistrement des absences
Pour signaler une absence :
1. Cliquez sur le bouton `Ajouter une absence` `➕`.
2. Saisissez les informations du formulaire :
   * **Date** de l'absence.
   * **Classe** de l'élève.
   * **Élève** concerné.
   * **Motif** : Sélectionnez `Absence justifiée` ou `Absence non justifiée`.
   * **Heure** : L'heure à laquelle l'absence a débuté.
   * **Durée (en Minutes)** : Entrez la durée de l'absence (ex: *120 minutes* pour 2 heures de cours manquées).
   * **Contexte** : Description du motif (ex : *Certificat médical fourni*, *Non présenté en classe de Physique*).
3. Cliquez sur `Enregistrer` 💾.

### 2. Suivi et bilans d'heures d'absences
Dans le tableau des absences, vous pouvez filtrer la liste des enregistrements par classe ou par élève pour consulter le décompte global.
* Le système additionne automatiquement les minutes d'absence et les convertit en heures pour le bulletin trimestriel et annuel.
* Les absences justifiées sont comptabilisées séparément des absences non justifiées.

### 3. Impression des rapports d'absences
* Cliquez sur le bouton `Imprimer` 🖨️ dans le module absences.
* Le système génère un rapport officiel listant les élèves absents de la classe sélectionnée, avec le détail des heures justifiées et non justifiées.

### 4. Génération et impression de la Fiche d'Appel Journalière (Daily Roll Call Sheet)
En plus du suivi individuel, le système permet de générer des fiches de présence quotidiennes à faire remplir manuellement par les enseignants en classe.
* **Générer une fiche d'appel** :
  1. Dans le module **Présences**, cliquez sur le bouton `Fiche d'appel` (ou `Roll Call` selon la langue active) situé en haut.
  2. Sélectionnez la **Classe** et le **Jour** de la semaine souhaités dans les sélecteurs.
  3. Cliquez sur le bouton de génération pour afficher l'aperçu avant impression.
* **Caractéristiques du document imprimé** :
  * **Mise en page optimisée** : La fiche est au format paysage, ce qui offre un espace de lecture optimal. Elle comporte un en-tête complet avec le nom de l'établissement, l'année scolaire en cours, la classe et le jour.
  * **Grille des cours** : Elle présente la liste alphabétique des élèves de la classe à gauche, et les matières/créneaux horaires sur les colonnes de droite.
  * **Optimisation de l'espace** : Pour garantir que la fiche tienne sur une seule page A4 et reste lisible, l'en-tête de chaque matière est orienté verticalement, et les espaces superflus (notamment l'écart entre le nom des enseignants, les heures et les matières) ont été minimisés. De plus, la colonne de numérotation a été retirée pour rapprocher les noms des élèves des heures de cours.
  * **Filigrane officiel** : Le logo de votre établissement s'affiche automatiquement en filigrane (arrière-plan transparent) au centre du document pour authentifier la fiche.
  * **Multilinguisme (i18n)** : Toutes les expressions et labels du document s'adaptent instantanément en Français ou en Anglais selon la langue choisie dans l'application.

---

## CHAPITRE XII : CHARGES ET PAIEMENT DES SALAIRES

Le module **Charges** gère la comptabilité des sorties de fonds de l'établissement (dépenses). Il est divisé en deux sous-onglets distincts.

### 1. Enregistrement des charges diverses de l'établissement (Sous-onglet 1 : Charges Diverses)
Ce volet permet d'enregistrer les frais courants de fonctionnement de l'établissement.
* **Enregistrer une charge** `➕` :
  1. Cliquez sur le bouton `Nouvelle charge`.
  2. Renseignez :
     * **Date** de la dépense.
     * **Titre** de la charge (ex: *Facture électricité*, *Achat rames de papier*).
     * **Montant** de la dépense.
     * **Description** (ex: *Achat de 5 rames pour le secrétariat*).
  3. Cliquez sur `Enregistrer` 💾.
* Les charges s'affichent sous forme de tableau et peuvent être modifiées `✏️` ou supprimées `❌`.

### 2. Paiement et suivi mensuel des salaires du personnel (Sous-onglet 2 : Salaires)
Ce volet permet d'enregistrer le paiement des rémunérations de vos collaborateurs.
* **Enregistrer un paiement de salaire** `➕` :
  1. Cliquez sur `Nouveau salaire`.
  2. Renseignez le formulaire :
     * **Date de paiement**.
     * **Type de personnel** : Sélectionnez `Enseignant` ou `Administration`.
     * **Personne** : Sélectionnez l'employé dans la liste (les noms s'affichent selon le type de personnel sélectionné). Le système charge automatiquement son salaire de base configuré.
     * **Description** (ex: *Salaire du mois de Mai 2026*).
     * **Montant** (pré-rempli avec possibilité de modification s'il y a des primes ou retenues).
  3. Cliquez sur `Enregistrer` 💾.
* Le système affiche l'historique complet des salaires versés et met à jour instantanément la courbe des dépenses sur le tableau de bord.

---

## CHAPITRE XIII : CONFIGURATIONS GÉNÉRALES ET DONNÉES

Le module **Paramètres** permet d'ajuster le comportement global du logiciel et de gérer les données de l'application.

### 1. Paramètres d'identité de l'école et En-têtes personnalisés
Dans cette section, vous pouvez personnaliser l'application aux couleurs de votre établissement.
* **Informations Générales** :
  * **Nom de l'établissement** : S'affiche sur tous les documents officiels.
  * **Logo de l'établissement** : Cliquez sur le logo pour téléverser une image de format carré (taille recommandée : 111 × 111 px). Ce logo apparaîtra sur les bulletins, reçus, cartes d'accès et listes d'élèves.
  * **Site Internet** / **Adresse physique** / **Téléphone** / **Email** : Coordonnées figurant dans les en-têtes et les reçus.
  * **Format de date** (ex: *DD/MM/YYYY* pour 25/12/2025).
  * **Format horaire** (ex: *24h* ou *12h*) : Configure globalement l'affichage des heures (grilles de planning, listes d'absences, formulaires de saisie).
  * **Devise principale** : Devise monétaire utilisée pour les frais scolaires, les reçus et les bilans financiers (ex: *XAF*, *EUR*, *USD*).
  * **Ministère de tutelle** : Saisissez le ministère officiel (ex : *Ministère des Enseignements Secondaires*) pour l'en-tête officiel des bulletins et certificats.
  * **Nom du Directeur** : Saisissez le nom du directeur pour l'insérer automatiquement au-dessus de sa zone de signature.
  * Cliquez sur `Enregistrer` 💾 après modification.

* **En-tête personnalisé des documents (A4)** :
  Si vous préférez utiliser un en-tête graphique (contenant vos propres logos, polices et mentions) plutôt que l'en-tête textuel par défaut du système :
  1. Activez l'option **Utiliser un entête personnalisé (image)** via l'interrupteur (Switch).
  2. Cliquez sur la zone d'importation en pointillé.
  3. Sélectionnez votre fichier image. **L'image d'entête doit être de dimensions 2480 × 591 px**.
  4. Une fois importée, cette image couvrira automatiquement toute la largeur supérieure de vos bulletins de notes (A4) et de vos certificats de scolarité.
  5. Vous pouvez supprimer l'image de l'en-tête à tout moment en cliquant sur l'icône de corbeille rouge `❌` apparaissant sur l'image pour revenir à l'en-tête textuel standard.

* **Pied de page personnalisé des documents (A4)** :
  De même, vous pouvez activer un pied de page graphique pour vos bulletins et certificats :
  1. Activez l'option **Utiliser un pied de page personnalisé (image)**.
  2. Cliquez sur la zone d'importation et choisissez une image de **2480 × 300 px**.
  3. Pour supprimer l'image et désactiver cette option, cliquez sur l'icône de corbeille rouge `❌`.

* **Signatures et Cachets des documents** :
  Vous pouvez importer les images de signatures et de cachets pour la Direction (Directeur) et la Comptabilité (Comptable). Ces images seront automatiquement insérées sur les bulletins, reçus de paiement et certificats de scolarité.
  * **Importation** : Cliquez sur la zone d'importation correspondante pour charger le fichier image.
  * **Suppression** `❌` : Cliquez sur l'icône de corbeille rouge (trash icon) située sur l'image importée pour supprimer définitivement le fichier physique du serveur. Une boîte de dialogue de confirmation personnalisée s'affichera pour valider l'action, réinitialisant ainsi le champ correspondant dans la base de données après confirmation.

* **Personnalisation pédagogique (Terme "Catégorie")** :
  * **Modifier le terme** : Vous pouvez modifier l'appellation générique "Catégorie" de matière (par exemple pour utiliser "Domaine" ou "Module") en tapant la nouvelle valeur dans le champ dédié.
  * **Affichage de la colonne** : Choisissez si la colonne de catégorie doit être affichée ou masquée sur le bulletin de notes via le sélecteur d'affichage.

### 2. Sauvegarde et restauration des données (Gestion des Données)
Pour sécuriser vos données contre toute panne informatique, il est fortement conseillé de faire des sauvegardes régulières.
* **Exporter les données (Sauvegarde)** `📤` :
  * **Format ZIP (Recommandé et Intégral)** : Exporte et importe l'intégralité du système dans une archive compressée autonome. La sauvegarde et la restauration ZIP prennent en considération :
    * **Toutes les informations et fichiers de la page « Paramètres »** : Nom de l'école, coordonnées, devise, langue, en-têtes et pieds de page graphiques personnalisés, logo, drapeau, signatures et cachets électroniques (Directeur et Comptable).
    * **Les dossiers des Élèves et leurs photos** : Fiches des élèves, photos de profil individuelles et éléments requis pour l'impression des cartes d'identité scolaires.
    * **Les Pensions et Tranches par classe** : Montants de pension annuelle et tranches de versement configurées pour chaque classe.
    * **Le journal des Paiements enregistrés** : L'historique complet des reçus, paiements de pension, tranches réglées et modes de règlement.
    * **Les informations du Planning (Agendas)** : L'agenda hebdomadaire des cours par classe (emplois du temps) et l'agenda annuel des événements.
    * **Toutes les photos de profil des Utilisateurs** : Photos de profil des administrateurs, secrétaires, intendants, enseignants et personnels.
    * `⚠️` *Note sur la restauration* : Lors de l'importation d'un fichier ZIP, l'état de la licence active de la machine hôte est automatiquement préservé.
  * **Format EXCEL** : Exporte les tables sous forme de feuilles Excel.
  * **Sauvegarde Cloud automatisée (Google Drive)** :
    Pour sécuriser au maximum vos données, le logiciel intègre une fonctionnalité de sauvegarde automatique sur Google Drive.
    * **Connexion au compte Google** :
      1. Dans l'onglet **Sauvegarde Google Drive** des paramètres, cliquez sur `Se connecter avec Google`.
      2. Une fenêtre s'ouvre pour vous permettre de vous authentifier et d'autoriser Bokeland School System à accéder à votre espace de stockage Drive (un dossier nommé `BokelandSchoolSystem_Backups` sera créé automatiquement).
    * **Configuration de la fréquence automatique** :
      Vous pouvez programmer le système pour qu'il effectue des sauvegardes automatiques en arrière-plan :
      * **Activé / Désactivé** : Activez l'option à l'aide de l'interrupteur.
      * **Fréquence** : Choisissez entre `Quotidienne` (sauvegarde chaque jour), `Hebdomadaire` (sélectionnez le jour de la semaine) ou `Mensuelle` (sélectionnez le jour du mois).
      * **Heure de sauvegarde** : Configurez l'heure à laquelle le backup automatique doit se déclencher. Le format horaire (12h/24h) s'adapte à votre configuration générale.
    * **Sauvegarde manuelle** :
      À tout moment, vous pouvez lancer une sauvegarde instantanée en cliquant sur le bouton `Lancer une sauvegarde`. Une barre de progression s'affiche pour suivre l'état de la copie.
    * **Liste des sauvegardes et restauration cloud** :
      Le système affiche l'historique de toutes les sauvegardes stockées sur votre Google Drive avec leur date de création et leur taille. Vous pouvez restaurer la base de données à l'état d'une sauvegarde en cliquant sur le bouton `Restaurer` en regard du fichier concerné.
      * `⚠️` **Attention** : La restauration d'une sauvegarde cloud remplace l'intégralité des données courantes de l'application. Assurez-vous d'avoir fait une sauvegarde locale avant toute opération.
* **Importer des données (Restauration)** `📥` : 
  1. Cliquez sur `Importer des données`.
  2. Sélectionnez le fichier de sauvegarde (ZIP ou Excel).
  3. Une boîte de dialogue s'affiche pour résoudre les conflits si des données existent déjà :
     * *Ignorer les doublons* : N'importe pas les enregistrements ayant le même identifiant.
     * *Mettre à jour les existants* : Écrase les anciennes données par celles du fichier d'import.
     * *Créer des doublons* : Crée un nouvel enregistrement pour chaque ligne du fichier d'import.

### 3. Zone de danger
Cette option sensible est réservée aux administrateurs réseau.
* **Supprimer les données** `❌` : Cette option permet de vider l'intégralité de la base de données pour l'année scolaire en cours (efface élèves, classes, notes, paiements).
* `⚠️` **Attention** : Cette action est définitive et irréversible. Une double confirmation est requise par le système pour valider l'effacement.

---

## CHAPITRE XIV : PORTAIL DÉDIÉ AUX ENSEIGNANTS

Le logiciel dispose d'un espace de travail simplifié et sécurisé réservé exclusivement aux enseignants pour la saisie des notes de leurs élèves.

### 1. Accès sécurisé au portail enseignant
Lorsqu'un utilisateur se connecte avec le rôle **Enseignant**, le système le redirige automatiquement vers une interface épurée, sans accès aux données financières, comptables, ou administratives de l'école.
* Il ne voit que les classes et les matières qui lui ont été explicitement affectées par l'administrateur.

### 2. Saisie directe des notes par matière/classe
1. Sélectionnez la **Classe** dans le menu latéral.
2. Les matières attribuées à l'enseignant dans cette classe s'affichent sous forme d'onglets horizontaux en haut de l'écran. Cliquez sur la matière souhaitée.
3. Sélectionnez la séquence ou l'**Évaluation** dans le menu déroulant.
4. Cliquez sur le bouton orange `Valider` 💾 pour charger la grille de saisie des notes.
5. Saisissez les notes de chaque élève directement dans la colonne *Note*.
6. La note finale coefficientée et l'appréciation correspondante s'affichent instantanément en mode aperçu.
7. Cliquez sur le bouton orange `Enregistrer` 💾 situé sous le tableau pour soumettre les notes à la direction.

### 3. Importation et exportation des notes via des gabarits Excel
Pour les enseignants qui préfèrent travailler hors ligne sur Excel :
* **Exporter le gabarit** `📤` : Après avoir sélectionné la classe et l'évaluation, cliquez sur le bouton vert `Export`. Le logiciel télécharge un fichier Excel pré-configuré contenant la liste des élèves (Noms, Prénoms) et une colonne de note vide.
* **Saisie sur Excel** : L'enseignant remplit les notes sur son ordinateur à l'aide de Microsoft Excel ou de tout autre tableur.
* **Importer les notes** `📥` : 
  1. Connectez-vous sur le portail enseignant, sélectionnez la classe, la matière et l'évaluation.
  2. Cliquez sur le bouton bleu `Import`.
  3. Sélectionnez le fichier Excel rempli.
  4. Le logiciel charge instantanément les notes dans le tableau. L'enseignant peut vérifier les notes importées à l'écran, puis cliquer sur `Enregistrer` 💾 pour valider.

---

## CHAPITRE XV : ASSISTANCE, COMMUNAUTÉ ET LICENCE

Ce chapitre regroupe les fonctionnalités de support, d'animation réseau et de gestion commerciale du logiciel.

### 1. Communauté Bokeland (Messagerie instantanée)
Le logiciel intègre un espace de réseau social professionnel nommé **Communauté**.
* **Objectif** : Permet aux différents établissements utilisant le logiciel Bokeland School System d'échanger des messages, de partager des bonnes pratiques et de collaborer.
* **Fonctionnement** : Cet onglet affiche un fil de discussion instantané partagé. Les messages s'affichent en temps réel avec le logo et le nom de l'école émettrice. Un badge de notification rouge s'affiche sur l'onglet `Communauté` du menu latéral pour vous signaler les messages non lus.

### 2. Suggestions d'améliorations et vidéos tutoriels
* **Boîte à suggestions** : Un formulaire en bas du tableau de bord vous permet d'envoyer directement vos idées d'amélioration ou vos rapports d'anomalies aux équipes techniques de Bokeland Group Services. Entrez votre nom, email, votre message et cliquez sur `Envoyer` 💾.
* **Tutoriels Vidéos** : Un lien d'accès rapide est disponible sur le tableau de bord pour ouvrir une bibliothèque de vidéos de formation sur la manipulation du logiciel étape par étape.

### 3. Prolongation d'abonnement et paiement Mobile Money
Le bandeau supérieur ou inférieur de l'application indique en temps réel la validité de votre licence (ex: *MODE ESSAI : 12 jours restants*).
* **Renouveler / Prolonger sa licence** :
  1. Cliquez sur le lien `Renouveler ici` ou `Prolongez dès maintenant` affiché dans le bandeau de licence.
  2. Une fenêtre d'offre s'affiche (ex : *Prolongez pour 365 jours à 100 000 XAF*).
  3. Sélectionnez votre Devise et votre **Pays de destination** (l'API gère officiellement 19 pays d'Afrique : *Cameroun, Gabon, Congo-Brazzaville, RDC, RCA, Tchad, Guinée Équatoriale, Côte d'Ivoire, Sénégal, Mali, Burkina Faso, Bénin, Togo, Niger, Guinée-Conakry, Burundi, Comores, Djibouti, etc.*).
  4. Sélectionnez l'opérateur Mobile Money (MTN, Orange Money, Wave, Airtel, Moov, Lumicash, etc.) et saisissez votre numéro de téléphone.
  5. Cliquez sur le bouton `Payer Maintenant`. Dans l'application de bureau Electron, une fenêtre sécurisée TouchPay / Swychr s'ouvre automatiquement au premier plan. Un bouton `Rouvrir la page de paiement` vous permet de refaire apparaître la fenêtre à tout moment si vous la réduisez.
  6. Validez la transaction sur votre téléphone mobile en saisissant votre code secret PIN.
  7. Dès confirmation du paiement, la licence du logiciel est validée et prolongée instantanément.

---

## CHAPITRE XVI : UTILISATION EN RÉSEAU LOCAL (MULTI-POSTES)

Le logiciel **Bokeland School System** est conçu pour fonctionner en réseau local (intranet) au sein de votre établissement scolaire. Cela permet à plusieurs utilisateurs (secrétaires, intendants, enseignants, directeurs) d'accéder simultanément au système à partir de différents ordinateurs connectés au même réseau (Wi-Fi ou câble Ethernet).

### 1. Architecture du réseau local
* **Le poste Serveur** : C'est l'ordinateur principal sur lequel le logiciel a été installé (avec la base de données locale). C'est cet ordinateur qui héberge les données et fait tourner l'application.
* **Les postes Clients** : Ce sont les autres ordinateurs de l'école (bureau du directeur, salle des profs, secrétariat). Ils n'ont pas besoin d'installer le logiciel ; ils s'y connectent via leur navigateur web (Google Chrome, Microsoft Edge, etc.).

### 2. Récupérer l'adresse IP du serveur
Pour que les postes clients puissent se connecter, ils doivent connaître l'adresse IP du poste Serveur sur le réseau local.
1. Sur le poste **Serveur**, ouvrez le menu Démarrer de Windows, tapez `cmd` et ouvrez l'**Invite de commandes**.
2. Tapez la commande suivante et appuyez sur Entrée :
   ```cmd
   ipconfig
   ```
3. Repérez la ligne **Adresse IPv4** sous votre carte réseau active (ex: `192.168.1.50` ou `10.0.0.15`). Notez cette adresse IP.

### 3. Connexion depuis un autre ordinateur (Client)
1. Assurez-vous que l'ordinateur client est connecté au **même réseau Wi-Fi ou réseau filaire** que le serveur.
2. Ouvrez un navigateur internet (Chrome ou Edge de préférence).
3. Dans la barre d'adresse (tout en haut), saisissez l'adresse IP du serveur suivie de `:5006` (le port de communication de l'application), puis appuyez sur Entrée.
   * **Exemple d'adresse** : `http://192.168.1.50:5006`
4. L'interface de connexion de Bokeland School System s'affiche. Connectez-vous avec vos identifiants habituels.

### 4. Recommandations et Sécurité en Réseau Local
* `⚠️` **IP Statique** : Il est fortement recommandé de configurer le poste serveur avec une adresse IP locale fixe (statique) dans les paramètres Windows ou sur votre routeur. Si l'adresse IP locale change (ce qui arrive parfois au redémarrage de la box internet), les postes clients devront saisir la nouvelle adresse IP pour se connecter.
* `⚠️` **Pare-feu Windows** : Lors de la première utilisation réseau, Windows Defender ou votre antivirus peut afficher un message vous demandant d'autoriser l'application à communiquer sur les réseaux privés. Veillez à cocher la case pour autoriser l'accès, sinon le pare-feu bloquera les connexions entrantes des autres ordinateurs.
* **Veille du serveur** : Le poste Serveur doit rester allumé et actif pour que les autres ordinateurs puissent accéder au logiciel. S'il se met en veille ou s'éteint, l'accès sera coupé.

