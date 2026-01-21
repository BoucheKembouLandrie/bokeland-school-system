<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style>
      #loader{
		  display:none;}
		#profil_enseignant{
		  display:none;}
      </style>

    <title>ELEVES</title>
      <?php include "php/head_eleves.php"; ?>
      <script> //document.location.href="accueil_scores.php";
      function affichage_profil(a){
	var id_enseignant_profil=a;
	if (id_enseignant_profil!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier

	$.post('post.php',{id_enseignant_profil:id_enseignant_profil},function(data){
		
		$('#profil_enseignant').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		});
}}
	
		</script>
      
</head>

<body>
    <div id="wrapper">
       <?php include "php/menu_eleves.php"; 
	  ?>  
     	<div id="page-wrapper" >
            <div id="page-inner">
    			<div class="row" >
                 <div class="col-md-12">
                     <h2><?php echo $eleves; //variable comportant le nom de la section ?> / Accueil</h2>   
      
					</div></div>
                       
                   <hr />
                   
                    <hr />
                <div class="row">
      
<div class="col-md-4" class="form-group">
   
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
                               <?php
									$ti=mysqli_query($mysqli, "select *from personnel P, statut_personnel S  where S.statut='Enseignant' and P.id_personnel=S.id_personnel order by nom_personnel, prenom_personnel asc");
		
		echo'					
									
									
									<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms & Prénoms</th>
											<th>Matricule</th>
											<th>#</th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($pe=mysqli_fetch_array($ti)){$i++;
		/*//on selectionne les info du personnel
		$pe=mysql_fetch_array(mysql_query("select *from personnel P, statut_personnel S where P.id_personnel='".$tt['id_enseignant']."' order by nom_personnel, prenom_personnel asc"));
		//on selectionne la matiere dispensee
		$mat=mysql_fetch_array(mysql_query("select *from matiere M where M.id_matiere='".$tt['id_matiere']."' "));*/
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.@sexe($pe['sex_personnel']).' '.$pe['nom_personnel'].' '.$pe['prenom_personnel'].'</td>
											<td>'.$pe['matricule_statut_personnel'].'</td>
											<td>
											<a href="#" onClick="affichage_profil('.$pe['id_personnel'].');"><img src="images/image connexion.png" height="20" width="20"/></a>
											</td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';?>
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