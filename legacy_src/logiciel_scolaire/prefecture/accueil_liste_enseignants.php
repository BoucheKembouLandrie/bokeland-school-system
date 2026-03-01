<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION DES ETUTDES</title>
      <?php include "php/head_prefecture.php"; ?>
      <style>
      #loader{
		  display:none;}
		#profil_enseignant{
		  display:none;}
      </style>
      <script language="javascript">
      function select_classe(){
var liste_enseignant_classe=$("#classe").val();
if (liste_enseignant_classe!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier

	$.post('post.php',{liste_enseignant_classe:liste_enseignant_classe},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		});
}
}
function affichage_profil(a){
	var id_enseignant_profil=a;
	if (id_enseignant_profil!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier

	$.post('post.php',{id_enseignant_profil:id_enseignant_profil},function(data){
		
		$('#profil_enseignant').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		});
}
	}
	function hide_profil_enseignant(){
		$('#profil_enseignant').hide();
		}
      </script>
<?php  
	  $s10=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $s11=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $nu=mysqli_num_rows($s10);
	  ?>
<body>
    <div id="wrapper">
       <?php include "php/menu_prefecture.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $prefecture; //variable comportant le nom de la section ?> / Liste des enseignants </h2>   
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
      
<div class="col-md-4" class="form-group">
   <select name="classe" class="selectpicker form-control" id="classe"  onChange="select_classe(this.value);" >
 <option value="" >..... Sélectionnez une salle de classe ......</option>
 <option value="all">Tous les enseignants de l'établissement</option>
 <?php  while($t10=mysqli_fetch_array($s10)){ ?>
    <option value="<?php echo $t10['id_classe']; ?>" >
		<?php if ($t10['nom_serie']=="")  echo $t10['nom_classe'].' '.$t10['numero_classe'];
		      else echo $t10['nom_classe']." ".$t10['nom_serie']; echo ' '.$t10['numero_classe']; ?>
    </option>
    
<?php }?>

      </select>
</div>
  


<div  class="col-md-7 col-md-offset-1" class="form-group">
     
<div class="row">
                  
</div>
</div>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive" id="resultat">
                               
                            </div>
                        </div>
                    </div>
                    
                    </div>
                    <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
                    <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                     <div>
                        	Ici chaque eleve a la possibilite de consulter les enseignants de sa salle de classe
                        </div>
                            
                        </div>
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
		<div id="profil_enseignant"></div>
        
        
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
    
   
</body>
</html>
