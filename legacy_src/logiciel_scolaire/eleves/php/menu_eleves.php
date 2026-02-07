<?php /*if (!isset($_SESSION['id_membre_ele']))
	{
	 echo'<meta http-equiv="refresh" content="0; ../">';
	 session_destroy();
	 exit();
	 }*/
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

<a href="http://127.0.0.1/ced%20et/etablissement/login.php" class="btn btn-danger square-btn-adjust">Déconnexion</a> </div>
        </nav>   
        <?php $id=$_SESSION['id_membre_ele'];
		 $b=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve where id_eleve='".$id."'"));
	   $id1=$b['id_eleve'];
	   $a=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve, classe where eleve.id_classe='".$id1."' and classe.id_classe='".$id1."'"));
	  
	  ?>
           <!-- /. NAV TOP  -->
                <nav class="navbar-default navbar-side" role="navigation">
            <div class="sidebar-collapse">
                <ul class="nav" id="main-menu">
				<li class="text-center">
                <?php 
				
				
				$j1=mysqli_fetch_array(mysqli_query($mysqli, "select
	 *from etablissement ET, annee_scolaire A, scolarite S, classe C, eleve E 
	 where E.id_eleve='".$id."'
	 and E.id_classe=C.id_classe
	 and C.id_scolarite=S.id_scolarite
	 and S.id_annee_scolaire=A.id_annee_scolaire
	 and A.id_etablissement=ET.id_etablissement"));

//3. on cherche le repertoire source ou se trouve la photo de l'eleve
	 $dossier_source="../";
	 $dossier_source= sous_repertoire($dossier_source, majuscule($j1['nom_etablissement']));
	 $dossier_source= sous_repertoire($dossier_source, str_replace('/','-',$j1['nom_annee_scolaire']));
	 $classe=$j1['nom_unique_classe']; $classe.=" "; $classe.=$j1['numero_classe'];
	 $dossier_source= sous_repertoire($dossier_source, $classe);
	 $nom_eleve=$j1['nom_eleve']; $nom_eleve.=" "; $nom_eleve.=$j1['prenom_eleve'];
	 $dossier_source= sous_repertoire($dossier_source, $nom_eleve);
	 $dossier_source= sous_repertoire($dossier_source, "Photo");
	 $dossier_source.=  $j1['photo_eleve'];
				
				
				
				
				 ?>
                    <img src="<?php echo $dossier_source; ?>" height="250" width="250" class="user-image img-responsive"/><?php echo '<a style="color:FFFFF;">Bienvenue '.sexe($b['sexe_eleve'])." ".$b['nom_eleve']." ".$b['prenom_eleve'].'</a>'; ?>
					</li>
				
                      <li  >
                        <li>
                        <a href="#"><i class="fa fa-home fa-3x"></i>Accueil <span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                           
                            <li>
                                <a href="index.php">Professeurs</a>
                            </li>
                            <li>
                                <a href="accueil_notes.php">Notes</a>
                            </li>
                        </ul>
                      </li>
                    </li>
                     <li>
                        <a href="#"><i class="fa fa-book fa-3x"></i>Formations<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li>
                                <a href="#">Formation I<?php echo $id; ?></a>
                            </li>
                            <li>
                                <a href="#">Formation II</a>
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