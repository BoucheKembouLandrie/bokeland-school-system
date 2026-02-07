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
<div class="title"><h2 style="color:#03C;">Propriétés division des études</h2></div>
	
	<div class="element-select" >
    <div class="large"><span><label class="title">Etablissement<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <select name="etablissement" value="<?php if(isset($_POST['etablissement'])) {echo $_POST['etablissement'];}?>" required="required">

		<?php //ici on mettra le nom des établissements qui ont été crée ?>
     </select><i></i></span></div></div>
	 <div class="element-select" >
    <div class="large"><span><label class="title">Année scolaire<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <select name="etablissement" required="required">

		<?php //ici on mettra le nom des établissements qui ont été crée ?>
     </select><i></i></span></div></div>
	<div class="element-input" >
    <label class="title">Nombre de tranche de paiement <span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="number" name="nombre_tranche" value="<?php if(isset($_POST['nombre_tranche'])) {echo $_POST['nombre_tranch'];}?>" required placeholder="Exemple: 3"/></div>
	<div class="element-input" >
    <label class="title">Montant inscription (en FCFA) <span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="number" name="montant_inscription" value="<?php if(isset($_POST['montant_inscription'])) {echo $_POST['montant_inscription'];}?>" required placeholder="Exemple: 50000"/></div>
	
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>
