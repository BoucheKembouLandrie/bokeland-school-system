<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION DES ETUTDES</title>
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
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $prefecture; //variable comportant le nom de la section ?> / Gestion des titulaires </h2>   
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
<div class="col-md-4" class="form-group">
</div>
  

<div  class="col-md-7 col-md-offset-1" class="form-group">
     
</div>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
                    <div class="col-md-3 col-sm-12 col-xs-12">
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>

                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                            
                        </div>
                    </div>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                           <strong style="font-size:20px">Affectation des matières aux enseignants</strong>
                        </div>
                        <div class="panel-body">
       <?php  
	  $s10=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $s11=mysqli_query($mysqli, "SELECT *FROM classe,serie WHERE classe.id_serie = serie.id_serie ");
	  $nu=mysqli_num_rows($s10);
	  ?> 
                            <div class="table-responsive" id="resultat">
                              <table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Classes</th>
											<th>Professeur titulaire</th>
                                            <th>Matricule</th>
											 <th >#</th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($tt=mysqli_fetch_array($t)){$i++;
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>
											<th>Matière</th>
                                            <td>'.$tt['matricule_eleve'].'</td>
                                            <td>'.$tt['pass_eleve'].'</td>
                                            <td>
											   <a href="#" onClick="affichage_profil('.$tt['id_eleve'].');"><img src="images/image connexion.png" height="20" width="20"/></a>
											   <a href="#" onClick="modif_profil('.$tt['id_eleve'].');"><img src="images/edit.png" height="15" width="20"/></a>
											    <a href="#" onClick="recu_eleve('.$tt['id_eleve'].');"><img src="images/recu.png" height="25" width="30"/></a>
											   <a href="#" onClick="confirm_supprime('.$tt['id_eleve'].');"><img src="images/false.png" height="10" width="10"/></a>
											</td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';  
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
    
   
</body>
</html>
