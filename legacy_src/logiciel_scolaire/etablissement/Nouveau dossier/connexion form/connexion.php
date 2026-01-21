<?php $form_path='connexion form/connexion_files/formoid1/form.php'; require_once $form_path; ?><!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<title></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body class="blurBg-false" style="background-color:#EBEBEB">

{{Formoid}}

</body>
</html>

<?php 
if ( isset($_POST['matricule']) and isset($_POST['password']))
{
	$premiers_caracters=extraire_caracteres(majuscule($_POST['matricule']),3);
	$a1=$_POST['matricule'];
	switch ($premiers_caracters) {
	case 'SCO'://connexion des membre de la scolarite
		include"php/connexion scolarite.php";
		break; //fin connexion des membre de la scolarite
		
	case 'PRE'://connexion des membre de la direction des études
		include"php/connexion prefecture.php";
		break; //fin connexion des membre de la direction des études
		
	case 'SUR'://connexion des membre de la surveillance générale
		include"php/connexion surveillant.php";
		break;//fin connexion des membre de la surveillance générale
		
	case 'ENS'://connexion des membre enseignants
		include"php/connexion enseignant.php";
		break; //fin connexion des membre enseignants
		
	case 'ELE'://connexion des membre élève
		include"php/connexion eleve.php";
		break;//fin connexion des membre élève
		
	default://si l'un de ces cas n'est pas valide, on renvoi l'utilisateur qui essaye de se connecter.
	echo '<script language="javascript"> alert("Ce login n\'est pas valide. ") </script>';
	echo '<script language="javascript"> history.go(-1); </script>';
		break;}//fin de la redirection des membre n'ayant pas accès
}
 ?>
