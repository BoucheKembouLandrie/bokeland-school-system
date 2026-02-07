<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="inscriptioneleve_files/formoid1/formoid-solid-blue.css" type="text/css" />
    <title>GESTION SCOLARITE</title>
      <?php include "php/head_scolarite.php"; ?>
      
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
function recu_eleve(a){		
var id_eleve_recu=a;
if (id_eleve_recu!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{id_eleve_recu:id_eleve_recu},function(data){
		$('#modif_profil').hide();
		$('#profil').hide();
		$('#div_profil_eleve').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
			$('#profil').show(); //on affiche le 
		});}
}
//-----------------------------------------------------------------------------------------------------------------------
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
       <?php include "php/menu_scolarite.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $scolarite; //variable comportant le nom de la section ?> / Accueil</h2>   
                       
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
 <form action="#" method="post" >
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
  


<div  style="font-size:14px" class="col-md-7 col-md-offset-1" class="form-group" >
     
<input  type="text" id="search" width="100%"  class="form-control" maxlength="64" placeholder="Recherchez le profil d'un élève ici. (Saisir le nom)." />

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
                        <div class="panel-body" >
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Classe / Effectif</h4>
                            <?php  while($t11=mysqli_fetch_array($s11)){ ?>
                            <?php  $id=$t11['id_classe']; $visible="non";
							$nbre=mysqli_num_rows(mysqli_query($mysqli, "SELECT *FROM eleve WHERE id_classe = $id and visible_eleve!='$visible'"));
							 ?>
               <a href="#"   style="color:#FFF;" ><h5 style="text-align:left;"><?php echo $t11['nom_classe']." ".$t11['nom_serie'].$t11['numero_classe'].'  /<strong> '.$nbre.'</strong>'; ?></h5></a>
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
    <script src="php/js index.js">
    
    </script>
   
    
 
  
  
   
</body>
</html>
<?php // modification des information de l'élève

if(isset($_POST['nom']) and isset($_POST['prenom']) and isset($_POST['date_naissance']) )
{     $nom=$_POST['nom'];
	  $prenom=$_POST['prenom'];
	  $date_naissance=$_POST['date_naissance'];
	  $lieu_naissance=$_POST['lieu_naissance'];
	  $sexe=$_POST['sexe'];
	  $contact=$_POST['contact'];
	  $redouble=$_POST['redouble'];
	  
	  $temps=time();
	  include "php/upload_photo_modif_eleves.php";
	  
	 // $matricule=" ";
	  //$pass=code_aleatoire(8);//on genere un mot de passe aléatoire
	  $id_classe=$_POST['classe'];
	if (mysqli_query($mysqli, "update eleve set nom_eleve='".$nom."',prenom_eleve='".$prenom."',date_naiss_eleve='".$date_naissance."',lieu_naiss_eleve='".$lieu_naissance."',contact_parent_eleve='".$contact."',sexe_eleve='".$sexe."',redouble_eleve='".$redouble."' where id_eleve=$id_eleve "))
	  	{
			
			echo $message = '<script language="javascript"> alert("Modification éffectuée !!!");</script> ';}
	else {echo $message = '<script language="javascript"> alert("Erreur pendant la modification.");</script> ';}
}

?>