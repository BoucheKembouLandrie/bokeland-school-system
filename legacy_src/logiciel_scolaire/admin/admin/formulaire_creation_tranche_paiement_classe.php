<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body class="blurBg-false" style="background-color:#EBEBEB">



<!-- Start Formoid form-->
<link rel="stylesheet" href="selecttranchepaiement_files/formoid1/formoid-solid-green.css" type="text/css" />
<script type="text/javascript" src="selecttranchepaiement_files/formoid1/jquery.min.js"></script>
<form class="formoid-solid-green" style="background-color:#FFFFFF;font-size:15spx;font-family:'Roboto',Arial,Helvetica,sans-serif;color:#34495E;max-width:auto;min-width:100%" method="post"><div class="title"><h2>Affectation des tranches de paiement aux classes</h2></div>
	<div class="element-select"><label class="title"></label><div class="item-cont"><div class="large"><span>
    
    <select name="select" required="required" style="font-size:16px;">

		<option value="" selected="selected">---------------- Sélectionnez une option de paiement ----------------</option>
		<?php while($t10=mysqli_fetch_array($s10)){  ?> 
     
        <?php
		$id=$t10['id_scolarite'];
		$st=mysqli_query($mysqli, "SELECT *FROM tranche where id_scolarite=$id ");
		
		 ?> 
    <option value="<?php echo $t10['id_scolarite']; ?>">
		<?php  
			echo'Intitule: '.$t10['libelle'];
		 ?>
    </option>
<?php }?> 
        </select><i></i><span class="icon-place"></span></span></div></div></div>
        
        <?php 
		 $td1=mysqli_query($mysqli, "SELECT distinct nom_unique_classe FROM classe ");
		 ?>
        
	<div class="element-checkbox">
    <?php $o=0; while($tab_td1=mysqli_fetch_array($td1)){ $o++; ?> 
    	<div class="column column1">
           <input type="checkbox" name="classe[]" value="<?php echo $tab_td1['nom_unique_classe'];  ?>" / ><span><?php echo ' '.$tab_td1['nom_unique_classe'].'  ';  ?> </span>
        </div><span class="clearfix"></span>
         <?php }  ?> 
</div>
<div class="submit"><input type="submit" value="Enregistrer"/></div></form>
<script type="text/javascript" src="selecttranchepaiement_files/formoid1/formoid-solid-green.js"></script>
<!-- Stop Formoid form-->
</body>
</html>


<?php 
if(isset($_POST['classe']))
{ 
	echo $select=$_POST['select'];
	foreach($_POST['classe'] as $valeur)
	{
		$verification=0; 
 	  if(mysqli_query($mysqli, "update classe set id_scolarite ='".$select."' where nom_unique_classe='$valeur' "))
    	{
			$verification=1;
  		}
  	  else { $verification=0; }
	}

	if ($verification==1) {echo'<script language="javascript"> alert("enregistrement réussi!!! ")</script>';  exit();}
	else{ echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement")</script>'; exit();}

   
}
  
?>
