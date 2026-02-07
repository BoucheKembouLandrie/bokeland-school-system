<?php 
if ( isset($_POST['matricule']) and isset($_POST['password']))
{
	$matricule=$_POST['matricule']; $pass=$_POST['password'];
	//on sélectionne les information de la table statu_personnel
	$q=mysqli_query($mysqli, "SELECT * FROM eleve WHERE matricule_eleve='$matricule'  AND pass_eleve='$pass'");
	$n=mysqli_num_rows($q);
	$t=mysqli_fetch_array($q);
	 if($n!==0) // si le resultat est différent de zero  0 cela veut dire que le membre existe et qu'on peut le connecter
 	 {	//on creer le session du membre
	 $_SESSION['id_membre_ele']=$t['id_eleve'];
	 $_SESSION['date_co_membre_ele']=time();
 		  //redirection vers la page prevu.?>
		  <script language="javascript"> alert <?php echo $t['id_eleve']; ?></script>
		  <?php echo '<script language="javascript"> document.location.href="../eleves"; </script>';
     }
	 else
	     { echo $message='<script language="javascript"> alert("login ou mot de passe invalide.")</script>';
		  exit();}

}
 ?>
