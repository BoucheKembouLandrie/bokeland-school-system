<?php 
//on sélectionne les établissement enregistré dans la table etablissement.
$select_etablissement=mysqli_query($mysqli, "select *from etablissement order by nom_etablissement asc");
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
<div class="title"><h2 style="color:#03C;">Création année scolaire</h2></div>
	
	<div class="element-select" title="Choisissez votr ville">
    <div class="large"><span>
    <select name="etablissement" value="<?php if(isset($_POST['etablissement'])) {echo $_POST['etablissement'];}?>" required="required">
    	<?php while($t=mysqli_fetch_array($select_etablissement)){ ?>
		<option value="<?php echo $t['id_etablissement']; ?>"><?php echo $t['nom_etablissement']; ?></option>
		<?php } ?>
     </select></span></div></div>
	<div class="element-input" title="Saisir le quartier ici">
    <label class="title">Nom <span class="required" style="color:red;">*</span></label>
    <input class="large" type="text" name="nom" value="<?php if(isset($_POST['nom'])) {echo $_POST['nom'];}?>" required placeholder="Exemple: 2017 / 2018"/></div>
	
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>

<?php 
if(isset($_POST['nom']))
{ $nom=$_POST['nom'];
  $nbr_nom_annee= mysqli_num_rows(mysqli_query($mysqli, "select * from annee_scolaire where nom_annee_scolaire='$nom'"));
  $ann = mysqli_num_rows(mysqli_query($mysqli, "select * from annee_scolaire"));
  if($ann == 0){	  
  if($nbr_nom_annee==0) // si le reultat est egale a zero de 0 cela veut dire que l'etablissement n'esxiste pas encore dans la base 
  {
	  $id_etablissement=$_POST['etablissement'];
 	  if(mysqli_query($mysqli, 'insert into annee_scolaire(nom_annee_scolaire, id_etablissement) values("'.$nom.'","'.$id_etablissement.'")'))
    {
    echo'<script language="javascript"> alert("enregistrement réussi!!! ")</script>';  
  exit();}
  else { echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; exit();}
  
  }
 else { echo $message='<script language="javascript"> alert("Ce nom d\'année scolaire existe déja. veuillez le changer!!!")</script>';exit();}
  }
  else{
	  echo '<script language="javascript">alert("impossible de creer plusieur annee scolaire")</script>'; exit();
	  }
}
  

?>