<?php 
$s2=mysqli_query($mysqli,"select *from annee_scolaire order by nom_annee_scolaire asc");
?>
<?php $id= $_SESSION['id_membre_sur'];
	 $a=mysqli_fetch_array(mysqli_query($mysqli,"select *from statut_personnel where id_statut_personnel=$id"));
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
<div id="p_form">
<form class="formoid-default-skyblue" style="background-color:#ebecff;font-size:20px;font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;color:#585166;max-width:900px;min-width:150px" method="post">
<div class="title"><h2 style="color:#03C;">Verifications</h2></div>

    <div class="element-input">
    <label class="title">Entrer votre ancien mot de passe<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="password" name="mdp" required placeholder="Mdp"/></div>
	<input type="hidden"  name="id_statut_personnel" value="<?php echo $a['id_statut_personnel']; ?>"/>
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form></div><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>
