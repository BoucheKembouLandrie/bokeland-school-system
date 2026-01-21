<?php include "../php/configurations_etablissement.php"; ?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="inscriptioneleve_files/formoid1/formoid-solid-blue.css" type="text/css" />
    <title>GESTION SCOLARITE</title>
      <?php include "php/head_scolarite.php"; ?>
      <style>
	  #loader{
	width: 100%;
	display: none;}
	  </style>
       
      <script language="javascript">

//----------------------------------------------------------------------------------------------------------}---------
    function bilan_inscription(){
var date_min=$("#div_date_min").val();
var date_max=$("#div_date_max").val();
var a;
if ((date_min!=="")&&(date_max!=="")){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	if ((date_min>date_max)){a=date_min; date_min=date_max; date_max=a; }
	
	$.post('post.php',{date_max:date_max, date_min:date_min},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		
		
	});}
	else {}
}
function generer_liste_appel(id_classe_liste_a_generer){
	if (id_classe_liste_a_generer!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	
		document.location.href("../fpdf/fpdf_liste_appel.php");
		  //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		
	}
}
/////////////----------------------------------------------------------------------------------------------------------------------
	function show_confirm_supprime(){$('#confirm_supprime').show();//on affiche l'alert
		}
//-----------------------------------------------------------------------------------------------------------------------------------
	function hide_confirm_supprime(){$('#confirm_supprime').hide();//on affiche l'alert
		}
//---------------------------------------------------------------------------------------------------------------------------------------
	function hide_profil(){$('#profil').hide();}
//------------------------------------------------------------------------------------------------------------------------------------------
	function hide_modif_profil(){$('#modif_profil').hide();}
</script>
</head>
       <?php  
	  $s9=mysqli_query($mysqli, "SELECT max(date_enre_eleve) as date_max FROM eleve ");
	  $s10=mysqli_query($mysqli, "SELECT min(date_enre_eleve) as date_min FROM eleve ");
	  $s12=mysqli_query($mysqli, "SELECT date_enre_eleve FROM eleve");
	  $s11=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $nu=mysqli_num_rows($s10);
	  
	  
	  
	  ?>
<body >

    <div id="wrapper">
       <?php include "php/menu_scolarite.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $scolarite; //variable comportant le nom de la section ?> / Bilan d'inscription</h2>   
                       
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
 <form action="#" method="post" >
<div class="col-md-4" class="form-group">
  <strong>Du: </strong> <select name="classe" class="selectpicker form-control" id="div_date_min"  onChange="bilan_inscription(this.value);" >
 <option value="">---------------Date de début---------------</option>
 <?php 
 $t10=mysqli_fetch_array($s10);$t9=mysqli_fetch_array($s9);
 $date_min=$t10['date_min'];
		$date_max=$t9['date_max'];
		 $d=$date_min;$d2=$date_min;
		 $pas=3600*24*6;
 while ($d<=$date_max) {  ?>
    <option value="<?php echo $d ?>" >
		<?php 
		if ($d<$date_max)echo date_francais($d); 
		$d=$d+$pas
		?>
    </option>
<?php } ?>
      </select>
</div>
  <div class="col-md-4" class="form-group">
<strong>Au: </strong>    <select name="date_min" class="selectpicker form-control" id="div_date_max"  onChange="bilan_inscription(this.value);" >
<option value="">---------------Date de fin---------------</option>
 <?php  while ($d2<=$date_max) {  ?>
    <option value="<?php echo $d2;  ?>" >
		<?php 
		if ($d2<$date_max)echo date_francais($d2); 
		$d2=$d2+$pas;
		?>
    </option>
    <option value="<?php echo $date_max  ?>" >
		<?php echo date_francais($date_max); ?>
    </option>
<?php } ?>
      </select>
</div>

</form>
</div>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
                    <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
  <div  class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Classe / Effectif</h4>
                            <?php  while($t11=mysqli_fetch_array($s11)){ ?>
                            <?php  $id=$t11['id_classe']; $visible="non";
							$nbre=mysqli_num_rows(mysqli_query($mysqli, "SELECT *FROM eleve WHERE id_classe = $id and visible_eleve!='$visible'"));
							 ?>
               <a href="#"   style="color:#FFF"><h5><?php echo $t11['nom_classe']." ".$t11['nom_serie'].$t11['numero_classe'].'  /<strong> '.$nbre.'</strong>'; ?></h5></a>
			   <?php } ?>
                             
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                      
                        </div>
                    </div>
                    </div>
                    
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                    <?php if($nu==0) echo '<h4 style="color:#03F">Option non disponible. Aucune classe n\'est enrégistrée.</h4>'; else{} ?>
                        <div class="panel-heading">
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive" id="resultat">
                                
                            </div>
                        </div>
                    </div>
                    
                    </div>
                </div>
                <?php ///////////////////////////////////////////c'est dans ces div que nous allons afficher le profil de l'eleve///////////////?>
<div id="div_profil_eleve">	</div>
<div id="div_modif_profil_eleve"> </div>
<div id="div_confirm_supprime"> </div>
<?php ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////?>
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
    <script src="contenu/js/custom.js"> </script>
 
    
    </script>
   
    
 
  
  
   
</body>
</html>
<?php // modification des information de l'élève

?>