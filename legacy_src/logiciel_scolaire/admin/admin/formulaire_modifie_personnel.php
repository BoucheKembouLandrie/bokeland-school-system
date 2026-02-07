

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
<div class="title"><h2 style="color:#03C;">Enregistrement du personnel</h2></div>
	
    <div class="element-name">
    <label class="title">Noms et prénoms<span class="required" style="color:red;">*</span></label>
    <span class="nameLast"><input required placeholder="Saisir le nom ici" type="text" size="20" name="nom" value="<?php if(isset($_POST['nom'])) {echo $_POST['nom'];}?>"/>
    <span class="icon-place"></span></span><span class="nameFirst">
    <input required placeholder="Saisir le prénom ici" type="text" size="10" name="prenom" value="<?php if(isset($_POST['prenom'])) {echo $_POST['prenom'];}?>" /><span class="icon-place"></span></span></div>
    <div class="element-radio"><label class="title"></label>		
    <div class="column column1"><label><input type="radio" name="sex" value="<?php if(isset($_POST['sex'])) {echo $_POST['sex'];}?>" value="Homme" required="required"/><span>Homme</span>
    </label><label><input type="radio" name="sex" value="<?php if(isset($_POST['sex'])) {echo $_POST['sex'];}?>" value="Femme" required="required"/><span>Femme</span></label></div>
    <span class="clearfix"></span>
</div>

    
	<div class="element-input">
    <label class="title">Contacts<span class="required" style="color:red;">*</span></label>
    <input class="large" type="text" name="contact" value="<?php if(isset($_POST['contact'])) {echo $_POST['contact'];}?>" required/></div>
	<div class="element-input">
    <label class="title">Email<span class="required" style="color:red;">*</span></label>
    <input class="large" type="email" name="email" value="<?php if(isset($_POST['email'])) {echo $_POST['email'];}?>"/></div>
    <div class="element-input" >
    <label class="title">identification (photo)<span class="required" style="color:red;">*</span></label>
    <input  type="file" name="logo"/></div>
    <input type="hidden" name="id_personnel" value="<?php echo $ac['id_personnel']; ?>"/>
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->


</body>
</html>

<?php 
if(isset($_POST['nom']))
{ $nom=$_POST['nom'];
  $nbr_nom_etablissement= mysqli_num_rows(mysqli_query($mysqli, "select * from personnel where nom_personnel='$nom'"));
  if($nbr_nom_etablissement==0) // si le reultat est egale a zero de 0 cela veut dire que l'etablissement n'esxiste pas encore dans la base 
  {
	  $prenom=$_POST['prenom'];
	  $contact=$_POST['contact'];
	  $email=$_POST['email'];
	  $sex=$_POST['sex'];
	  $id_personnel=$_POST['id_personnel'];
	  //-------------------enregistrement du logo de l'entreprise
				   include "php/upload_photo_enseignant.php";
				   $logo=$nomImage;
				   //-------------------fin de l'enregistrement
				   if ($verification==1){
 	  if(mysqli_query($mysqli, 'update personnel set nom_personnel="'.$nom.'", prenom_personnel="'.$prenom.'",sex_personnel="'.$sex.'", contact_personnel="'.$contact.'", email_personnel="'.$email.'", photo_personnel="'.$logo.'", date_enre_personnel="'.time().'" where id_personnel="'.$id_personnel.'"'))
    {
    echo'<script language="javascript"> alert("modification réussi!!! ")</script>';  
  exit();}
  else { echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; exit();}
   }				
				else
				{echo $message = '<script language="javascript"> alert("Une erreur interne a empêché le chargement du fichier logo... Vérifier votre fichier logo.")</script> !';
				 exit();}

   }
   
 else { echo $message='<script language="javascript"> alert("Ce nom existe déjà. veuillez le changer.")</script>'; exit();}

}
  

?>