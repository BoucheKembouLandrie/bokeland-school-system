<?php include "../php/configurations_etablissement.php"; ?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<!--css select eleve insolvable -->
<link rel="stylesheet" href="selcteleveinsovable_files/formoid1/formoid-solid-green.css" type="text/css" />
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
	  </style>
       
      <script language="javascript">

//---------------------------------------------------------------------------------------------------------}---------
    function affichage_eleve_insolvable_select(){
var affiche_eleve_insolvable=$("#tranche").val();
alert(affiche_eleve_insolvable);
/*if (affiche_eleve_insolvable!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{affiche_eleve_insolvable:affiche_eleve_insolvable},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		
		
		});}*/
}
//---------------------------------------------------------------------------------------------------------}---------
    function affichage_eleve_insolvable(){
var affiche_eleve_insolvable=$("#eleve_insolvable").val();
if (affiche_eleve_insolvable!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{affiche_eleve_insolvable:affiche_eleve_insolvable},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		
		
		});}
}
//----------------------------------------------------------------------------------------------------------------------
function generer_liste_appel(id_classe_liste_a_generer){
	if (id_classe_liste_a_generer!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	
		document.location.href("../fpdf/fpdf_liste_appel.php");
		  //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		
	}
}
	function show_alert(){$('#alert').show();//on affiche l'alert
		}
	function hide_alert(){$('#alert').hide();//on affiche l'alert
		}
//----------------------------------------------------------------------------------------------------------------------------------
$('#search_etat').keyup(function(){ //on démare un évènement sur l'id search
	//la fonction keyup nous permet de savoir qu'un utilisateur a apuyé 
	//sur une touche de son clavier
	
	var search=$.trim($("#search_etat").val()); // on déclare une variable et on recupère la valeur entrée
	
	if(search!=="")
	{
		$('#loader').show();
		$.post('post.php',{search:search},function(data){

			$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			$('#loader').hide();
			});
	}
	});
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
                     <h2><?php echo $scolarite; //variable comportant le nom de la section ?> / Etat de paiement</h2>   
                       
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
        <form action="#" method="post" >
<div class="col-md-4" class="form-group">
   <select name="classe" class="selectpicker form-control" id="eleve_insolvable"  onChange="affichage_eleve_insolvable(this.value);" >
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
     
<input  type="text" id="search" width="100%"  class="form-control" maxlength="64" placeholder="Recherchez l'état de paiement d'un élève. (Saisir le nom)" />

</div>

</form>

</div>
       <!-- barre  -->
       
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >	
                    <div class="col-md-3 col-sm-12 col-xs-12">
                    <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Classe / Effectif</h4>
                            <?php  while($t11=mysqli_fetch_array($s11)){ ?>
                            <?php  $id=$t11['id_classe']; $visible="non";
							$nbre=mysqli_num_rows(mysqli_query($mysqli, "SELECT *FROM eleve WHERE id_classe = $id and visible_eleve!='$visible'"));
							 ?>
               <a href="#"  style="color:#FFF"><h5><?php echo $t11['nom_classe']." ".$t11['nom_serie'].$t11['numero_classe'].'  /<strong> '.$nbre.'</strong>'; ?></h5></a>
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
                              <?php // c'est dans cette div que npous mettons les resultat traite par le fichier post.php ?>  
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
    <script src="php/js etat.js"></script>
 <div class="confirm" id="alert">
  <h1><strong>Confirmation</strong></h1>
  <p style=" font-size:16px; text-align:center;">Enregistrement reussi!!!
  <button onClick="hide_alert();">Ok</button> 
  </p>
   
</body>
</html>
