
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
    #div_enregistrer{
		}
    </style>
    <script src="fun.js"></script>
</head>
<body class="blurBg-true" style="background-color:#d3d9eb">



<!-- Start Formoid form-->
<link rel="stylesheet" href="inscriptioneleve_files/formoid1/formoid-solid-blue.css" type="text/css" />
<script type="text/javascript" src="inscriptioneleve_files/formoid1/jquery.min.js"></script>

<form class="formoid-solid-blue" style="background-color:#ebecff;font-size:16px;font-family:'Roboto',Arial,Helvetica,sans-serif;color:#34495E;max-width:900px;min-width:150px" method="post" enctype="multipart/form-data">

<div ><h2 style="color:#000;">Inscription d'élèves</h2></div>
	
    <div class="element-select" id="div_classe" k>
    <div class="item-cont"><div class="large"><span><select name="annee_scolaire" id="classe" required="required">
    <option value="" selected="selected">-------- Sélectionnez l'année scolaire--------</option>
		<?php  while($t10=mysqli_fetch_array($s20)){ ?> 
    <option value="<?php echo $t10['nom_annee_scolaire'];   ?>">
		<?php echo $t10['nom_annee_scolaire']; ?>
        
<?php }?>       
        </select>
        <div class="element-select" id="div_classe" k>
    <div class="item-cont"><div class="large"><span><select name="montant_inscription"  id="classe" required="required">
    <option value="" selected="selected">-------- Sélectionnez le montant d'inscription--------</option>
		<?php  while($t10=mysqli_fetch_array($s30)){ ?> 
    <option value="<?php echo $t10['libelle']; ?>">
		<?php  echo $t10['libelle']; ?> FCFA
        
<?php }?>       
        </select>

	<div class="element-name"><label class="title">
    <span class="required">Noms/prénoms</span></label>
   
    <span class="nameLast" id="div_nom" >
    <input placeholder="Saisir le nom ici" type="text" size="8" name="nom" value="<?php if(isset($_POST['nom'])) {echo $_POST['nom'];}?>" value="<?php  echo @$_POST['nom']; ?>" id="nom" required/><span class="icon-place"></span></span>
    
    <span class="nameFirst" id="div_prenom">
    <input placeholder="Saisir le prénom ici" type="text" size="14" name="prenom" value="<?php if(isset($_POST['prenom'])) {echo $_POST['prenom'];}?>" id="prenom" value="<?php  echo @$_POST['prenom']; ?>" required/><span class="icon-place">
    </span></span></div>
    
	<div class="element-date" id="div_date_naissance">
    <label class="title"><span >Date de naissance</span></label>
    <div class="item-cont"><input class="large" type="date" id="date_naissance" name="date_naissance" value="<?php if(isset($_POST['date_naissance'])) {echo $_POST['date_naissance'];}?>" min="2017-06-20" required value="<?php  echo @$_POST['date_naissance']; ?>" placeholder="Exemple: 2017-05-31 "/><span class="icon-place"></span></div></div>
    
 
	<div class="element-select" id="div_lieu_naissance"><label class="title"><span class="required">Lieu naissance</span></label><div class="item-cont"><div class="large"><span><select name="lieu_naissance" required="required" >
    <option value="" selected="selected">-------- Sélectionnez une ville --------</option>
		<?php  include "php/select_ville_du_cameroun.html"; ?>
        </select><i></i><span class="icon-place"></span></span></div></div></div>
     
     <div class="element-radio" id="div_sexe" >
    <div class="column column1"><label><input type="radio" name="sexe" value="Homme" required onChange="afficher_div('div_photo');" /><span>Homme <input type="radio" name="sexe" value="Femme" required onChange="afficher_div('div_photo');"/><span>Femme</span></label>
    </div><span class="clearfix"></span>
</div>
	
    <div  id="div_photo">
    <label class="title"><span class="required">Photo de l'élève</span></label>
    <div class="item-cont"><input  onChange="afficher_div('div_classe');" class="large" type="file" name="logo" required/><span class="icon-place"></span></div></div>
        
	<div class="element-select" id="div_classe" k><label class="title"><span class="required">Classe</span></label><div class="item-cont"><div class="large"><span><select name="classe" value="<?php if(isset($_POST['classe'])) {echo $_POST['classe'];}?>"  id="classe" required="required">
    <option value="" selected="selected">-------- Sélectionnez une salle de classe --------</option>
		<?php  while($t10=mysqli_fetch_array($s10)){ ?> 
    <option value="<?php echo $t10['id_classe']; ?>">
		<?php  echo $t10['nom_unique_classe']; ?>
        
<?php }?>       
        </select>
        <div class="element-radio" id="div_redouble" ><label class="title"><span class="required">Redouble la classe?</span></label>
    <div class="column column1"><label><input type="radio" name="redouble" value="oui" required  /><span> Oui <input type="radio" name="redouble" value="non" required /><span> Non </span></label>
    </div><span class="clearfix"></span>
</div>
        <i></i><span class="icon-place"></span></span></div></div></div>
  <div id="t"></div>
	<div class="element-phone" id="div_contact">
    <label class="title">Contact du parent</label>
    <div class="item-cont"><input class="large" required type="text" value="<?php  echo @$_POST['nom']; ?>"  maxlength="24" name="contact" value="<?php if(isset($_POST['contact'])) {echo $_POST['contact'];}?>" placeholder="Exemple: 698843185 " /><span class="icon-place"></span></div></div>
     

