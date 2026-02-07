<?php 
$s2=mysqli_query($mysqli, "select *from cycle order by nom_cycle asc");
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
<div class="title"><h2 style="color:#03C;">Création de serie</h2></div>
	
	<div class="element-select" >
    <div class="large"><span><label class="title">Sélectionnez le cycle<span class="required" style="color:rgb(255,0,0)">*</span></label>
    <select name="cycle" value="<?php if(isset($_POST['cucle'])) {echo $_POST['cycle'];}?>" required="required">
		<?php while($t2=mysqli_fetch_array($s2)){ ?>
		<option value="<?php echo $t2['id_cycle']; ?>"><?php echo $t2['nom_cycle']; ?></option>
		<?php } ?>
     </select><i></i></span></div></div>
	<div class="element-input">
    <label class="title">Nom <span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="text" name="nom" value="<?php if(isset($_POST['nom'])) {echo $_POST['nom'];}?>" required placeholder="Exemple: C "/></div>
	
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>
<?php 
if(isset($_POST['nom']))
{ $nom=$_POST['nom'];
    $id_cycle=$_POST['cycle'];
	
	$som=mysqli_num_rows(mysqli_query($mysqli, "select *from serie where nom_serie='".$nom."'"));
	if($som==0){
 	  if(mysqli_query($mysqli, 'insert into serie(id_cycle,nom_serie,date_enre_serie) values("'.$id_cycle.'","'.$nom.'","'.time().'")'))
    {
    echo'<script language="javascript"> alert("enregistrement réussi!!! ");</script>';  
  
  exit();}
  else { echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; exit();}
	}else{
		echo'<script language="javascript"> alert("impossible de creer une meme serie plusieurs fois!!! ");</script>';
	}

}
  

?>