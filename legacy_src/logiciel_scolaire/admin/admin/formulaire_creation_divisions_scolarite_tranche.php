<?php $tab_index_name=array();
//
$s1=mysqli_query($mysqli, "select *from scolarite order by montant_inscription asc");
//on recupère le nombre de tranche qui on été enregistrer par l'admin
$s3=mysqli_query($mysqli, "select nbr_tranche from scolarite ");
$nombre_enre=mysqli_num_rows(mysqli_query($mysqli, "select nbr_tranche from scolarite "));
$nombre_trai=mysqli_num_rows(mysqli_query($mysqli, "select *from tranche where date_debut_paiement=' '"));

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
	 #loader{
	width: 100%;
	display: none;}
	</style>
</head>
<body class="blurBg-true" style="background-color:#d3d9eb">



<!-- Start Formoid form-->
<link rel="stylesheet" href="infoetablissement_files/formoid1/formoid-default-skyblue.css" type="text/css" />
<script type="text/javascript" src="infoetablissement_files/formoid1/jquery.min.js"></script>


<?php if($nombre_enre!==0){ //on affiche rine si la table scolarité n'es pas encore crée?>
<form class="formoid-default-skyblue" style="background-color:#ebecff;font-size:20px;font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;color:#585166;max-width:900px;min-width:150px" method="post">

<div class="title"><h2 style="color:#03C;">Propriétés scolarité</h2></div>
	
	<div class="element-select" >
    <div class="large"><span>
    <select name="id_scolarite" id="id_scolarite" required="required" onChange="affichage_eleve(this.value)">
    <option value="">--------------Sélectionnez le montant d'inscription ------------------</option>
		<?php while($t1=mysqli_fetch_array($s1)){ ?>
		<option value="<?php echo $t1['id_scolarite']; ?>"><?php echo $t1['libelle'];?><?php if($nombre_trai!==0){echo ' <i style="color:green">OK</i>';}  ?> </option>
		<?php  } ?>
     </select><i></i></span></div></div>
     
     <div align="center" id="loader"> <img src="images/loader.gif" height="30" width="30"/></div>
     
     <div id="resultat">
    
     
     
     </div>
    
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->

<?php 	}else{ echo '<h3>Option non disponible... Configurer d\'abord la division scolarité. </h3>';} ?>

</body>
</html>
<?php 
if(isset($_POST['montant_tranche1']))
{ 
 $nombre_tranche=$_POST['nombre_tranche'];
 $t_montant=array(); $t_date_debut=array(); $t_date_fin=array(); $id_scolarite=$_POST['id_scolarite'];
 for($i=1; $i<=$nombre_tranche; $i++){ //cette boucle permet de recupérer les valeur entrée dans les input
$t_montant[$i]=$_POST['montant_tranche'.$i.''];
$t_date_debut[$i]=$_POST['date_debut'.$i.''];
  $t_date_fin[$i]=$_POST['date_fin'.$i.''];
 }
 $verification=0;
 if($t_date_debut<$t_date_fin){
for($i=1; $i<=$nombre_tranche; $i++)
{ //on cree les enregistrement des tranches de paiement
 	  if(mysqli_query($mysqli, 'insert into tranche(numero_tranche,montant_tranche,date_debut_paiement,date_fin_paiement,id_scolarite,date_enre_tranche) values("'.$i.'","'.$t_montant[$i].'","'.$t_date_debut[$i].'","'.$t_date_fin[$i].'","'.$id_scolarite.'","'.time().'")'))
    {
		$verification=1;
  }
  else { $verification=0; }
}}

if ($verification==1) {echo'<script language="javascript"> alert("enregistrement réussi!!! ")</script>';  
  exit();}
else{ echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; exit();}
}
  

?>