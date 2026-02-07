<?php if (!isset($_SESSION['id_membre_pre']))
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
          <?php $id= $_SESSION['id_membre_pre'];
	  $a=mysqli_fetch_array(mysqli_query($mysqli, "select *from statut_personnel where id_statut_personnel=$id "));
	   $id1=$a['id_personnel'];
	    $a=mysqli_fetch_array(mysqli_query($mysqli, "select *from statut_personnel, personnel where statut_personnel.id_personnel=$id1 and personnel.id_personnel=$id1"));

	   ?> 
           <!-- /. NAV TOP  -->
                <nav class="navbar-default navbar-side" role="navigation">
            <div class="sidebar-collapse">
                <ul class="nav" id="main-menu">
				<li class="text-center">
                    <img src="../photo_profil_du_personnel/<?php echo $a['photo_personnel']; ?>"  height="250" width="250" class="user-image img-responsive"/><?php echo '<a style="color:FFFFF;">Bienvenue '.sexe($a['sex_personnel'])." ".$a['nom_personnel']." ".$a['prenom_personnel'].'</a>'; ?> 
					</li>
				
                      <li  >
                        <li>
                        <a href="#"><i class="fa fa-home fa-3x"></i>Acueil<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="accueil_liste_enseignants.php">Liste des enseignants</a>
                            </li>
                            <li>
                                <a href="accueil_liste_eleves.php">Liste des élèves</a>
                            </li>
                            <li>
                                <a href="accueil_liste_matieres.php">Liste des matières</a>
                            </li>
                            <li>
                                <a href="accueil_liste_emploi_temps.php">Liste Emploi de temps	</a>
                            </li>
                        </ul>
                      </li>
                    </li>
                     <li>
                        <a href="#"><i class="fa fa-edit fa-3x"></i>Création<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="creation_matieres.php">Création matières</a>
                            </li>
                            
                            <li>
                                <a href="creation_emploi_temps.php">Emploi de temps</a>
                            </li>
                        </ul>
                      </li>
                     <li>
                        <a href="#"><i class="fa fa-gears fa-3x"></i>Gestion<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            
                            <li>
                                <a href="gestion_affectation.php">Affectations</a>
                            </li>
                            <li>
                                <a href="activation.php">Activation des séquences</a>
                            </li>
                            
                        </ul>
                      </li>
                    <li>
                        <a href="#"><i class="fa fa-eye fa-3x"></i>Contrôle<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="controle_bullettin.php">Bullettin</a>
                                
                                
                                 <li>
                                <a href="controle_notes.php">notes</a>
                                
               					 <ul class="nav nav-second-level">
                            
                            <li>
                                <a href="controle_notes.php">sequentielles</a>
                                <ul class="nav nav-second-level">
               
                            		<li>
                                		<a href="sequence_1.php">Sequence 1</a>
                            		</li>
                            		<li>
                                		<a href="sequence_2.php">Sequence 2</a>
                            		</li>
                                    <li>
                                		<a href="sequence_3.php">Sequence 3</a>
                            		</li>
                                    <li>
                                		<a href="sequence_4.php">Sequence 4</a>
                            		</li>
                                    <li>
                                		<a href="sequence_5.php">Sequence 5</a>
                            		</li>
                                    <li>
                                		<a href="sequence_6.php">Sequence 6</a>
                            		</li>
                            
                        		</ul>
                                                            

                            </li>
                            
                            <li>
                                <a href="controle_notes.php">trimestrielles</a>
                                <ul class="nav nav-second-level">
               
                            		<li>
                                		<a href="trimestre_1.php">trimestre 1</a>
                            		</li>
                            		<li>
                                		<a href="trimestre_2.php">trimestre 2</a>
                            		</li>
                                    <li>
                                		<a href="trimestre_3.php">trimestre 3</a>
                            		</li>
                                    
                            
                        		</ul>
                                </li>
                                
                                <li>
                                <a href="annee.php">Annuelles</a>
                                                    
								 </ul>
                            </li>
                            
                            
                        </ul>
                      </li>	
                    
                    <li>
                        <a href="#"><i class="fa fa-envelope fa-3x"></i>...<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="notification.php">Notifications</a>
                            </li>
                        </ul>
                      </li>
                    
                      
                      
                      <li>
                        <a href="#"><i class="fa fa-user fa-3x"></i>statut<span class="fa arrow"></span></a>
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