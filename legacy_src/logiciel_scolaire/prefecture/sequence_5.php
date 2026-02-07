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

      	  function generer_bull_tous_eleve(a, b){
		$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('../fpdf/fpdf_bull_sequence_1_tous.php',{generer_bull_tous_eleve:a, id_sequence_generer:b},function(data){
		//$('#profil').hide();
		$('#div_confirm_supprime').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
			$('#confirmation_generer_bull_tous_eleve').show(); //on affiche le 
		});
		  }

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
var numero_sequence=5;
var numero_trimestre=3;
if (affiche_eleve!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{sequence_1:affiche_eleve, numero_sequence:numero_sequence, numero_trimestre:numero_trimestre},function(data){
		
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
                     <h2><?php echo $prefecture; //variable comportant le nom de la section ?> / Notes des élèves</h2>   
                       
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
 ?>
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
                <div class="row" >
                    <div class="col-md-12 col-sm-12 col-xs-12">
                    <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
 
                    
                    <div class="col-md-12 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                    <h4 style="color:#03F">Notes séquence N°5</h4>
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
<?php
if(isset($_GET['id_sequence'])  )
{		$numero_sequence=$_GET['id_sequence'];
		$numero_trimestre=$_GET['id_trimestre'];
		$id_classe=$_GET['id_classe'];
		//0---------on cree tout les tableau qui contiendront les valeurs envoyées
		$tab_ID_ele=array();$tab_note_mat=array();$tab_ID_mat=array();
		//0.........fin de la creation des tableau
//-----------------------------------------------------------------------------------------------------------------------------------------------------
	//1-----------on compte le nombre d'élève de la classe puis on recupère tous les id--------
	    $t=mysqli_query($mysqli, "select *from eleve where id_classe=$id_classe and visible_eleve!='non' order by nom_eleve asc");
	 $compteur=mysqli_num_rows($t);//on compte lenombre d'eleve enregistre dans l classe                                       
    for($i=1; $i<=$compteur; $i++)
	{
		$tab_ID_ele[$i]=$_GET['id_eleve_'.$i.'L'];
	}

	//1-----------fin de la recuperation des id des élèves--------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------
	//2-----------on compte le nombre de matière dispensée par l'enseignant. pour chaque matière on recupère la note qui a été entrée
	$id_statut_enseignant=$_SESSION['id_membre_ens'];
		$t_idpersonnel=mysqli_fetch_array(mysqli_query($mysqli, "SELECT id_personnel FROM statut_personnel WHERE id_statut_personnel=$id_statut_enseignant "));

  $req_mat=mysqli_query($mysqli, "select *from affectation_matiere where id_classe=$id_classe and id_enseignant='".$t_idpersonnel['id_personnel']."'");

  $jjj=0; $verification=0;
		while ($tab_mat=mysqli_fetch_array($req_mat)){ $jjj++;
				$tab_ID_mat[$jjj]=$_GET['id_matiere'.$jjj.'C'];
		       for($ii=1; $ii<=$compteur; $ii++)
				{
					$tab_note_mat[$ii][$jjj]=$_GET['note_'.$ii.'L_'.$jjj.'C'];
				}  
           } //fin de la boucle while ($tab_mat=mysql_fetch_array($ti)) 
	//2-----------fin de la recuperation des notes--------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------
	 //3............On cree des nouvelle propriétés a la table note............ces propriete sont les matiere de la classe
	 	//3.1.....on parcour le tableau matière...
		 foreach($tab_ID_mat as $v)
		 {
			 $nom_mat=mysqli_fetch_array( mysqli_query($mysqli, $mysqli, "select *from matiere where id_matiere=$v and id_classe=$id_classe"));
			  $nom_matiere=majuscule_sans_axcent($nom_mat['nom_matiere']);//nom de la matiere ne majuscule sans axcen.
	   mysqli_query($mysqli, "ALTER TABLE note ADD $nom_matiere VARCHAR( 10 ) NOT NULL AFTER date_enre_note ");
		 }
	 //3..........fin de la creation des proprietes........................................................................
//--------------------------------------------------------------------------------------------------------------------------------------------------------
	 //4...........insertion des notes si elle ne sont pas encore insérée........
	 $c=0;
	 foreach($tab_ID_mat as $v)
		 { 
		 $nom_mat=mysqli_fetch_array( mysqli_query($mysqli, "select *from matiere where id_matiere=$v and id_classe=$id_classe"));
			  $nom_matiere=majuscule_sans_axcent($nom_mat['nom_matiere']);//nom de la matiere ne majuscule sans axcen.
			  ; $c++;
	 		for ($in=1; $in<=$compteur; $in++)
	 		{ //---------------------------------------------------------------------------------
				 $nombre_note=mysqli_num_rows( mysqli_query($mysqli, "select *from note where id_eleve='".$tab_ID_ele[$in]."' and id_sequence='".$numero_sequence."' and id_trimestre='".$numero_trimestre."'"));//on compte nombre d'enregistrement déja effectue
				if ($nombre_note==0)
				{ //dans ce cas, on fait un insert car c'est la premiere fois
		 		if (mysqli_query($mysqli, "insert into note (id_eleve, id_sequence, id_trimestre, date_enre_note, $nom_matiere) value('".$tab_ID_ele[$in]."','".$numero_sequence."','".$numero_trimestre."','".time()."','".$tab_note_mat[$in][$c]."')"))
		 		{$verification=1;}
		 		else
		 		{$verification=0;}
				}
				else
				{ //si ($nombre_note!==0) on fait un update
					if (mysqli_query("update note set  id_eleve='".$tab_ID_ele[$in]."', id_sequence='".$numero_sequence."', id_trimestre='".$numero_trimestre."', date_enre_note='".time()."', $nom_matiere='".$tab_note_mat[$in][$c]."' where  id_eleve='".$tab_ID_ele[$in]."' and id_sequence='".$numero_sequence."' and  id_trimestre='".$numero_trimestre."' "))
		 		{$verification=1;}
		 		else
		 		{$verification=0;} 
				}
	 		}  //------fin de la boucle for ($in=1; $in<=$compteur; $in++)-----------------------
		 }
	 //4...........fin de l'insertion des notes....................................
	 if ($verification==1)
	 {echo '<script language="javascript"> alert("Enregistrement réussi !!!"); </script>';}
	 else
	 {echo '<script language="javascript"> alert("Erreur pendant l\enregistrement !!!"); </script>';}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
}
    ?>