<?php include "../php/configurations_etablissement.php"; ?>
<html xmlns="http://www.w3.org/1999/xhtml"><!DOCTYPE html>

<head>
    <title>ELEVES</title>
      <?php include "php/head_eleves.php"; ?>
	  <style>
      #loader{
		  display:none;}
		#profil_enseignant{
		  display:none;}
      </style>
</head>

<body>
    <div id="wrapper">
       <?php include "php/menu_eleves.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><?php echo $prefecture; //variable comportant le nom de la section ?> / Notes de l'eleve </h2>   
                    </div>
					
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
      
<div class="col-md-4" class="form-group">
   
</div>

  


<div  class="col-md-7 col-md-offset-1" class="form-group">
     
<div class="row">
                  
</div>
</div>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
									<table class="table table-striped table-bordered table-hover">
										<thead>
											<tr>
												<th>Matieres</th>
												<?php 
												$com_eta=array();
												 for($j=1; $j<=6; $j++){	
												$etat_seq=mysqli_fetch_array(mysqli_query($mysqli, "select etat_sequence from sequence where id_sequence=$j"));
												
											if($etat_seq['etat_sequence']==1) {
												$com_eta[]=$etat_seq;
												?>
													<th>Sequence <?php echo $j; ?></th>
				
												<?php } }?>
												
											</tr>
										</thead>
											<?php 
												
												
											$elev=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve where id_eleve=$id"));
											$lui=$elev['id_classe'];
											$mati=mysqli_query($mysqli, "select *from matiere where id_classe=$lui");
											//$not="k";
											//${'not'.$k}=mysqli_fetch_array(mysqli_query($mysqli, "select *from note where id_eleve=$id and id_sequence=$k"));
											$not1=mysqli_fetch_array(mysqli_query($mysqli, "select *from note where id_eleve=$id and id_sequence=1"));
											$not2=mysqli_fetch_array(mysqli_query($mysqli, "select *from note where id_eleve=$id and id_sequence=2"));
											$not3=mysqli_fetch_array(mysqli_query($mysqli, "select *from note where id_eleve=$id and id_sequence=3"));
											$not4=mysqli_fetch_array(mysqli_query($mysqli, "select *from note where id_eleve=$id and id_sequence=4"));
											$not5=mysqli_fetch_array(mysqli_query($mysqli, "select *from note where id_eleve=$id and id_sequence=5"));
											$not6=mysqli_fetch_array(mysqli_query($mysqli, "select *from note where id_eleve=$id and id_sequence=6"));
											//$etat_seq=mysqli_fetch_array(mysqli_query($mysqli, "select etat_sequence from sequence where id_sequence=$k"));
											
											while($re=mysqli_fetch_array($mati)) { 
													$m=$re['nom_matiere'];
																							
											?>
											<tbody>
										<tr>
                                        <td><?php echo $re['nom_matiere']; ?></td>
                                        <?php 
										for($l=1; $l<=3; $l++){ $not="l"
										?>
                                            <td><?php echo ${'not'.$l}[$m]; ?></td>
										<?php 
										}
										?>	
                                        </tr>
										</tbody>
										<?php } ?>
									</table>
								</div>
                        </div>
                    </div>
                    
                    </div>
					<div class="col-md-3 col-sm-12 col-xs-12">
                    <div id="loader"><img src="images/loading-bar.gif" height="20"/> </div>
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                        </div>
                        <div>
                        	Ici chaque eleve a la possibilite de consulter toutes les notes activee par le chef d'etude et remplie par les enseignants
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
		<div id="profil_enseignant"></div>
        
        
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
    
   
</body></html>
