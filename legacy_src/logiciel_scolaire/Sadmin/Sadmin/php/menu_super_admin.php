
<?php if (!isset($_SESSION['login_Sadmin']))
	{
        echo $_SESSION['login_Sadmin'];
	 echo'<meta http-equiv="refresh" content="0; ../">';
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
                <a class="navbar-brand" href="index.php"><?PHP echo $Marc_School; ?></a> 
            </div>
  <div style="color: white;
padding: 15px 50px 5px 50px;
float: right;
font-size: 16px;">

<a href="index.php?deconnexion" class="btn btn-danger square-btn-adjust">Déconnexion</a> </div>
        </nav>   
           <!-- /. NAV TOP  -->
                <nav class="navbar-default navbar-side" role="navigation">
            <div class="sidebar-collapse">
                <ul class="nav" id="main-menu">
				<li class="text-center">
                    <img src="contenu/img/membre.png" class="user-image img-responsive"/>M. NOM DU MEMBRE
					</li>
				
                      <li  >
                        <li>
                        <a href="#"><i class="fa fa-home fa-3x"></i>Acueil  <span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="accueil_liste_enseignants.php">Liste du Personnel</a>
                            </li>
                            <li>
                                <a href="accueil_liste_matieres.php">Liste des classes</a>
                            </li>
                        </ul>
                      </li>
                    </li>
                     <li>
                        <a href="#"><i class="fa fa-edit fa-3x"></i>Création<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="creer_administrateur.php">Créer un administrateur</a>
                            </li>
                            <li>
                                <a href="creer_seq_et_trim.php">Créer seq et trim</a>
                            </li>
                            <li>
                                <a href="#">...</a>
                            </li>
                        </ul>
                      </li>
                     <li>
                        <a href="#"><i class="fa fa-gears fa-3x"></i>Gérer le site Web<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="gestion_affectation.php">....</a>
                            </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#"><i class="fa fa-user fa-3x"></i>Statut<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="statut_profil.php">..</a>
                            </li>
                        </ul>
                      </li>	
                </ul>
               
            </div>
            
        </nav>