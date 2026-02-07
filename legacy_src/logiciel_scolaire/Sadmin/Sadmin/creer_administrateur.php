<?php include"../../php/configurations_etablissement.php"; ?>


<?php 
 if( isset($_GET['supp'])  )
{
$id_admin= $_GET['supp']; 
$select_supp=mysqli_query($mysqli,"select * from admin where id_admin=$id_admin");
$tableau_supp= mysqli_fetch_array($select_supp); 
echo '<script language="javascript">
  var id_acte_supprime='.$tableau_supp['id_admin'].';
      </script>';
    // redirection javascript pour l'envoi du message de confirmation de la suppression
echo '<script language="javascript"> var confirmation; confirmation=confirm("voulez-vous vraiment supprimer cet administrateur? "); 
if (confirmation==false){history.go(-1);}
else {document.location.href="creer administrateur.php?confirm_js="+confirmation+"&id_admin_supprime="+id_acte_supprime+"";} </script>'; 
} 
if( isset($_GET['confirm_js']) ) //on recupère la variable javascript passé par url dans notre code php
{
    $confirm_php= $_GET['confirm_js'];
  $id_admin= $_GET['id_admin_supprime'];
  if ($confirm_php=='true')// si confirm est egale a "true", cela veut dire l'utilisateur veut vraiment supprimer l'acte sélectionné
  {
  ///////////on supprime l'administrateur dans la table admin
  if (mysqli_query($mysqli,"delete from admin where id_admin=$id_admin"))
  {
  echo '<script language="javascript"> alert("Suppression effectuée."); history.go(-1);</script>';
  }
  else
  {
    echo '<script language="javascript"> alert("Une erreur s\'est produite pendant la suppression."); history.go(-1);</script>';
  }
  }
  
}//////////**********************************fin de la suprresion des actes//////////////----------------------------------------------
             ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION SCOLARITE</title>
      <?php include "php/head_super_admin.php"; ?>
      <?php if(isset($_POST['creation']))
{ // si cette variable existe, on crée un administrateur
// le login des administrateur seront tous: << admin>> suivi de trois caractere lieatoire
// le pass sera une chaine de aractere aléatoire.
$login_admin="admin";
$login_admin=code_aleatoire(3); //
$pass_admin=code_aleatoire(8);  //genere un code aleatoire de 8 caracteres

  if(mysqli_query($mysqli,'insert into admin(login_admin, pass_admin, date_enre_admin) values("'.$login_admin.'","'.$pass_admin.'","'.time().'")'))
  { 
  echo $message='<script language="javascript"> alert("Création effectuée avec succès.")</script>';
  echo'<script language="javascript"> document.location.href="creer_administrateur.php";</script>';
  } else echo $message='<script language="javascript"> alert("Erreur de création.")</script>';
}//fin de la création d'un administrateur
 ?>
</head>

<?php 
//on sélectionne les administrateur crée pour l'affichage.
$select_admin=mysqli_query($mysqli, "select *from admin order by id_admin desc");
 ?>



<body>
    <div id="wrapper">
       <?php include "php/menu_super_admin.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><h2><?php echo @$page_super_admin; //variable comportant le nom de la section ?> </h2>   </h2>   
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
                            <form action="" method="POST">
                            <div class="col-xs-pull-1" class="form-group">
     <input type="submit" name="creation" value="Créer un administrateur" class="btn btn-info" />
     						</div>
     						</form>
                             <?php while($tab_admin=mysqli_fetch_array($select_admin)){ ?><h5><a href="#" style="color:#000"><?php echo $tab_admin['login_admin']; ?></a></h5><?php } ?>
                        </div>
                    </div>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                           Liste des administrateurs.
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>LOGIN</th>
                                            <th>PASS</th>
                                            <th >Date création</th>
                                            <th>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <?php
									$select_admin=mysqli_query($mysqli, "select *from admin order by id_admin desc");
									 $i=0; while($tab_admin2=mysqli_fetch_array($select_admin)){ $i++; ?>
                                        <tr>
                                            <td><?php echo $i; ?></td>
                                            <td><?php echo $tab_admin2['login_admin']; ?></td>
                                            <td><?php echo $tab_admin2['pass_admin']; ?></td>
                                            <td><?php $w=$tab_admin2['date_enre_admin']; $hh=$w+2; $heure=date(' G',$hh); echo " ". date('d  /  M  /  Y', $w)." &agrave; ".$heure." H ".date(' i ', $w)." Min"; ?></td>
                                            <td><a href="creer administrateur.php?supp=<?php echo $tab_admin2['id_admin']; ?>">Supprimer</a></td>
                                        </tr>
                                      <?php } ?>
                                    </tbody>
                                </table>
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
