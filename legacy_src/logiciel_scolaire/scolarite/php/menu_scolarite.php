<?php if (!isset($_SESSION['id_membre_sco']))
	{
	 echo'<meta http-equiv="refresh" content="0; ../">';
	 exit();
	 }
?>
 <?php
if(isset($_GET['deconnexion']))
{ // si la variable "ii_isu_ansj_s" existe, cela veut dire que l'administrateur a clique sur déconnecter.
session_destroy();// on tétruit toutes les sessions
echo'<meta http-equiv="refresh" content="0; ../">'; //on le redirige a la page d'acceuil
exit();
} ?>
 <nav class="navbar navbar-default navbar-cls-top " role="navigation" style="margin-bottom: 0">
            <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse">
                    <span class="sr-only">Menu de navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><?php echo $Marc_School; ?></a> 
            </div>
  <div style="color: white;
padding: 15px 50px 5px 50px;
float: right;
font-size: 16px;">

<a href="?deconnexion" class="btn btn-danger square-btn-adjust">Déconnexion</a> </div>
        </nav>  
		<?php $id= $_SESSION['id_membre_sco'];
	  $a=mysqli_fetch_array(mysqli_query($mysqli, "select *from statut_personnel where id_statut_personnel=$id "));
	   $id1=$a['id_personnel'];
	    $a=mysqli_fetch_array(mysqli_query($mysqli, "select *from statut_personnel, personnel where statut_personnel.id_personnel=$id1 and personnel.id_personnel=$id1"));

	   ?> 
           <!-- /. NAV TOP  -->
                <nav class="navbar-default navbar-side" role="navigation">
            <div class="sidebar-collapse">
                <ul class="nav" id="main-menu">
				<li class="text-center">
                    <img src="../photo_profil_du_personnel/<?php echo $a['photo_personnel']; ?>" height="150" width="100" class="user-image img-responsive"/><?php echo '<a style="color:FFFFF;">Bienvenue '.sexe($a['sex_personnel'])." ".$a['nom_personnel']." ".$a['prenom_personnel'].'</a>'; ?> 
					</li>
				
                      <li  >
                        <a  href="index.php"><i class="fa fa-home fa-3x"></i> Accueil</a>
                    </li>
                     <li>
                        <a href="#"><i class="fa fa-edit fa-3x"></i>Inscription<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="inscription_eleves.php">Inscrire un élève</a>
                            </li>
							<li>
                                <a href="paiement_tranche.php">Paiement tranches</a>
                            </li>
                            <li>
                                <a href="eleves_insolvables.php">Etat paiement</a>
                            </li>
                        </ul>
                      </li>
                    <li>
                        <a href="#"><i class="fa fa-info fa-3x"></i>Informations<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="info_inscriptions.php">Etat inscription</a>
                            </li>
                            
                        </ul>
                      </li>	
                       <li>
                        <a href="#"><i class="fa fa-user fa-3x"></i>Statut<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="statut_profil.php">Mon profil</a>
                            </li>
                            <li>
                                <a href="statut_change_pass.php">Changer de pass</a>
                            </li>
                        </ul>
                      </li>	
                </ul>
               
            </div>
            
        </nav>