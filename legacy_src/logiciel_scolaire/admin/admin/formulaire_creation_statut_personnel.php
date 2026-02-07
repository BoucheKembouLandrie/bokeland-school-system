  <?php 
$s=mysqli_query($mysqli, "select *from personnel order by nom_personnel asc");
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

<form class="formoid-default-skyblue" style="background-color:#ebecff;font-size:20px;font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;color:#585166;max-width:900px;min-width:150px" method="post" enctype="multipart/form-data">
<div class="title"><h2 style="color:#03C;">Fonction du personnel</h2></div>
	
    <div class="element-select" >
    <div class="large"><span><label class="title">Nom du personnel<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <select name="id_personnel" value="<?php if(isset($_POST['id_personnel'])) {echo $_POST['id_personnel'];}?>" required="required">
    	<?php while($t1=mysqli_fetch_array($s)){ ?>
		<option value="<?php echo $t1['id_personnel']; ?>"><?php echo $t1['nom_personnel'];echo " ".$t1['prenom_personnel']; ?></option>
		<?php } ?>
     </select><i></i></span></div></div>
     
     <div class="element-select" >
    <div class="large"><span><label class="title">Statut du personnel<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <select name="statut" value="<?php if(isset($_POST['statut'])) {echo $_POST['statut'];}?>" required="required">
        <option value="Enseignant">Enseignant</option>
        <option value="Chef division scolarité">Chef division scolarité</option>
        <option value="Chef division des études">Chef division des études</option>
		<option value="Surveillant">Surveillant</option>
     </select><i></i></span></div></div>

	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>

<?php 
if(isset($_POST['id_personnel']))
{ 
$id_personnel=$_POST['id_personnel'];
  $statut=$_POST['statut'];
  $nbr= mysqli_num_rows(mysqlI_query($mysqli, "select * from statut_personnel where id_personnel=$id_personnel and statut='$statut'"));
  if($nbr==0) // si le reultat est egale a zero de 0 cela veut dire que l'etablissement n'esxiste pas encore dans la base 
  {
	  //on fabrique son matricule---------------------
	  $q=mysqli_fetch_array(mysqli_query($mysqli, "select nom_etablissement from etablissement"));
	  $matricule="";
	  if($statut=="Enseignant") $matricule="ENS";
	  if($statut=="Chef division scolarité")$matricule="SCO";
	  if($statut=="Chef division des études")$matricule="PRE";
	  if($statut=="Surveillant")$matricule="SUR";
	  $matricule.=majuscule(extraire_caracteres($q['nom_etablissement'],3));
	  $matricule.=substr(date('Y', time()),2);
	  
	  $matricule.=$id_personnel;//fin de la fabrication du matricule
	  $pass=code_aleatoire(8);//on genere un mot de passe aléatoire
	  
 	  if(mysqli_query($mysqli, 'insert into statut_personnel(id_personnel,statut,matricule_statut_personnel,pass_statut_personnel,date_enre_statut_personnel) values("'.$id_personnel.'","'.$statut.'","'.$matricule.'","'.$pass.'","'.time().'")'))
    {
    echo'<script language="javascript"> alert("enregistrement réussi!!! ")</script>';  

  exit();}
  else { echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; exit();}
  }
 else { echo $message='<script language="javascript"> alert("vous avez déja affecté ce statut à ce personnel.")</script>'; exit();}

}
  

?>