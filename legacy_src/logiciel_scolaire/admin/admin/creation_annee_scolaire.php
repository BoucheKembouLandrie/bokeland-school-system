<?php include "../../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION SCOLARITE</title>
     <?php include "php/head_admin.php"; ?>
</head>

<?php 
//on sélectionne les administrateur crée pour l'affichage.
$select_annee_scolaire=mysqli_query($mysqli, "select *from annee_scolaire order by id_annee_scolaire asc");
 ?>

<body>
    <div id="wrapper">
       <?php include "php/menu_admin.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><h2><?php echo @$page_admin //variable comportant le nom de la section ?> / Création année scolaire </h2>   </h2>   
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
               
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                          
                    <?php include "formulaire_creation_annee _scolaire.php"; ?> 
                    </div>
                    </div>
                    </div>
                    <div class="col-md-3 col-sm-12 col-xs-12">
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Liste des classes </h4>
                            Entrez le nom de l'année scolaire. ce nom peut simplement être donné de la manière suivante: (Année en cour)/(année prochaine). Exemple: 2017/2018.
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                              <form action="" method="POST">
                            <div class="col-xs-pull-1" class="form-group">
     <input type="submit" name="creation" value="annee scolaire" class="btn btn-info" />
     						</div>
     						</form>      
                                <?php while($tab_annee_scolaire=mysqli_fetch_array($select_annee_scolaire)){ ?><h5><a href="#" style="color:#000"><?php echo $tab_annee_scolaire['nom_annee_scolaire']; ?></a></h5><?php } ?>
                            
                            
                        </div>
                    </div>
                    </div>

                
                 <!-- /. ROW  -->
              </div>          
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
