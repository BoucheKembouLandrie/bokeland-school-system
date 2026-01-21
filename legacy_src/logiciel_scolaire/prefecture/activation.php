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
               
<?php //----------------------------activation de sequence
if (isset($_GET['A']))
{echo $id_seq=$_GET['A'];
mysqli_query($mysqli, "update sequence set etat_sequence=1 where id_sequence=$id_seq");}
//----------------------------desactivation de sequence
if (isset($_GET['D']))
{$id_seq=$_GET['D'];
mysqli_query($mysqli, "update sequence set etat_sequence=0 where id_sequence=$id_seq");}
 ?>
               
               
                 <!-- /. ROW  -->
                
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                         Activation / Désactivation des séquences
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                    <?php for($i=1; $i<=6; $i++){ ?>
                                        <tr>
                                            <th><?php echo $i; ?></th>
                                            <th>Séquence N°<?php echo $i; ?></th>
                                           <?php $etat_seq=mysqli_fetch_array(mysqli_query($mysqli, "select etat_sequence from sequence where id_sequence=$i")); ?>
                                            <td>
                                            
                                            <?php if($etat_seq['etat_sequence']==0) {?>
                                            <a href="activation.php?A=<?php echo $i; ?>" id="active_sequence" >
                                            <strong style="color:#F00; font-size:16px">Séquence désactivée.</strong>
                                            <img src="images/cadenas-ouvert.png" height="20" width="20"/>
                                            </a>
                                            <?php } else {?>
                                            <a href="activation.php?D=<?php echo $i; ?>" id="desactive_sequence" >
                                            <strong style="color: #0C0; font-size:16px">Séquence activée</strong>
                                            <img src="images/cadenas-ferme.png" height="20" width="20"/>
                                            </a>
                                            <?php } ?>
                                            </td>
                                        </tr>
                                        <?php } ?>
                                    </thead>
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
                Dans cette partie, vous pouvez activer ou désactiver une ou plusieurs séquences.
                <u>NB:</u> Une séquence n'est visible par les enseignants si et seulement si elle est activée.
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
