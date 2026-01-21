<?php 
//on sélectionne les établissement enregistré dans la table etablissement.
$s1=mysqli_query($mysqli, "select *from etablissement order by nom_etablissement asc");
//on sélectionne les annee.
$s2=mysqli_query($mysqli, "select *from annee_scolaire order by nom_annee_scolaire asc");

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
<div class="title"><h2 style="color:#03C;">Propriétés scolarité</h2></div>
	
	<div class="element-select" >
    <div class="large"><span><label class="title">Etablissement<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <select name="etablissement" value="<?php if(isset($_POST['etablissement'])) {echo $_POST['etablissement'];}?>" required="required">
		<?php while($t1=mysqli_fetch_array($s1)){ ?>
		<option value="<?php echo $t1['id_etablissement']; ?>"><?php echo $t1['nom_etablissement']; ?></option>
		<?php } ?>
     </select><i></i></span></div></div>
	 <div class="element-select" >
    <div class="large"><span><label class="title">Année scolaire<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <select name="annee_scolaire" value="<?php if(isset($_POST['annee_scolaire'])) {echo $_POST['annee_scolaire'];}?>" required="required">
		<?php while($t2=mysqli_fetch_array($s2)){ ?>
		<option value="<?php echo $t2['id_annee_scolaire']; ?>"><?php echo $t2['nom_annee_scolaire']; ?></option>
		<?php } ?>
     </select><i></i></span></div></div>
	<div class="element-input" >
    <label class="title">Nombre de tranche de paiement <span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="number" min="1" name="nombre_tranche" value="<?php if(isset($_POST['nombre_tranche'])) {echo $_POST['nombre_tranche'];}?>" required placeholder="Exemple: 3"/></div>
	<div class="element-input" >
    <label class="title">Montant inscription (en FCFA) <span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="number" min="1" name="montant_inscription" value="<?php if(isset($_POST['montant_inscription'])) {echo $_POST['montant_inscription'];}?>"required placeholder="Exemple: 50000"/></div>
    <div class="element-input" >
    <label class="title">Libelle montant <span class="required" style="color:red;">*</span></label>
    <input class="large" type="text" name="libelle" value="<?php if(isset($_POST['libelle'])) {echo $_POST['libelle'];}?>" required placeholder="libelle"/></div>

	
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>
<?php 
if(isset($_POST['nombre_tranche']))
{ $nbr_tranche=$_POST['nombre_tranche'];
    $montant_inscription=$_POST['montant_inscription'];
	$id_etablissement=$_POST['etablissement'];
	$id_annee_scolaire=$_POST['annee_scolaire'];
	$lib=$_POST['libelle'];
 	  if(mysqli_query($mysqli, 'insert into scolarite(id_etablissement,id_annee_scolaire, nbr_tranche,montant_inscription,libelle,date_enre_scolarite) values("'.$id_etablissement.'","'.$id_annee_scolaire.'","'.$nbr_tranche.'","'.$montant_inscription.'","'.$lib.'","'.time().'")'))
    {
    echo'<script language="javascript"> alert("enregistrement réussi!!! ")</script>';  
  exit();}
  else { echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; exit();}


}
  

?>