<?php include "../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION DES ETUTDES</title>
      <?php include "php/head_prefecture.php"; ?>
</head>

<body>
    <div id="wrapper">
       <?php include "php/menu_prefecture.php"; ?> 
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $prefecture; //variable comportant le nom de la section ?> / Profil  </h2>   
                        
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
               
                 <!-- /. ROW  -->
               
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                         Mon profil
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Login</th>
                                            <th>Mot de passe</th>
                                            <th >#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
																				<?php $id= $_SESSION['id_membre_pre'];
	  $a=mysqli_fetch_array(mysqli_query($mysqli, "select *from statut_personnel where id_statut_personnel=$id"));
	   ?>
                                            <td><?php echo $a['matricule_statut_personnel']; ?></td>
                                            <td><?php echo $a['pass_statut_personnel']; ?></td>
                                            <td><a href="statut_change_pass.php"><img src="images/edit.png" height="15" width="15"/></a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    </div>
                     <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Commentaire </h4>
                Dans cette partie, vous pouvez changer votre  mot de passe d'administration.
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
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
