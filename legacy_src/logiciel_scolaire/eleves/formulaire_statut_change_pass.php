<?php 
$s2=mysqli_query($mysqli, "select *from annee_scolaire order by nom_annee_scolaire asc");
?>
<?php $id= $_SESSION['id_membre_ele'];
	 $a=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve where id_eleve='".$id."'"));
	   ?>
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

<form class="formoid-default-skyblue" style="background-color:#ebecff;font-size:20px;font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;color:#585166;max-width:900px;min-width:150px" method="post">
<div class="title"><h2 style="color:#03C;">Modifications</h2></div>

    <div class="element-input">
    <label class="title">Nouveau mot de passe<span class="required"></span></label>
    <input class="large" type="text" name="pass" required placeholder="mot de passe"/></div>
    <div class="element-input">
    <label class="title">Reentrer ce mot de passe<span class="required"></span></label>
    <input class="large" type="text" name="pass" required placeholder="meme mot de passe"/></div>
	<input type="hidden"  name="id_eleve" value="<?php echo $a['id_eleve']; ?>"/>
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>
<?php 
if(isset($_POST['pass']))
{ $pass=$_POST['pass'];
$id_eleve=$_POST['id_eleve'];

 	  if(mysqli_query($mysqli, 'update eleve set pass_eleve="'.$pass.'" where id_eleve="'.$id_eleve.'"'))
    { echo'<script language="javascript"> alert("Modification effectuée!!! ")</script>'; 
	echo'<script language="javascript"> document.location.href="statut_profil.php";</script>';
  exit();}
  else { echo $message='<script language="javascript"> alert("Erreur pendant la modification")</script>'; exit();}
 
}
  

?>