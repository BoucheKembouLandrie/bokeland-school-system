<?php include "../../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION SCOLARITE</title>
      <?php include "php/head_admin.php"; ?>
       <?php  
	   $s10=mysqli_query($mysqli,"SELECT *FROM personnel,statut_personnel where personnel.id_personnel=statut_personnel.id_personnel order by nom_personnel asc ");
	  $nu=mysqli_num_rows($s10);
	  ?>
      <style>
	  #loader{
		  display:none;}
	  </style>
      	<script language="javascript">
        function activer_personnel(a){
			var confirmation =confirm("Voulez-vous vraiment activer ce personnel?")
			if(confirmation)
			{
				if (a!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{active_statut_personnel:a},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		});}
				}
				else{
					document.location.href="index.php";}
			}
        function desactiver_personnel(a){
			var confirmation =confirm("Voulez-vous vraiment désactiver ce personnel?")
			if(confirmation)
			{
				if (a!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{desactive_statut_personnel:a},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		});}}
				else{
					document.location.href="index.php";}
			}
        </script>
</head>

<body>
    <div id="wrapper">
       <?php include "php/menu_admin.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo @$page_admin //variable comportant le nom de la section ?> /  Accueil </h2>   
                       
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
               
<?php  
	   $s4=mysqli_query($mysqli,"SELECT distinct(nom_matiere) FROM matiere order by nom_matiere asc ");
	  ?>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
  
  <div class="panel panel-primary text-center no-boder bg-color-green">
  
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Liste des matières</h4>
                            <?php $i=0; while($t4=mysqli_fetch_array($s4)){ $i++;?>
                            <h5 style="text-align:left"><?php echo $i.". ". $t4['nom_matiere'];?></h5>
                            <?php }?>
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                        </div>
                    </div>
                    </div>
                    
                    <div class="col-md-9 col-sm-12 col-xs-12">
                    <div class="panel panel-default">
                    <?php if($nu==0) echo '<h4 style="color:#03F">Option non disponible. Aucun personnel n\'est enrégistré.</h4>'; else{ 
	?>
                        <div class="panel-heading" >
                        <div id="resultat"></div>
                        <h4 style="color:#03F">Liste du personnel.</h4>
                        <div id="loader">
                           <img src="images/loader.gif" height="20" width="20"/>
                        </div>
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms & Prénoms</th>
                                            <th>Statut</th>
                                            <th >Matricule</th>
                                            <th >Pass</th>
                                             <th >activer/désactiver</th>
                                             <th>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <?php $i=0; while($t10=mysqli_fetch_array($s10)){ $i++;?>
                                    
                                     <tr>
                                            <td><?php echo $i;?></td>
                                       <td><?php echo sexe($t10['sex_personnel']).$t10['nom_personnel']; echo ' '.$t10['prenom_personnel']; ?></td>
                                       <td><?php echo $t10['statut']; ?></td>
                                       <td><?php echo $t10['matricule_statut_personnel']; ?>.</td>
                                       <td><?php echo $t10['pass_statut_personnel']; ?></td>
                                       <td>
                                       <?php if($t10['acces']==1) { ?>
                                       <a href="#"><img src="images/cadenas-ouvert.png" onClick="desactiver_personnel(<?php echo $t10['id_statut_personnel']; ?>);" height="15" width="15"/></a>
                                       <?php }else{ ?>
                                       <a href="#"><img src="images/cadenas-ferme.png" onClick="activer_personnel(<?php echo $t10['id_statut_personnel']; ?>);" height="15" width="15"/></a>
                                       <?php }//fin if ?>
                                        </td>
                                       <td><a href="modifie_personnel.php"><img src="images/edit.png" height="15" width="15"/></a></td>
                                      </tr>
                                        <?php }?>
                                       
                                      
                                
                                    </tbody>
                                </table>
                            </div>
                        </div>
                                       <?php } //fin de la condition if($nu==0)?>
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
