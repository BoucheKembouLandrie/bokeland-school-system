<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="inscriptioneleve_files/formoid1/formoid-solid-blue.css" type="text/css" />
    <title>GESTION DES ENSEIGNANTS</title>
      <?php include "php/head_enseignants.php"; ?>
      
        <?php   $id=$_SESSION['id_membre_ens'];
		$t_idpersonnel=mysqli_fetch_array(mysqli_query($mysqli, "SELECT id_personnel FROM statut_personnel WHERE id_statut_personnel=$id "));
	  $s10=mysqli_query($mysqli,"SELECT distinct id_classe FROM affectation_matiere WHERE id_enseignant='".$t_idpersonnel['id_personnel']."' ");
	 ?>
      <style>
	  #loader{
	width: 100%;
	display: none;}
	#profil{
	width: 100%;
	display: none;}
	#modif_profil{
	width: 100%;
	display: none;}
	#confirm_supprime{
	width: 100%;
	display: none;}
	  </style>
       
      <script language="javascript">

    function supprime_eleve(a){
	hide_confirm_supprime();	
var supprime_eleve=a;
if (supprime_eleve!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{supprime_eleve:supprime_eleve},function(data){
		//$('#profil').hide();
		$('#div_confirm_supprime').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
			$('#confirm_supprime').show(); //on affiche le 
		});}
}
//---------------------------------------------------------------------------------------------------------}---------
//------------------------------------------------------------------------------------------------------------------
    function confirm_supprime(a){
		
var confirm_supprime=a;
if (confirm_supprime!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{confirm_supprime:confirm_supprime},function(data){
		//$('#profil').hide();
		$('#div_confirm_supprime').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
			$('#confirm_supprime').show(); //on affiche le 
		});}
}
//---------------------------------------------------------------------------------------------------------}---------	
//------------------------------------------------------------------------------------------------------------------
    function modif_profil(a){
		
var id_eleve_modif=a;
if (id_eleve_modif!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{id_eleve_modif:id_eleve_modif},function(data){
		$('#profil').hide();
		$('#div_modif_profil_eleve').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
			$('#modif_profil').show(); //on affiche le 
		});}
}
//---------------------------------------------------------------------------------------------------------}---------	  
//------------------------------------------------------------------------------------------------------------------
    function affichage_profil(a){		
var id_eleve_profil=a;
if (id_eleve_profil!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{id_eleve_profil:id_eleve_profil},function(data){
		$('#modif_profil').hide();
		$('#div_profil_eleve').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
			$('#profil').show(); //on affiche le 
		});}
}
//----------------------------------------------------------------------------------------------------------}---------
    function affichage_eleve(){
var affiche_eleve=$("#div_affiche_eleve").val();
if (affiche_eleve!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{affiche_eleve:affiche_eleve},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		
		
		});}
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

<body>

    <div id="wrapper">
       <?php include "php/menu_enseignants.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $enseignants; //variable comportant le nom de la section ?> / Liste des élèves</h2>   
                       
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
<div class="col-md-4" class="form-group">
   <select name="classe" class="selectpicker form-control" id="div_affiche_eleve"  onChange="affichage_eleve(this.value);" >
 <option value="" >.......... Sélectionnez une salle de classe ..........</option>
 <?php  while($t10=mysqli_fetch_array($s10)){ 
 //on selectionne les classe de l'enseignant
 $s11=mysqli_fetch_array(mysqli_query($mysqli,"SELECT *FROM classe C, serie S WHERE C.id_classe='".$t10['id_classe']."'and C.id_serie = S.id_serie"));
 ?>
    <option value="<?php echo $s11['id_classe']; ?>" >
		<?php if ($s11['nom_serie']=="")  echo $s11['nom_classe'].' '.$s11['numero_classe'];
		      else echo $s11['nom_classe']." ".$s11['nom_serie']; echo ' '.$s11['numero_classe']; ?>
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
                <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
                    <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
  <div  class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>      
                        </div>
                        <div>
                        Vous avez la possibilité de voir le profil des élèves de toutes les salles dont vous êtes l'enseignant.
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                      
                        </div>
                    </div>
                    </div>
                    
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                    <h4 style="color:#03F">Liste des élèves.</h4>
                        <div class="panel-heading">
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive" id="resultat">
                                
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
    <script src="php/js index.js">
    
    </script>
   
    
 
  
  
   
</body>
</html>