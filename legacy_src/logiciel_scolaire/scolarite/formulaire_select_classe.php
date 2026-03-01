
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

<form>

	<div class="element-select" id="div_classe" k<label class="title"><span class="required">Classe</span></label><div class="item-cont"><div class="large"><span><select name="classe" value="<?php if(isset($_POST['classe'])) {echo $_POST['classe'];}?>" id="classe" required="required">
    <option value="" selected="selected">-------- Sélectionnez une salle de classe --------</option>
		<?php  while($t10=mysqli_fetch_array($s10)){ ?> 
    <option value="<?php echo $t10['id_classe']; ?>">
		<?php  echo $t10['nom_unique_classe']; ?>
        
<?php }?>       
        </select>
     

</form><p class="frmd"></p><script type="text/javascript" src="inscriptioneleve_files/formoid1/formoid-solid-blue.js"></script>
<!-- Stop Formoid form-->

</body>
</html>
