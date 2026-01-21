
 <?php  
	  $s10=mysqli_query($mysqli, "SELECT nom_classe, nom_unique_classe,id_classe FROM classe group by nom_unique_classe");
	  $s20=mysqli_query($mysqli, "SELECT *FROM annee_scolaire");
	  $s30=mysqli_query($mysqli, "SELECT *FROM scolarite");
	  ?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" /> 
	<title></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style> 
    #loader{
		display:none;
		}
    </style>
    <script src="fun.js"></script>
</head>
<body class="blurBg-true" style="background-color:#d3d9eb">



<!-- Start Formoid form-->
<link rel="stylesheet" href="inscriptioneleve_files/formoid1/formoid-solid-blue.css" type="text/css" />
<script type="text/javascript" src="inscriptioneleve_files/formoid1/jquery.min.js"></script>

	<div id="loader"><img src="images/loading-bar.gif" height="20"/></div>

<form class="formoid-solid-blue" style="background-color:#ebecff;font-size:16px;font-family:'Roboto',Arial,Helvetica,sans-serif;color:#34495E;max-width:900px;min-width:150px" method="post" enctype="multipart/form-data">

<div id="resultat">

</div>

</form><p class="frmd"></p>
<script type="text/javascript" src="inscriptioneleve_files/formoid1/formoid-solid-blue.js"></script>

<!-- Stop Formoid form-->

</body>
</html>
<script type="text/javascript">
    //<!--
	  /* cacher_div('div_date_naissance');
	   cacher_div('div_lieu_naissance');
	   cacher_div('div_sexe');
	   cacher_div('div_photo');
	   cacher_div('div_classe');
	   cacher_div('div_contact');
	  // cacher_div('div_enregistrer');
	   cacher_div('div_enregistrer');*/
    //-->
    </script>

<?php 
if(isset($_POST['id_eleve']) and !empty($_POST['id_eleve'])  )
{	
	 $ide=$_POST['id_eleve'];
	 $nombre_tranche=$_POST['nombre_tranche'];
	 $classe_ele=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve where id_eleve=$ide"));
	 $t_montant=array();
	 $t_montant_verse=array();
	 
	  for($i=1; $i<=$nombre_tranche; $i++){ //cette boucle permet de recupérer les valeur entrée dans les input
		$t_montant[$i]=$_POST['montant'.$i.''];
		$t_montant_verse[$i]=$_POST['montant_verse'.$i.''];
 		}
		 $verification=0;
		for($i=1; $i<=$nombre_tranche; $i++)
			{ //on cree les enregistrement des tranches de paiement
				$new_val=$t_montant[$i]+$t_montant_verse[$i];
 	  			if(mysqli_query($mysqli, "update paiement_tranche set montant_paye='".$new_val."' where id_eleve=$ide and numero_tranche_paiement=$i"))
    				 {$verification=1;  }
  				else { $verification=0; }
			}

		if ($verification==1) {echo'<script language="javascript"> alert("enregistrement réussi!!! ");
		window.open("../fpdf/fpdf_recu_tranche.php?id_classe_liste_etat_generer='.$classe_ele['id_classe'].'&id_eleve='.$ide.'");
		 </script>';  
 			 }
		else{ echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; }

  
}

