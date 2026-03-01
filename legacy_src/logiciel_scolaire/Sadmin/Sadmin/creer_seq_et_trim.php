<?php include"../../php/configurations_etablissement.php"; ?>

<?php 
 if( isset($_GET['supp'])  )
{
$id_sequence= $_GET['supp']; 
$select_supp=mysqli_query($mysqli, "select * from sequence where id_sequence=$id_sequence");
$tableau_supp= mysqli_fetch_array($select_supp); 
echo '<script language="javascript">
  var id_acte_supprime='.$tableau_supp['id_sequence'].';
      </script>';
    // redirection javascript pour l'envoi du message de confirmation de la suppression
echo '<script language="javascript"> var confirmation; confirmation=confirm("voulez-vous vraiment supprimer cette sequence? "); 
if (confirmation==false){history.go(-1);}
else {document.location.href="creer_seq_et_trim.php?confirm_js="+confirmation+"&id_sequence_supprime="+id_acte_supprime+"";} </script>'; 
} 
if( isset($_GET['confirm_js']) ) //on recupère la variable javascript passé par url dans notre code php
{
    $confirm_php= $_GET['confirm_js'];
  $id_sequence= $_GET['id_sequence_supprime'];
  if ($confirm_php=='true')// si confirm est egale a "true", cela veut dire l'utilisateur veut vraiment supprimer l'acte sélectionné
  {
  ///////////on supprime l'administrateur dans la table admin
  if (mysqli_query($mysqli,"delete from sequence where id_sequence=$id_sequence"))
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
</head>

<?php 
//on sélectionne les administrateur crée pour l'affichage.
$select_sequence=mysqli_query($mysqli, "select *from sequence order by id_sequence asc");
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
     <input type="submit" name="creation" value="Créer Seq et Trim" class="btn btn-info" />
     						</div>
     						</form>      
                                <?php while($tab_sequence=mysqli_fetch_array($select_sequence)){ ?><h5><a href="#" style="color:#000"><?php echo $tab_sequence['numero_sequence']; ?></a></h5><?php } ?>

                            
                             
                        </div>
                    </div>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                           Liste des sequence.
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nombre de séquence</th>
                                            <th>trimestre</th>
                                            <th >Date création</th>
                                            <th>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    
                                     <?php
									$select_sequence=mysqli_query($mysqli, "select *from sequence order by id_sequence asc");
									 $i=0; while($tab_sequence1=mysqli_fetch_array($select_sequence)){ $i++; ?>
                                        <tr>
                                            <td><?php echo $i; ?></td>
                                            <td><?php echo $tab_sequence1['numero_sequence']; ?></td>
                                            <td><?php echo $tab_sequence1['id_trimestre']; ?></td>
                                            <td><?php $w=$tab_sequence1['date_enre_sequence']; $hh=$w+2; $heure=date(' G',$hh); echo " ". date('d  /  M  /  Y', $w)." &agrave; ".$heure." H ".date(' i ', $w)." Min"; ?></td>
                                            <td><a href="creer_seq_et_trim.php?supp=<?php echo $tab_sequence1['id_sequence']; ?>">Supprimer</a></td>
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
<?php if(isset($_POST['creation']))
{ //on creer les 6 séquences
$j=1;
 $nombre_creation=mysqli_num_rows(mysqli_query($mysqli, "select * from sequence"));
 if ($nombre_creation<=0){
  for ($i=1; $i<=6; $i++)
  { $verification=0; 
	  if(mysqli_query($mysqli, 'insert into sequence(numero_sequence, id_trimestre, date_enre_sequence) values("'.$i.'","'.$j.'","'.time().'")'))
      {$verification=1;} else{$verification=0;}
  if ($i%2==0)$j++;
  }
  
  if ($verification==1)
  {//on creer 3 trimestres 
  	 for ($i=1; $i<=3; $i++)
  		{ $verification=0;
	  		if(mysqli_query($mysqli, 'insert into trimestre(numero_trimestre, date_enre_trimestre) values("'.$i.'","'.time().'")'))
  			{ $verification=1;} else{$verification=0;}
  		}
  }
 
	if($verification==1)echo $message='<script language="javascript"> alert("Création effectuée avec succès.")</script>';
    else echo $message='<script language="javascript"> alert("Erreur de création.")</script>';

}
else echo $message='<script language="javascript"> alert("Erreur.")</script>';
}//fin de la création d'un administrateur

 ?>

<?php 
 if( isset($_GET['supp'])  )
{
$id_admin= $_GET['supp']; 
$select_supp=mysqli_query($mysqli, "select * from admin where id_admin=$id_admin");
$tableau_supp= mysqli_fetch_array($select_supp); 
echo '<script language="javascript">
  var id_acte_supprime='.$tableau_supp['id_admin'].';
      </script>';
	  // redirection javascript pour l'envoi du message de confirmation de la suppression
echo '<script language="javascript"> var confirmation; confirmation=confirm("voulez-vous vraiment supprimer cet administrateur? "); 
if (confirmation==false){history.go(-1);}
else {document.location.href="creer_administrateur.php?confirm_js="+confirmation+"&id_admin_supprime="+id_acte_supprime+"";} </script>'; 
} 
if( isset($_GET['confirm_js']) ) //on recupère la variable javascript passé par url dans notre code php
{
    $confirm_php= $_GET['confirm_js'];
	$id_admin= $_GET['id_admin_supprime'];
	if ($confirm_php=='true')// si confirm est egale a "true", cela veut dire l'utilisateur veut vraiment supprimer l'acte sélectionné
	{
	///////////on supprime l'administrateur dans la table admin
	if (mysqli_query($mysqli, "delete from admin where id_admin=$id_admin"))
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