<?php session_start(); 

/******************************************************
----------------Configuration Obligatoire--------------
Veuillez modifier les variables ci-dessous pour que l'
espace membre puisse fonctionner correctement.
******************************************************/
// On défini utf-8 comme l'encodage par défaut
mb_internal_encoding('UTF-8');
   
//On se connecte a la base de donnee
//mysql_connect('hote', 'nomdutilisateur', 'motdepasse'); mysql_connect('localhost', 'root', '');
//mysql_connect('localhost', 'root', '');
//mysql_select_db('basededonne');mysql_select_db('afiliation');
//mysql_select_db('gest_ecole');
$mysqli= mysqli_connect( 'localhost', 'root', '', 'marc_school_secondary');
//Email du webmaster
$email_admin= 'docarn@yahoo.com';

//Adresse du dossier de la top site
$url_root = 'http://www.example.com/';

//login de l'administrateur
$login_Sadmin='Sadmin';

// mot passe administrateur
$pass_Sadmin='a';

//------------------------choix du disque--------------
$disque="C";

//temps de deconnexion apre l'inactivite du membre.
$temps_fixe=1800; // 1800 secondes ou encore 30 minutes
/******************************************************
----------------Configuration Optionelle---------------
******************************************************/
$Marc_School="Marc-School";
//Nom du fichier de l'accueil
$url_home = 'index.php';

$version_application = "1.1";

//Nom du design
$design = 'Docarn';
$tel_admin="(+237) 699 95 76 55 / 670 13 16 49 ";
$logo_etablissement='http://127.0.0.1/Marc-School/ced%20et/admin/admin/logo_etablissement/';

//////////////////////nom des pages par section***************///////////////////////////////////

$scolarite="GESTION DE LA SCOLARITE"; // nom de toutes les pages scolarité
$prefecture="GESTION DES ETUDES"; // nom de toutes les pages prefecture des etudes
$eleves="ESPACE ELEVES"; // nom de toutes les pages profil d'elelve
$surveillance="SURVEILLANCE GENERALE"; // nom de toutes les pages surveillance
$enseignants="ESPACE ENSEIGNANTS"; // nom de toutes les pages enseignant
$page_admin="PROFIL ADMINISTRATEUR"; // nom de toutes les pages admnistrateur
$page_super_admin="SUPER ADMINISTRATEUR"; // nom de toutes les pages super admnistrateur
/////////////////////////////////////////////fin de nomination de page///////////////////////////////////////////////////////////

?> 