/*
if(isset($_POST['nom']) and isset($_POST['prenom']) and isset($_POST['classe']) and isset($_POST['date_naissance']) and isset($_POST['lieu_naissance']) and isset($_POST['sexe']) and isset($_POST['contact']) and isset($_POST['redouble']) and isset($_POST['montant_inscription']) and isset($_POST['annee_scolaire']) and !empty($_POST['nom']) and !empty($_POST['prenom']) and !empty($_POST['classe']) and !empty($_POST['date_naissance']) and !empty($_POST['lieu_naissance']) and !empty($_POST['sexe']) and !empty($_POST['contact']) and !empty($_POST['redouble']) and !empty($_POST['montant_inscription']) and !empty($_POST['annee_scolaire']))
{     $nom=$_POST['nom'];
	  $prenom=$_POST['prenom'];
	  $date_naissance=$_POST['date_naissance'];
	  $lieu_naissance=$_POST['lieu_naissance'];
	  $sexe=$_POST['sexe'];
	  $contact=$_POST['contact'];
	  $redouble=$_POST['redouble'];
	  $montant_inscription=$_POST['montant_inscription'];
	  $annee_scolaire=$_POST['annee_scolaire'];
	  $temps=time();
	  $matricule=" ";
	  $pass=code_aleatoire(8);//on genere un mot de passe aléatoire
	  $id_classe=$_POST['classe'];
	  
	  //on cherche dans quel classe on vas enregistrer cet eleve.
	  $r2=mysql_fetch_array(mysql_query("select nom_unique_classe from classe where id_classe=$id_classe"));
	  $no=$r2['nom_unique_classe'];
	  $r=mysql_num_rows(mysql_query("select *from classe where nom_unique_classe='$no'")); 
	  $v=nombre_aleatoire(1, $r);
	  $r2=mysql_fetch_array(mysql_query("select id_classe from classe where nom_unique_classe='$no' and numero_classe=$v"));
	   $id_vrai_classe=$r2['id_classe'];
	  
	  
	   
	  //-------------------enregistrement du logo de l'entreprise
				   include "php/upload photo eleves.php";
				   $logo=$nomImage;
				   //-------------------fin de l'enregistrement
				   if ($verification==1){
 	  if(mysql_query('insert into eleve(matricule_eleve, pass_eleve, nom_eleve, prenom_eleve, sexe_eleve, date_naiss_eleve,lieu_naiss_eleve, contact_parent_eleve, id_classe, photo_eleve,redouble_eleve, date_enre_eleve) values("'.$matricule.'","'.$pass.'","'.$nom.'","'.$prenom.'","'.$sexe.'","'.$date_naissance.'","'.$lieu_naissance.'","'.$contact.'","'.$id_vrai_classe.'","'.$logo.'","'.$redouble.'","'.$temps.'")'))
    {
		//si l'enregistrement a reussi on cree son matricule.
	  $q=mysql_fetch_array(mysql_query("select nom_etablissement from etablissement"));
	  $tid=mysql_fetch_array(mysql_query("select id_eleve from eleve where pass_eleve='$pass'"));
	  $matricule="ELE";
	  $matricule.=majuscule(extraire_caracteres($q['nom_etablissement'],3));
	  $matricule.=substr(date('Y', time()),2);
	  $matricule.=$tid['id_eleve'];//fin de la fabrication du matricule
	  //on update son matricule dans sa table
	  if (mysql_query("update eleve set matricule_eleve='".$matricule."' where pass_eleve='$pass' "))
	  	{
			echo'<script language="javascript"> alert("enregistrement réussi!!! ")</script>'; 
			//creation du recu d'inscription envoi des donnees de connexion par url
			echo'<script language="javascript"> 
			
			document.location.href="../fpdf/fpdf recu inscription.php?nom='.$nom.'&prenom='.$prenom.'&date_naiss='.$date_naissance.'&lieu_naissance='.$lieu_naissance.'&matricule='.$matricule.'&pass='.$pass.'&id_classe='.$id_vrai_classe.'&montant_inscription='.$montant_inscription.'&annee_scolaire='.$annee_scolaire.'&id_personnel='.$_SESSION['id_membre_sco'].'&date_enre_eleve='.$temps.'";
			</script>'; 

			//fin de la creation du fichier recu de l'eleve 
           exit();		
		} else { echo $message='<script language="javascript"> alert("Erreur interne!!!")</script>'; exit();}
		}
  else { echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; exit();}
   }				
				else
				{echo $message = '<script language="javascript"> alert("Une erreur interne a empêché le chargement de votre photo... Vérifier votre fichier et choisissez une autre image.")</script> !'; exit();}

   

}
 else if( (isset($_POST['nom']) or isset($_POST['prenom']) or isset($_POST['classe']) or isset($_POST['date_naissance']) or isset($_POST['lieu_naissance']) or isset($_POST['sexe']) or isset($_POST['contact']) or isset($_POST['redouble']) or isset($_POST['montant_inscription']) or isset($_POST['annee_scolaire']) )and ( empty($_POST['nom']) or empty($_POST['prenom']) or empty($_POST['classe']) or empty($_POST['date_naissance']) or empty($_POST['lieu_naissance']) or empty($_POST['sexe']) or empty($_POST['contact']) or empty($_POST['redouble']) or empty($_POST['montant_inscription']) or empty($_POST['annee_scolaire'])) )
{echo $message = '<script language="javascript"> alert("Tous les champs doivent être remplis.");</script> ';}
*/
?>