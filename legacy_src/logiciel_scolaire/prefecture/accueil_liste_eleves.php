<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="inscriptioneleve_files/formoid1/formoid-solid-blue.css" type="text/css" />
    <title>GESTION DES ETUDES</title>
      <?php include "php/head_prefecture.php"; ?>
      
       <?php  
	  $s10=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $s11=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $nu=mysqli_num_rows($s10);
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
       <?php include "php/menu_prefecture.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $prefecture; //variable comportant le nom de la section ?> / Liste des élèves</h2>   
                       
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
<div class="col-md-4" class="form-group">
   <select name="classe" class="selectpicker form-control" id="div_affiche_eleve"  onChange="affichage_eleve(this.value);" >
 <option value="" >.......... Sélectionnez une salle de classe ..........</option>
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
                     <div class="col-sm-8">
                        <input type="text" name="search" id="search"  placeholder="Recherchez un élève (Saisir le nom)." class="form-control" />
                     </div>
                     <div class="col-sm-3 col-sm-offset-0" style="margin-left:-65px;">
                        <button type="submit"  class="btn btn-info"><b class="fa fa-search"></b></button>
                     </div>
              </div>
</div>
</div>

       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
      
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