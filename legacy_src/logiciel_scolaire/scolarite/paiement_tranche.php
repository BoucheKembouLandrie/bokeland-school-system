<?php include "../php/configurations_etablissement.php"; ?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION SCOLARITE</title>
      <?php include "php/head_scolarite.php"; ?>
   <?php  
	  $s10=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $s11=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $nu=mysqli_num_rows($s10);
	  
	  $t=mysqli_query($mysqli, "SELECT *FROM classe ");
	  ?>
      	<style>
        #modif_tranche{ display:none;}
        </style>
      <script language="javascript">
      function select_eleve(){
var classe=$("#classe").val();
if (classe!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{classe:classe},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		
		
		});}
}
//-------------------------------------------------------------------------------------------------------------------------------------------
function paiement_tranche_eleve()
{
    var nom_eleve=$("#nom_eleve").val();
    if (nom_eleve!=="")
    {
	   $('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	   $.post('post.php',{nom_eleve:nom_eleve},function(data)
           {
		      $('#resultat_paiement_eleve').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			 //dans la dinv resultat plus précisement dans <ul</ul>
			 $('#loader').hide();//cache le loader quand l'affichage est terminé.
			 
		   });
    }
}
//********-------------------------------------------------------------------------------------------------------------------------------------------
function show_modif_tranche(a,b)
{
    var a=a; var b=b;
	   $('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	     
	   $.post('post.php',{a:a, b:b},function(data)
           {
		      $('#div_modif_tranche').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			 //dans la dinv resultat plus précisement dans <ul</ul>
			 $('#loader').hide();//cache le loader quand l'affichage est terminé.
		     $('#modif_tranche').show();
		   });
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
function hide_modif_tranche()
{$('#modif_tranche').hide();}
      </script>
</head>

<body><a href="a" target="_blank">webmaster freelance</a>



    <div id="wrapper">
       <?php include "php/menu_scolarite.php"; ?>	   	 
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $scolarite; //variable comportant le nom de la section ?>/ Paiement des tranches</h2>   
                       
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                           <form class="formoid-solid-blue" style="background-color:#FFF;font-size:16px;font-family:'Roboto',Arial,Helvetica,sans-serif;color:#34495E;max-width:900px;min-width:150px" method="post" enctype="multipart/form-data">
                           
                           <div class="element-select" id="div_lieu_naissance">
                           <div class="item-cont"><div class="large"><span>
                           <select name="classe" id="classe" required="required" onChange="select_eleve();" >
    <option value="" selected="selected">------------------------ Sélectionnez la salle de classe où se trouve l'élève ------------------------ </option>
		<?php while ($tt=mysqli_fetch_array($t)) {  ?>
        <option value="<?php  echo $tt['id_classe']; ?>"><?php echo $tt['nom_unique_classe'].$tt['numero_classe']; ?></option>
		<?php  } ?>
        </select><i></i><span class="icon-place"></span></span></div></div></div>
                           </form> 
                               
                 <!-- /. ROW  -->
                <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Commentaire</h4>
                        
                             <h4>Classe / Effectif</h4>
                            <?php  while($t11=mysqli_fetch_array($s11)){ ?>
                            <?php  $id=$t11['id_classe']; $visible="non";
							$nbre=mysqli_num_rows(mysqli_query($mysqli, "SELECT *FROM eleve WHERE id_classe = $id and visible_eleve!='$visible'"));
							 ?>
               <a href="#" style="color:#FFF"><h5><?php echo $t11['nom_classe']." ".$t11['nom_serie'].$t11['numero_classe'].' / '.$nbre; ?></h5></a>
			   <?php } ?>
                        </div>
                        
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>     
                        </div>
                    </div>
                    </div>
                   
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                     
                        <div class="panel-body">
                            <div class="table-responsive">
                            <?php include "formulaire_paiement_tranche.php"; ?>
                            <?php ///////////////////////////////////////////div de modification de tranche ?>
                             <div id="div_modif_tranche"></div>  
 <?php ///////////////////////////////////////////div de modification de tranche ?>
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
    <script src="jquery.js"></script>
  
    
   <div class="confirm" id="alert">
  <h1><strong>Confirmation</strong></h1>
  <p style=" font-size:16px;">Enregistrement reussi!!!</p>
  <button onClick="close_alert();">Ok</button>
  
</div>
</body>
</html>
<?php
 //-----------------------------modification des tranche de l'élève	---------------------------------

if( isset($_POST['mon_tranche']) and isset($_POST['id_eleve_tranche'])and isset($_POST['numero_tranche']) )
{$montant=$_POST['mon_tranche']; $id=$_POST['id_eleve_tranche'];$numero=$_POST['numero_tranche'];
	if(mysqli_query($mysqli, "update paiement_tranche set montant_paye=$montant where id_eleve=$id and numero_tranche_paiement=$numero"))
	{echo '<script language="javascript"> alert("Modification éffectuée!!!"); </script>';}
	else {echo '<script language="javascript"> alert("Erreur pendant la modification!!!"); </script>';}
	 
} //---------------------------------------------------------------------------------------------------------------------------------------------------

 ?>