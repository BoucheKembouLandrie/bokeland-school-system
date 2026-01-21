<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION DES ENSEIGNANTS</title>
      <?php include "php/head_enseignants.php"; ?>
      
        <?php   $id=$_SESSION['id_membre_ens'];
		$t_idpersonnel=mysqli_fetch_array(mysqli_query($mysqli,"SELECT id_personnel FROM statut_personnel WHERE id_statut_personnel=$id "));
	  $s10=mysqli_query($mysqli,"SELECT distinct id_classe FROM affectation_matiere WHERE id_enseignant='".$t_idpersonnel['id_personnel']."' ");
	 ?>
      <style>
	  #loader{
		  display:none;}
	  </style>
      <script language="javascript">
      function select_classe_emploi_temps(){
var affiche_eleve=$("#classe").val();
var numero_sequence=1;
var numero_trimestre=1;
if (affiche_eleve!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{bull_sequence_1:affiche_eleve, bull_numero_sequence:numero_sequence, bull_numero_trimestre:numero_trimestre},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		
		
		});}
}
//----------------------------------------------------------------------------------------------------------------------------------

      </script>
</head>

<body>
    <div id="wrapper">
       <?php include "php/menu_enseignants.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $enseignants; //variable comportant le nom de la section ?> </h2>   
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
              <div class="col-md-4" class="form-group">
   <select name="classe" class="selectpicker form-control" id="classe"  onChange="select_classe_emploi_temps(this.value);" >
 <option value="" >.......... Sélectionnez une salle de classe ..........</option>
 <?php  while($t10=mysqli_fetch_array($s10)){ 
 //on selectionne les classe de l'enseignant
 $s11=mysqli_fetch_array(mysqli_query($mysqli,"SELECT *FROM classe C, serie S WHERE C.id_classe='".$t10['id_classe']."' and C.id_serie = S.id_serie"));
 ?>
    <option value="<?php echo $s11['id_classe']; ?>" >
		<?php if ($s11['nom_serie']=="")  echo $s11['nom_classe'].' '.$s11['numero_classe'];
		      else echo $s11['nom_classe']." ".$s11['nom_serie']; echo ' '.$s11['numero_classe']; ?>
    </option>
<?php }?>
      </select>
</div>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
               <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                    <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
                    <div class="col-md-10 col-sm-12 col-xs-12">
               
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
    
   
</body>
</html>
