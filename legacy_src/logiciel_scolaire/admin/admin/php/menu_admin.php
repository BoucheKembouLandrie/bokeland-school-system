<?php if (!isset($_SESSION['login_admin']))
	{
	 //echo'<meta http-equiv="refresh" content="0; ../">';
	 session_destroy();
	 exit();
	 }
?>
 <?php
if(isset($_GET['deconnexion']))
{ // si la variable "ii_isu_ansj_s" existe, cela veut dire que l'administrateur a clique sur déconnecter.
session_destroy();// on tétruit toutes les sessions
echo'<meta http-equiv="refresh" content="0; ../../">'; //on le redirige a la page d'acceuil
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
<a href="index.php?deconnexion" class="btn btn-danger square-btn-adjust">Déconnexion</a> </div>
        </nav>  
		<?php echo $id= $_SESSION['id_admin'];
	  $a=mysqli_fetch_array(mysqli_query($mysqli,"select *from admin where id_admin=$id"));
	   ?>
      
           <!-- /. NAV TOP  -->
                <nav class="navbar-default navbar-side" role="navigation">
            <div class="sidebar-collapse">
                <ul class="nav" id="main-menu">
				<li class="text-center">
                    <?php echo '<a style="color:FFFFF;">Bienvenue '.$a['login_admin'].'</a>'; ?>
					</li>
				
                      <li  >
                        <li>
                        <a href="#"><i class="fa fa-home fa-3x"></i>Acueil<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="index.php">Liste du Personnel</a>
                            </li>
                            <li>
                                <a href="liste_salle_classe.php">Liste  classes</a>
                            </li>
                        </ul>
                      </li>
                    </li>
                     <li>
                       <a href="#"><i class="fa fa-edit fa-3x"></i>Création<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="creation_annee_scolaire.php">année scolaire</a>
                            </li>
                            <li>
								<a href=""><i class="fa fa-3x"></i>Divisions scolarité<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
                            <li>
                                <a href="creation_divisions_scolarite.php">Tranche / inscription</a>
                            </li>
                            <li>
                                <a href="creation_divisions_scolarite_tranche.php">Modalités paiement</a>
                            </li>
                        </ul>
                            </li>
                            <li>
                                <a href="#"><i class="fa fa-3x"></i>Divisions des études<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
                            
                            <li>
                                <a href="creation_divisions_etudes_cycles.php">Cycles</a>
                            </li>
                            <li>
                                <a href="creation_divisions_etudes_series.php">Séries</a>
                            </li>
                        </ul>
                            </li>
                            <li>
								 <a href="#"><i class="fa fa-3x"></i>Classes<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
									<li>
										<a href="creation_classe.php">Création classes</a>
									</li>
									<li>
										<a href="creation_tranche_paiement_classe.php">Tranche paiemment classes</a>
									</li>
								</ul>
                            </li>
                            <li>
								<a href="#"><i class="fa fa-3x"></i>Matières<span class="fa arrow"></span></a>
                             <ul class="nav nav-second-level">
								<li>
									<a href="creation_matieres.php">Création matières</a>
								</li>
								
									<!--<a href="creation matieres.php">Affection matières</a> -->
								
							</ul>
							</li>
                            <li>
									<a href="#"><i class="fa fa-3x"></i>Personnel<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
									<li>  
										<a href="creation_enseignant.php">Personnel</a>
									</li>
									<li>
										<a href="creation_statut_personnel.php">Statut du personnel</a>
									</li>
								</ul>
							</li>
                        </ul>
                      </li>
                     <li>
                        <a href="#"><i class="fa fa-gears fa-3x"></i>configuration<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            
                            <li>
                                <a href="creation_etablissement.php">creation établissement</a>
                            </li>
                            <li>
                                <a href="gallerie.php">Gallerie</a>
                            </li>
                            <li>
                                <a href="presentation_etablissement.php">Présentation établissement</a>
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
                                <a href="statut_change_pass.php">Modifier mon profil</a>
                            </li>
                        </ul>
                      </li>	
                </ul>
               
            </div>
            
        </nav>