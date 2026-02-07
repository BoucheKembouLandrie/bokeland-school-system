<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION DES ETUDES</title>
      <?php include "php/head_prefecture.php"; ?>
      <style>
      #loader{
		  display:none;}
      </style>
      <script language="javascript">
      function select_classe(){
var id_classe=$("#classe").val();
if (id_classe!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{id_classe:id_classe},function(data){
		
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
       <?php  
	  $s10=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $s11=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $nu=mysqli_num_rows($s10);
	  ?> 
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $prefecture; //variable comportant le nom de la section ?> </h2>   
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
<div class="col-md-4" class="form-group">
   
     <select name="classe" class="selectpicker form-control" id="classe"  onChange="select_classe(this.value);" >
 <option value="" >..... Sélectionnez une salle de classe ......</option>
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
</div>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
                   
                    <div class="col-md-12 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                           <strong style="font-size:20px">Affectation des matières aux enseignants</strong>
						   
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive" id="resultat">
                                
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
    <script src="contenu/js/custom.js" ></script>
    
   
</body>
</html>
<?php if(isset($_GET['id_matiere1']) and isset($_GET['id_groupe1']) and isset($_GET['id_classe_affectation'])and isset($_GET['id_enseignant_titulaire'])and isset($_GET['id_enseignant1'])and isset($_GET['coef1']))
{	
	 $id_classe_affectation=$_GET['id_classe_affectation'];
	 $id_enseignant_titulaire=$_GET['id_enseignant_titulaire'];
	 //on fai un update dans la table classe pour donner le prof titulaire
	 if (mysqli_query($mysqli, "update classe set id_enseignant_titulaire=$id_enseignant_titulaire where id_classe=$id_classe_affectation "))
	 {//si l'enregistrement du prof titulaire s'est bien effectue, on enregistre les coef et les enseignant de chaque matiere
	 	//1. on compte le nombre de matiere de la salle de classe
		//c'est ce nombre de matiere qu'on comptera qui nous renseignera sur le nombre de variable matière, coef et enseignants qui existent
	$compt=mysqli_query($mysqli, "select *from matiere where id_classe=$id_classe_affectation ");
	 $verification=0;
	 //on déclare trois tableaux 
	$tab_coef=array(); $tab_enseignant=array(); $tab_matiere=array(); $tab_groupe=array();
	 $com=mysqli_num_rows(mysqli_query($mysqli, "select *from matiere where id_classe=$id_classe_affectation "));
	 //on recuper toutes les valeurs qui ont été envoye
	 for ($c=1; $c<=$com; $c++)
	 {
	 	$tab_coef[$c]=$_GET['coef'.$c.'']; 
		$tab_enseignant[$c]=$_GET['id_enseignant'.$c.''];
		 $tab_matiere[$c]=$_GET['id_matiere'.$c.''];
		 $tab_groupe[$c]=$_GET['id_groupe'.$c.''];
	 }//fin de la boucle for($c=1; $c<=$compt; $c++)
	 $c=0;
	 while ($a=mysqli_fetch_array($compt))
	 { $verification=0; $c++;
		 //on enregistre les informations dans la table affectation matiere
		 if (mysqli_query($mysqli, "update affectation_matiere set coef_matiere='".$tab_coef[$c]."', id_enseignant='".$tab_enseignant[$c]."' where id_matiere='".$tab_matiere[$c]."' and id_classe='".$id_classe_affectation."' "))
		 {		$verification=1; }//fin du if (mysql_query("update affectation_matiere........
		  else {		$verification=0; }//fin du if (mysql_query("update affectation_matiere........
		  
		//insertion des groupe dans la table groupe----------------	
		if (mysqli_query($mysqli, "update groupe set numero_groupe='".$tab_groupe[$c]."'where id_matiere='".$tab_matiere[$c]."' and id_classe='".$id_classe_affectation."' "))
		 {		$verification=1; }//fin du if (mysql_query("update affectation_matiere........
		  else {		$verification=0; }//fin du if (mysql_query("update affectation_matiere........
		//------------------------------------------------
	  }//fin de la boucle while (mysql_fetch_array($comp))
	  
	 }//fin du  if (mysql_query("update classe set .....
	
	//on verifi si tous s'est bien passe 
	  if ($verification==1)
		 {	echo'<script language="javascript"> alert("Enregistrement réussi !!!"); </script>'; }//fin du if (mysql_query("update affectation_matiere........
		  else {echo'<script language="javascript"> alert("Erreur pendant l\'enregistrement !!!"); </script>'; }//fin du if (mysql_query("update affectation_matiere........
}	
?>