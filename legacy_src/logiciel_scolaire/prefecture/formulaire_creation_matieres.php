<?php 
$s2=mysqli_query($mysqli, "select *from annee_scolaire order by nom_annee_scolaire asc");
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script language="javascript">
	
  function checkAll(){
// on cherche les checkbox à l'intérieur de l'id  'magazine'
var magazines = $("#magazine").find(':checkbox'); 
   if(this.checked){ // si 'checkAll' est coché
      magazines.prop('checked', true); 
   }else{ // si on décoche 'checkAll'
      magazines.prop('checked', false);
   }          
}
    </script>
</head>
<body class="blurBg-true" style="background-color:#d3d9eb">



<!-- Start Formoid form-->
<link rel="stylesheet" href="infoetablissement_files/formoid1/formoid-default-skyblue.css" type="text/css" />
<script type="text/javascript" src="infoetablissement_files/formoid1/jquery.min.js"></script>

<form class="formoid-default-skyblue" style="background-color:#ebecff;font-size:20px;font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;color:#585166;max-width:900px;min-width:150px" method="post">
<div class="title"><h2 style="color:#03C;">Création des matières</h2></div>
	
	<div class="element-input">
    <label class="title">Nom de la matère <span class="required" style="color:rgb(255,0,0)">*</span></label>
    <input class="large" type="text" name="nom" required placeholder="Exemple: FRANCAIS"/></div>
	
     
        <?php 
		 $td1=mysqli_query($mysqli, "SELECT *FROM classe group by nom_unique_classe ");
		 ?>
        <label class="title">Sélectionnez les classes concernées <span class="required" style="color:rgb(255,0,0)">*</span></label>
	
	<div class="element-checkbox">
    <a href="#" style=" color:#063;" id="checkALL" Click="checkAll();">Tous cocher/décocher</a>
   
    <?php $o=0; while($tab_td1=mysqli_fetch_array($td1)){ $o++; ?> 
    	
        </br>    <input type="checkbox" name="classe[]" value="<?php echo $tab_td1['id_classe'];  ?>"  / ><span><?php echo ' '.$tab_td1['nom_unique_classe'].'  ';  ?> 
       
         <?php }  ?> 
        
         </div>
    
    
	<div class="submit">
    <input type="submit" value="Valider"/></div>
    
</form><p class="frmd"><a href="#"></p><script type="text/javascript" src="infoetablissement_files/formoid1/formoid-default-skyblue.js"></script>
<!-- Stop Formoid form-->



</body>
</html>
<?php 

if(isset($_POST['nom'])) 
{  
if(empty($_POST['classe']))
{ echo $message='<script language="javascript"> alert("Sélectionnez les classes concernées.")</script>'; }
else{
$nom=$_POST['nom'];
	foreach($_POST['classe'] as $valeur)
	{ 
		//on cherche le nom de la classe
		$tN=mysqli_fetch_array(mysqli_query($mysqli, "select nom_unique_classe from classe where id_classe=$valeur"));
		$nom_classe=$tN['nom_unique_classe'];
		
		//on selectionne toute les classe qui ont pour nom de classe le nom selectionne cidessus
		$ti=mysqli_query($mysqli, "select id_classe from classe where nom_unique_classe='$nom_classe'");
		
		//on demarre une boucle qui creera autant de matiere pour chaque salle de classe de maniere a differencier les matiere de chaque classe.
		//------------------------------------------------------------------------------------------------
		while ( $tDD=mysqli_fetch_array($ti) ) {
				$verification=0;
 	  if(mysqli_query($mysqli, 'insert into matiere(nom_matiere,id_classe, date_enre_matiere) values("'.$nom.'","'.$tDD['id_classe'].'","'.time().'")'))
    	{
			
			$a=mysqli_fetch_array(mysqli_query($mysqli, "select *from classe where id_classe='".$tDD['id_classe']."'"));
	$aa=mysqli_fetch_array(mysqli_query($mysqli, "select *from matiere where nom_matiere='".$nom."' and id_classe='".$tDD['id_classe']."' "));
		if(mysqli_query($mysqli, 'insert into affectation_matiere(id_classe, id_serie, id_matiere, date_enre_affectation) values("'.$tDD['id_classe'].'","'.$a['id_serie'].'","'.$aa['id_matiere'].'","'.time().'")'))
    	{
			if(mysqli_query($mysqli, 'insert into groupe(id_classe, id_matiere, date_enre_groupe) values("'.$tDD['id_classe'].'","'.$aa['id_matiere'].'","'.time().'")'))
    	{
			$verification=1;
  		}
		else
		{$verification=0;}
  		}
		else
		{$verification=0;}
  		}
  	  else { $verification=0; }
	  
	  }//fin de la boucle while-----------------------------------------------------------------------------------------------
	  
	}//fin de la boucle for------------------------------------
	
	if ($verification==1) {
		echo $message='<script language="javascript"> alert("Enregistrement réussi!!!")</script>';
		  }
	else{ echo $message='<script language="javascript"> alert("Erreur pendant l\'enregistrement: un des enregistrements existe certainement")</script>'; }
}
}

?>