<?php 

$s1=mysqli_query($mysqli, "select *from cycle order by nom_cycle asc");
$s2=mysqli_query($mysqli, "select *from serie order by nom_serie asc");
$s3=mysqli_query($mysqli, "select *from etablissement order by nom_etablissement asc");
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
<div class="title"><h2 style="color:#03C;">Création des salles de classes</h2></div>
	
	<div class="element-select" >
    <div class="large"><span><label class="title">Sélectionnez un cycle<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <select name="cycle" value="<?php if(isset($_POST['cycle'])) {echo $_POST['cycle'];}?>" required="required">
    	<?php while($t1=mysqli_fetch_array($s1)){ ?>
		<option value="<?php echo $t1['id_cycle']; ?>"><?php echo $t1['nom_cycle']; ?></option>
		<?php } ?>
     </select><i></i></span></div></div>
     <div class="element-select" >
    <div class="large"><span><label class="title">Sélectionnez une serie<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <select name="serie" value="<?php if(isset($_POST['serie'])) {echo $_POST['serie'];}?>" required="required">
    	<option value="0">-------- Aucune série --------</option>
    	<?php while($t2=mysqli_fetch_array($s2)){ ?>
		<option value="<?php echo $t2['id_serie']; ?>"><?php echo $t2['nom_serie']; ?></option>
		<?php } ?>
     </select><i></i></span></div></div>
	<div class="element-input" title="Saisir le quartier ici">
    <label class="title">Nom de la classe<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="text" name="nom" value="<?php if(isset($_POST['nom'])) {echo $_POST['nom'];}?>" required placeholder="Exemple: SIXIEME / TERMINALE"/></div>
    <div class="element-input" >
    <div class="submit">
    <label class="title">etablissement <span class="required" style="color:rgb(255,0,0)">*</span></label>
   
     <select name="etablissement" value="<?php if(isset($_POST['etablissement'])) {echo $_POST['etablissement'];}?>" required="required">
      
      <?php while($t3=mysqli_fetch_array($s3)){ ?>
    <option value="<?php echo $t3['id_etablissement']; ?>"><?php echo $t3['nom_etablissement']; ?></option>
    <?php } ?>
     </select>
  <div class="submit">
    <label class="title">Nombre de classe à créer<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="number" min="1" name="nombre" value="<?php if(isset($_POST['nombre'])) {echo $_POST['nombre'];}?>" required placeholder="Exemple: 3"/></div>
	
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>

<?php 
if(isset($_POST['nom']))
{ $nom=$_POST['nom'];
$id_serie=$_POST['serie'];
  $nbr_nom_classe= mysqli_num_rows(mysqli_query($mysqli, "select * from classe where nom_classe='$nom' and id_serie=$id_serie"));
  if($nbr_nom_classe==0) // si le reultat est egale a zero de 0 cela veut dire que l'etablissement n'esxiste pas encore dans la base 
  {	$verification=0;
	  $id_cycle=$_POST['cycle'];
  
	  $nombre=$_POST['nombre'];
	  //on fabrique le nom unique des salle de classe.
	  if ($id_serie!==0)$n_serie= mysqli_fetch_array(mysqli_query($mysqli, "select nom_serie from serie where id_serie=$id_serie"));
	  $nom_unique=$_POST['nom']; $nom_unique.=" ";  if ($id_serie!==0)$nom_unique.=$n_serie['nom_serie']; 
	  for($i=1; $i<=$nombre; $i++){
 	  if(mysqli_query($mysqli, 'insert into classe(nom_classe, nom_unique_classe, numero_classe, id_cycle, id_serie,date_enre_classe) values("'.$nom.'","'.$nom_unique.'","'.$i.'","'.$id_cycle.'","'.$id_serie.'","'.time().'")'))
    { $verification=1;}
  else { $verification=0;}
  } 
  }
 else { echo $message='<script language="javascript"> alert("Cette classe existe déja. veuillez changer ce nom!!!")</script>';exit();}

if ($verification==1){
    echo'<script language="javascript"> alert("enregistrement réussi!!! ")</script>'; 
	
  exit();}else{echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; exit();}
}
?>