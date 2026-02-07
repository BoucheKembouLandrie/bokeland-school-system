<?php include "../../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION SCOLARITE</title>
     <?php include "php/head_admin.php"; ?>
</head>

<?php 
//on sélectionne les administrateur crée pour l'affichage.
$select_scolarite=mysqli_query($mysqli, "select *from scolarite order by id_scolarite asc");
 ?>
<body>
    <div id="wrapper">
       <?php include "php/menu_admin.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><h2><?php echo @$page_admin //variable comportant le nom de la section ?> / creation scolarité </h2>   </h2>   
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
                
         <?php include "formulaire_creation_scolarite.php"; ?> 
         
         <?php //include "formulaire creation prefecture.php"; ?> 
                    </div>
                    </div>
                </div>

                
                    <div class="col-md-3 col-sm-12 col-xs-12">
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h3>Commentaire </h3>
                            Vous êtes sur le point de créer le module qui vous permettra de gérer le volet scolaire de votre établissement. ce module ne pourra être crée qu'après création d'un établissement et d'une année scolaire.</br> <h4>Pour créer un établissement</h4>, allez dans le menu de gauche, sur: Gérer le site web / info établissement.</br> Pour créer une année scolaire, allez dans le menu de gauche, sur: Création / année scolaire.
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                                                           <form action="" method="POST">
                            <div class="col-xs-pull-1" class="form-group">
     <input type="submit" name="creation" value="scolarite" class="btn btn-info" />
     						</div>
     						</form>      
                                <?php while($tab_scolarite=mysqli_fetch_array($select_scolarite)){ ?><h5><a href="#" style="color:#000"><?php echo $tab_scolarite['libelle']." / ".$tab_scolarite['montant_inscription']." / ".$tab_scolarite['nbr_tranche']; ?></a></h5><?php } ?>
                            
                            
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
