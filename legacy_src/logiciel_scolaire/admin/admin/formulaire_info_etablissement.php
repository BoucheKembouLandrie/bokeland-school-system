<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body class="blurBg-true" style="background-color:#d3d9eb">



<!-- Start Formoid form-->
<link rel="stylesheet" href="infoetablissement_files/formoid1/formoid-default-skyblue.css" type="text/css" />
<script type="text/javascript" src="infoetablissement_files/formoid1/jquery.min.js"></script>

<form class="formoid-default-skyblue" style="background-color:#ebecff;font-size:20px;font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;color:#585166;max-width:900px;min-width:150px" method="post" enctype="multipart/form-data">
<div class="title"><h2 style="color:#03C;">Informations de l'établissement</h2></div>
	<div class="element-input" title="Saisir le nom de l'établissement ici">
    <label class="title">Nom<span class="required" style="color:rgb(255,0,0)">*</span></label><input class="large" type="text" name="nom" value="<?php if(isset($_POST['nom'])) {echo $_POST['nom'];}?>" required/></div>
	<div class="element-select" >
    <label class="title">Localisation (Ville)<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <div class="large"><span>
    <select name="ville" value="<?php if(isset($_POST['ville'])) {echo $_POST['ville'];}?>" required="required">

		<?php include"php/select_ville_du_cameroun.html"; ?>
     </select><i></i></span></div></div>
	<div class="element-input">
    <label class="title">Localisation (Quartier)<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="text" name="quartier" value="<?php if(isset($_POST['quartier'])) {echo $_POST['quartier'];}?>" required/></div>
	<div class="element-input">
    <label class="title">Votre devise<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="text" name="devise" value="<?php if(isset($_POST['devise'])) {echo $_POST['devise'];}?>" required/></div>
    <div class="element-input">
    <label class="title">Votre contact<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="text" name="contact" value="<?php if(isset($_POST['contact'])) {echo $_POST['contact'];}?>" required/></div>
    <div class="element-input" > 
    <label class="title">Logo<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input  type="file" name="logo" value="<?php if(isset($_POST['logo'])) {echo $_POST['logo'];}?>" required/></div>
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>

<?php 
if(isset($_POST['nom']))
{ $nom=$_POST['nom'];
	$nombre_creation= mysqli_num_rows(mysqli_query($mysqli, "select * from etablissement"));
  $nbr_nom_etablissement= mysqli_num_rows(mysqli_query($mysqli, "select * from etablissement where nom_etablissement='$nom'")); 
  if ($nombre_creation<=0){
  if($nbr_nom_etablissement==0) // si le reultat est egale a zero de 0 cela veut dire que l'etablissement n'esxiste pas encore dans la base 
  {
	  $ville=$_POST['ville'];
	  $quartier=$_POST['quartier'];
	  $devise=$_POST['devise'];
    $contact=$_POST['contact'];
	  //-------------------enregistrement du logo de l'entreprise
				   include "php/upload.php";
				   $logo=$nomImage;
				   //-------------------fin de l'enregistrement 
		
  
				   if ($verification==1){
 	  if(mysqli_query($mysqli, 'insert into etablissement(nom_etablissement, ville_etablissement, quartier_etablissement,devise_etablissement,logo_etablissement,contact_etablissement,date_enre_etablissement) values("'.$nom.'","'.$ville.'","'.$quartier.'","'.$devise.'","'.$logo.'","'.$contact.'","'.time().'")'))
    {
    echo'<script language="javascript"> alert("enregistrement réussi!!! ")</script>';  
  exit();}
  else { echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; }
   }				
				else
				{echo $message = '<script language="javascript"> alert("Une erreur interne a empêché le chargement du fichier logo... Vérifier votre fichier logo.")</script> !'; }

   }
   
 else { echo $message='<script language="javascript"> alert("Ce nom d\'établissement est déjà utilisé")</script>';}

}else {echo $message='<script language="javascript"> alert("un autre etablissement ne peut etre creer")</script>';}

}

?>