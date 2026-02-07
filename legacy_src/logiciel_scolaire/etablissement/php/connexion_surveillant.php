<?php 
if ( isset($_POST['matricule']) and isset($_POST['password']))
{
	$matricule=$_POST['matricule']; $pass=$_POST['password'];
	//on sélectionne les information de la table statu_personnel
	$q=mysqli_query($mysqli, "select *from statut_personnel where matricule_statut_personnel='$matricule' and pass_statut_personnel='$pass' ");
	$n=mysqli_num_rows($q);
	$t=mysqli_fetch_array($q);
	 if($n!==0) // si le resultat est différent de zero  0 cela veut dire que le membre existe et qu'on peut le connecter
 	 {	
	 //on vérifie si le membre est activer ou non par l'administratueur
	 if($t['acces']==1)
	 {//on creer le session du membre
	 $_SESSION['id_membre_sur']=$t['id_statut_personnel'];
	 $_SESSION['date_co_membre_sur']=time();
 		  //redirection vers la page prevu.
		  echo '<script language="javascript"> document.location.href="../surveillance"; </script>';
     }
	 else
	     { echo $message='<script language="javascript"> alert("Votre compte est inactif.");</script>';
		  exit();}}
	 else
	 {echo $message='<script language="javascript"> alert("login ou mot de passe invalide.");</script>';}

}
 ?>