<div class="submit" id="div_enregistrer"  ><input type="submit" id="div_enregistrer" value="Enrégistrer"/></div></form><p class="frmd"></p><script type="text/javascript" src="inscriptioneleve_files/formoid1/formoid-solid-blue.js"></script>
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
	  $r2=mysqli_fetch_array(mysqli_query($mysqli, "select nom_unique_classe from classe where id_classe=$id_classe"));
	  $no=$r2['nom_unique_classe'];
	  $r=mysqli_num_rows(mysqli_query($mysqli, "select *from classe where nom_unique_classe='$no'")); 
	  $v=nombre_aleatoire(1, $r);
	  $r2=mysqli_fetch_array(mysqli_query($mysqli, "select id_classe from classe where nom_unique_classe='$no' and numero_classe=$v"));
	   $id_vrai_classe=$r2['id_classe'];
	  
	  
	   
	  //-------------------enregistrement du logo de l'entreprise
				   include "php/upload_photo_eleves.php";
				   $logo=$nomImage;
				   //-------------------fin de l'enregistrement
				   if ($verification==1){
 	  if(mysqli_query($mysqli, 'insert into eleve(matricule_eleve, pass_eleve, nom_eleve, prenom_eleve, sexe_eleve, date_naiss_eleve,lieu_naiss_eleve, contact_parent_eleve, id_classe, photo_eleve,redouble_eleve, date_enre_eleve) values("'.$matricule.'","'.$pass.'","'.$nom.'","'.$prenom.'","'.$sexe.'","'.$date_naissance.'","'.$lieu_naissance.'","'.$contact.'","'.$id_vrai_classe.'","'.$logo.'","'.$redouble.'","'.$temps.'")'))
    {
		//si l'enregistrement a reussi on cree son matricule.
	  $q=mysqli_fetch_array(mysqli_query($mysqli, "select nom_etablissement from etablissement"));
	  $tid=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve where pass_eleve='$pass'"));
	  $matricule="ELE";
	  $matricule.=majuscule(extraire_caracteres($q['nom_etablissement'],3));
	  $matricule.=substr(date('Y', time()),2);
	  $matricule.=$tid['id_eleve'];//fin de la fabrication du matricule
	  //on update son matricule dans sa table
	  if (mysqli_query($mysqli, "update eleve set matricule_eleve='".$matricule."' where pass_eleve='$pass' "))
	  	{
			 $id_ele=$tid['id_eleve'];
			 //on recupere l'id de la classe de l'eleve
			 $id_classe=$tid['id_classe'];
			 //on cherche l'id de la scolarite qui correspond a cette salle de classe
			 $t_sco=mysqli_fetch_array(mysqli_query($mysqli, "select id_scolarite from classe where id_classe=$id_classe"));
			 $id_sco=$t_sco['id_scolarite'];
			 //selection des tranche dont l'id de la scolarite est l'id selectionne
			 $select_tranche= mysqli_query($mysqli, "select  *from tranche where id_scolarite=$id_sco order by numero_tranche asc");
			 
			 //boucle while qui nous permettra de créer autant d'enregistrement qu'il ya de tranche pour l'eleve
			 $i=0; $verif=0;
			 while ($t=mysqli_fetch_array($select_tranche))
			 {$i++;$montant_tranche=$t['montant_tranche'];
			 	 if (mysqli_query($mysqli,'insert into paiement_tranche(numero_tranche_paiement, id_scolarite, id_eleve, montant_tranche) values("'.$i.'","'.$id_sco.'","'.$id_ele.'","'.$montant_tranche.'")'))
			{$verif=1;	}//fin de if (mysql_query("insert into paiement_tranche ...
			 else {$verif=0;}
			 
			 }//fin de la boucle while
			 if ($verif==1)
			 {//tous s'est tres bien passe
				 echo'<script language="javascript"> alert("enregistrement réussi!!! ")</script>'; 
			//creation du recu d'inscription envoi des donnees de connexion par url
			echo'<script language="javascript"> 
			window.open("../fpdf/fpdf_recu_inscription.php?nom='.$nom.'&prenom='.$prenom.'&date_naiss='.$date_naissance.'&lieu_naissance='.$lieu_naissance.'&matricule='.$matricule.'&pass='.$pass.'&id_classe='.$id_vrai_classe.'&montant_inscription='.$montant_inscription.'&annee_scolaire='.$annee_scolaire.'&id_personnel='.$_SESSION['id_membre_sco'].'&date_enre_eleve='.$temps.'");
			</script>'; 

			//fin de la creation du fichier recu de l'eleve 
         
				 }//fin if ($verif)
//else
			//{echo $message='<script language="javascript"> alert("Erreur interne lors de la creation des tranche.!!!")</script>'; }
					
		//} else { echo $message='<script language="javascript"> alert("Erreur interne!!!")</script>'; }
		}
  else { echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; }
   }				
				else
				{echo $message = '<script language="javascript"> alert("Une erreur interne a empêché le chargement de votre photo... Vérifier votre fichier et choisissez une autre image.")</script> !'; }

   

}
 else if( (isset($_POST['nom']) or isset($_POST['prenom']) or isset($_POST['classe']) or isset($_POST['date_naissance']) or isset($_POST['lieu_naissance']) or isset($_POST['sexe']) or isset($_POST['contact']) or isset($_POST['redouble']) or isset($_POST['montant_inscription']) or isset($_POST['annee_scolaire']) )and ( empty($_POST['nom']) or empty($_POST['prenom']) or empty($_POST['classe']) or empty($_POST['date_naissance']) or empty($_POST['lieu_naissance']) or empty($_POST['sexe']) or empty($_POST['contact']) or empty($_POST['redouble']) or empty($_POST['montant_inscription']) or empty($_POST['annee_scolaire'])) )
{echo $message = '<script language="javascript"> alert("Tous les champs doivent être remplis.");</script> ';}
}
?>