<?php include "../../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style>#p_form{display: yes;} #non{display: none;}</style>
    <title>GESTION SCOLARITE</title>
     <?php include "php/head_admin.php"; ?>
     <?php 
$s=mysqli_query($mysqli, "select *from matiere order by nom_matiere asc");
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
                     <h2><h2><?php echo @$page_admin //variable comportant le nom de la section ?> /Verification du profil </h2>   </h2>   
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
               
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Commentaire</h4>
                           Dans cette rubrique, vous avez la possibilité de changer votre mot de passe.      
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                            
                            
                        </div>
                    </div>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                          
                    <?php
						include "formulaire_verifi_profil_pass.php";?>
		<div id="non">
			<?php include "formulaire_statut_change_pass.php";	?>	
		</div> <?php
					 
						if(isset($_POST['mdp']))
						{ 
							$mdp=$_POST['mdp'];
							$id_admin=$_POST['id_admin'];
							$rech=mysqli_num_rows(mysqli_query($mysqli, "select * from admin where id_admin=$id_admin and pass_admin='$mdp'"));

 	  						if($rech!=0)
    						{	?> <style>#p_form{display: none;}</style><?php 
								
								include "formulaire_statut_change_pass.php";
		  					}
  							else { echo $message='<script language="javascript"> alert("Erreur ce mot de passe n\'est pas correct veuillez reessayer... ")</script>'; exit();}
 
							}
					  ?> 
                    
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
