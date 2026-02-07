<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
     <?php include "php/head_prefecture.php"; ?>
     <?php 
$s=mysqli_query($mysqli, "select distinct nom_matiere from matiere order by nom_matiere asc");
?>
</head>

<body>
    <div id="wrapper">
       <?php include "php/menu_prefecture.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><h2><?php echo @$prefecture //variable comportant le nom de la section ?> / Création des matières </h2>   </h2>   
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
               
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                          
                    <?php include "formulaire_creation_matieres.php"; ?> 
                    
                    </div>
                    
                </div>
                
                 <!-- /. ROW  -->
                        
                 <!-- /. ROW  -->           
    </div>
    <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Commentaire</h4>
                           Saisir le nom de la matère.</br><h4>Liste des matières</h4>
                            <?php while($t=mysqli_fetch_array($s)){ ?>
		<li style="text-align:left"><?php echo $t['nom_matiere']; ?></li>
		<?php } ?>
                            
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                            
                            
                        </div>
                    </div>
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
