<?php include "../../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION SCOLARITE</title>
      <?php include "php/head_admin.php"; ?>
       <?php  
	  $s10=mysqli_query($mysqli, "SELECT *FROM classe C,serie S,cycle Y WHERE C.id_serie = S.id_serie and S.id_cycle = Y.id_cycle ");
	  $nu=mysqli_num_rows($s10);
	  ?>
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
	   $s4=mysqli_query($mysqli, "SELECT *FROM statut_personnel, personnel where statut_personnel.id_personnel=personnel.id_personnel and statut='Enseignant' order by nom_personnel asc ");
	  ?>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Liste des Enseignants</h4>
                            <?php $i=0; while($t4=mysqli_fetch_array($s4)){ $i++;?>
                            <h5 style="text-align:left"><?php echo $i.". ".sexe($t4['sex_personnel'])." ". $t4['nom_personnel'];?></h5>
                            <?php }?>
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                        </div>
                    </div>
                    </div>
                    
                    <div class="col-md-9 col-sm-12 col-xs-12">
                    <div class="panel panel-default">
                    <?php if($nu==0) echo '<h4 style="color:#03F">Option non disponible. Aucune classe n\'est enrégistrée.</h4>'; else{ ?>
                        <div class="panel-heading">
                           <h4 style="color:#03F">Liste des salles de classes.</h4>
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms</th>
                                            <th>Cycle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <?php $i=0; while($t10=mysqli_fetch_array($s10)){ $i++;?>
                                     <tr>
                                            <td><?php echo $i;?></td>
                                       <td><?php echo $t10['nom_classe']." ".$t10['nom_serie']; echo ' '.$t10['numero_classe']; ?></td>
                                       <td><?php echo $t10['nom_cycle']; ?></td>
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
