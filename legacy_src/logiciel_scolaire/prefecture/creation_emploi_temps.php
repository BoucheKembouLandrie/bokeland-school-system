<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION SCOLARITE</title>
      <?php include "php/head_prefecture.php"; ?>
      <?php  
	  $s10=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $s11=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $nu=mysqli_num_rows($s10);
	  ?>
      <style>
	  #loader{
		  display:none;}
	  </style>
      <script language="javascript">
      function select_classe_emploi_temps(){
var classe_temps=$("#classe").val();
if (classe_temps!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{classe_temps:classe_temps},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		});
}
}
      </script>
</head>

<body>
    <div id="wrapper">
       <?php include "php/menu_prefecture.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $prefecture; //variable comportant le nom de la section ?> /Emploi de temps </h2>   
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
    
<div class="col-md-4" class="form-group">
   <select name="classe" class="selectpicker form-control" id="classe"  onChange="select_classe_emploi_temps(this.value);" >
 <option value="" >.......... Sélectionnez une salle de classe ..........</option>
 <?php  while($t10=mysqli_fetch_array($s10)){ ?>
    <option value="<?php echo $t10['id_classe']; ?>" >
		<?php if ($t10['nom_serie']=="")  echo $t10['nom_classe'].' '.$t10['numero_classe'];
		      else echo $t10['nom_classe']." ".$t10['nom_serie']; echo ' '.$t10['numero_classe']; ?>
    </option>
<?php }?>
      </select>
</div>
  

</div>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                    <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default" id="resultat">
                        
                    </div>
                    
                    </div>
                </div>
                 <!-- /. ROW  -->
                        
                 <!-- /. ROW  -->           
    </div>
             <!-- /. PAGE INNER  -->
            </div>
         <!-- /. PAGE WRAPPER  -->
        </div>
     <!-- /. WRAPPER  -->
    <!-- SCRIPTS -AT THE BOTOM TO REDUCE THE LOAD TIME-->
    <!-- JQUERY SCRIPTS -->
    <script src="contenu/js/jquery-1.10.2.js"></script>
      <!-- BOOTSTRAP SCRIPTS -->
    <script src="contenu/js/bootstrap.min.js"></script>
    <!-- METISMENU SCRIPTS -->
    <script src="contenu/js/jquery.metisMenu.js"></script>
     <!-- MORRIS CHART SCRIPTS -->
     <script src="contenu/js/morris/raphael-2.1.0.min.js"></script>
    <script src="contenu/js/morris/morris.js"></script>
      <!-- CUSTOM SCRIPTS -->
    <script src="contenu/js/custom.js"></script>
     <script src="php/js index.js"></script>
    
   
</body>
</html>
<?php
if(isset($_GET['1l_1c']) and isset($_GET['id_classe'])  )
{
	
	for($i=1; $i<=10; $i++)
	{$v=0;
		if (mysqli_query($mysqli, "update emploi_temps set heure='".$_GET[''.$i.'l_1c']."',lundi='".$_GET[''.$i.'l_2c']."',mardi='".$_GET[''.$i.'l_3c']."',mercredi='".$_GET[''.$i.'l_4c']."',jeudi='".$_GET[''.$i.'l_5c']."',vendredi='".$_GET[''.$i.'l_6c']."',samedi='".$_GET[''.$i.'l_7c']."', date_enre_emploi_temps='".time()."' where id_classe='".$_GET['id_classe']."' and numero_horaire='".$i."'"))
		{ $v=1; }
		else {$v=0;}
	}
	if($v==1){
		echo '<script language="javascript"> alert("Enregistrement réussi !!!");</script>';}
			else {
				echo '<script language="javascript"> alert("Erreur lors de l\'enregistrement !!!");</script>';}

	
}

?>