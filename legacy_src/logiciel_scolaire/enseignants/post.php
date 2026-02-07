<?php include "../php/configurations_etablissement.php"; ?>
<?php include "../php/fonctions_php.php"; ?>
<?php
$visible="non"; 
//***********************fin de la recuperation des informations de la classe de l'élève*****************



if(isset($_POST['affiche_classe_temps']) and !empty($_POST['affiche_classe_temps'])  )
{
	 $id=$_POST['affiche_classe_temps'];
	 for($i=1; $i<=10; $i++)mysqli_query($mysqli,'insert into emploi_temps(id_classe, numero_horaire) values("'.$id.'","'.$i.'")');
	 $a=mysqli_fetch_array(mysqli_query($mysqli,"select *from classe where id_classe=$id"));
	$t=mysqli_query($mysqli,"select *from emploi_temps where id_classe=$id order by numero_horaire asc");
	$s=mysqli_num_rows($t);
	echo'
										<div class="panel-heading">
                          Emploi de temps de la <strong>'.$a['nom_unique_classe'].$a['numero_classe'].'</strong>
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr align="center">
                                            <th  >Tranches horaires</th>
                                            <th >Lundi</th>
                                            <th>Mardi</th>
                                            <th >Mercredi</th>
                                             <th >Jeudi</th>
                                             <th>Vendredi</th>
                                            <th>Samedi <input type="hidden" name="id_classe" value="'.$id.'"/></th>                                            
                                        </tr>
                                    </thead>';$i=0;
	while($t10=mysqli_fetch_array($t)){ $i++;
                                        echo'
										
                                    <tbody <tr>
                                            <td >'.$t10['heure'].'</td>
                                            <td>'.$t10['lundi'].'</td>
                                            <td>'.$t10['mardi'].'</td>
                                            <td>'.$t10['mercredi'].'</td>
                                            <td>'.$t10['jeudi'].'</td>
                                            <td>'.$t10['vendredi'].'</td>
                                            <td>'.$t10['samedi'].'</td>
                                           
                                        </tr>
									
                                    	
                                    </tbody>
											
										';
                                       
         }    
		 echo'
		 </table>
                            </div>
                        </div>';
}
if(isset($_POST['affiche_eleve']) and !empty($_POST['affiche_eleve'])  )
{
	 $id=$_POST['affiche_eleve'];
	$t=mysqli_query($mysqli,"select *from eleve where id_classe=$id and visible_eleve!='non' order by nom_eleve asc");
	$compt=mysqli_num_rows($t);//on compte lenombre d'eleve enregistre dans l classe
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli,"select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucun élève n\'a été enrégistré dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else{
		echo'					
									<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms & Prénoms</th>
                                            <th>Matricule</th>
											 <th >#</th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($tt=mysqli_fetch_array($t)){$i++;
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>
                                            <td>'.$tt['matricule_eleve'].'</td>

                                            <td>
											   <a href="#" onClick="affichage_profil('.$tt['id_eleve'].');"><img src="images/image connexion.png" height="20" width="20"/></a>
											</td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';
	}//fin du else
}

if( isset($_POST['search']))
{
	$search=$_POST['search'];

	$req = 'select *from eleve where visible_eleve!="'.$visible.'" and';
        $mots = explode(' ',$search);//la fonction explode permet de mettre les mot d'une chaine dans un tableau En separre lexpression en mots cles
        foreach($mots as $mot)
        {
                $req .= ' (nom_eleve LIKE "%'.$mot.'%" OR  prenom_eleve LIKE "%'.$mot.'%")  AND'; // le theme % veut dire peut importe ce qui est apr?s et ce 
																									//qui es avant la recherche s'effectu 
		}
		$req .= ' 1=1';
		//Les annonces seront ranges par identifiant en ordre d?croissant
		$req .= ' order by nom_eleve, prenom_eleve asc';
		$requete = mysqli_query($mysqli,$req);
	$compt=mysqli_num_rows($requete);//on compte lenombre d'eleve enregistre dans l classe
	$i=0;
	if ($compt==0){
		
	echo '<h4>Aucun nom ne correspond à votre recherche.</strong></h4>';
	}
	else{
		echo'					
									<h4 >Résultat de la recherche: <strong style="color:#06F"> '.$compt;
									if($compt==1) echo ' élève trouvé.';
									else echo ' élèves trouvés.';
									echo'
									</strong></h4>
									<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms & Prénoms</th>
                                            <th>Matricule</th>
                                            <th >Pass</th>
											 <th >#</th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($tt=mysqli_fetch_array($requete)){$i++;
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>
                                            <td>'.$tt['matricule_eleve'].'</td>
                                            <td>'.$tt['pass_eleve'].'</td>
                                            <td>
											   <a href="#" onClick="affichage_profil('.$tt['id_eleve'].');"><img src="images/image connexion.png" height="20" width="20"/></a>
											  </td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';
	}//fin du else
	
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------
if(isset($_POST['sequence_1']) and isset($_POST['numero_sequence']) and isset($_POST['numero_trimestre']) and !empty($_POST['sequence_1']) )
{		$numero_sequence=$_POST['numero_sequence'];
		$numero_trimestre=$_POST['numero_trimestre'];
	 $id=$_POST['sequence_1'];
	
	$t=mysqli_query($mysqli,"select *from eleve where id_classe=$id and visible_eleve!='non' order by nom_eleve asc");
	$compt=mysqli_num_rows($t);//on compte lenombre d'eleve enregistre dans l classe
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli,"select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucun élève n\'a été enrégistré dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else{
		echo'					<form method="GET" action="">
									<table class="table table-striped table-bordered table-hover">
									<thead>
									<input type="submit" name="enregistrer" value="Enregistrer"/> 
                                        <tr>
                                            <th >#</th>
                                            <th >Noms & Prénoms</th>';?>
 <?php //--------------------------------------------------------on compte le nombre de matière de la salle de classe-------------------------- ?>                                           
 <?php  $id_statut_enseignant=$_SESSION['id_membre_ens'];
		$t_idpersonnel=mysqli_fetch_array(mysqli_query($mysqli,"SELECT id_personnel FROM statut_personnel WHERE id_statut_personnel=$id_statut_enseignant "));
 
  $req_mat=mysqli_query($mysqli,"select *from affectation_matiere where id_classe=$id and id_enseignant='".$t_idpersonnel['id_personnel']."'");
  $jjj=0; $tableau_matiere=array();
		while ($tab_mat=mysqli_fetch_array($req_mat)){ $jjj++;
			//pour chaque enregistrement, on sélectionne le nom de la matière
			$nom_mat=mysqli_fetch_array(mysqli_query($mysqli,"select *from matiere where id_classe=$id and id_matiere='".$tab_mat['id_matiere']."'"));
			$tableau_matiere[$jjj]= $nom_mat['nom_matiere'];
			?>                                      
                                            <th ><?php echo $nom_mat['nom_matiere']; ?></th>
						<input type="hidden" name="id_matiere<?php echo $jjj; ?>C" value="<?php echo $nom_mat['id_matiere']; ?>" />
                        <input type="hidden" name="id_classe"  value="<?php echo $id; ?>" />
                        <input type="hidden" name="id_sequence"  value="<?php echo $numero_sequence; ?>" />
                        <input type="hidden" name="id_trimestre"  value="<?php echo $numero_trimestre; ?>" />
                        
                 <?php } //fin de la boucle while ($tab_mat=mysql_fetch_array($ti)) ?>
 <?php //-----------------------fin de l'affichage de l'entete du tableau des matières----------------------------------------------------------- ?>							
 <?php
											echo'
                                        </tr>
                                    </thead>';
		  $i=0;
		while($tt=mysqli_fetch_array($t)){$i++;
		
		 //on selectionne la note de l'élève si elle existe-------------------------------------------------------
	 
$note_eleve=mysqli_fetch_array( mysqli_query($mysqli,"select *from note where id_eleve='".$tt['id_eleve']."' and id_sequence=$numero_sequence and id_trimestre=$numero_trimestre "));//on compte nombre d'enregistrement déja effectue

	//fin de la selection--------------------------------------------------------------------------------------
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>'; ?>
                                            <input type="hidden" name="id_eleve_<?php echo $i; ?>L"  value="<?php echo $tt['id_eleve']; ?>" />
<?php //--------------------------------------------------------pour chaque matier, on creera un input text pour la note-------------------------- ?>                                           
 <?php  $id_statut_enseignant2=$_SESSION['id_membre_ens'];
		$t_idpersonnel2=mysqli_fetch_array(mysqli_query($mysqli,"SELECT id_personnel FROM statut_personnel WHERE id_statut_personnel=$id_statut_enseignant2 "));
 
  $req_mat2=mysqli_query($mysqli,"select *from affectation_matiere where id_classe=$id and id_enseignant='".$t_idpersonnel2['id_personnel']."'");
  $j=0;
		while ($tab_mat2=mysqli_fetch_array($req_mat2)){$j++;
			//pour chaque enregistrement, on sélectionne le nom de la matière
			$nom_mat2=mysqli_fetch_array(mysqli_query($mysqli,"select *from matiere where id_classe=$id and id_matiere='".$tab_mat2['id_matiere']."'"));
			
			?>                                      
                                            <th style="font-size:12px"><input type="number" step="0.01" min="0.00" max="20" name="note_<?php echo $i; ?>L_<?php echo $j; ?>C" 
                                            value="<?php $a=-1;if (@$vvv=@$note_eleve[''.@majuscule_sans_axcent($tableau_matiere[$j]).'']!==$a){echo @$note_eleve[''.@majuscule_sans_axcent($tableau_matiere[$j]).''];} ?>" style="width:70px"/> /20</th>
                                            
			
                 <?php } //fin de la boucle while ($tab_mat2=mysql_fetch_array($req_mat2)) ?>
 <?php //-----------------------fin de creera un input text pour la note----------------------------------------------------------- ?>
                                            
                                          
                                            
									<?php echo'
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>
									</form>';
	}//fin du else
}
if( isset($_POST['id_personnel_acces']) and isset($_POST['id_personnel_acces']) )
{		$id_personnel_acces=$_POST['id_personnel_acces'];
$a=mysqli_fetch_array(mysqli_query($mysqli,"select *from statut_personnel where id_statut_personnel=$id_personnel_acces "));
$id1=$a['id_personnel'];

$b=mysqli_fetch_array(mysqli_query($mysqli,"select *from personnel where id_personnel=$id1 "));

	$t=mysqli_num_rows(mysqli_query($mysqli, "select *from classe where id_enseignant_titulaire=$id1 "));
	if ($t==0){
		echo '<script language="javascript"> alert("Vous n\'avez pas accès à cette page '.sexe($b['sex_personnel']).' '.$b['nom_personnel'].' '.$b['prenom_personnel'].'"); </script>';
	}
	else{
			echo '<script language="javascript"> document.location.href="gestion_bullettins.php"; </script>';
	}
}
if(isset($_POST['bull_sequence_1']) and isset($_POST['bull_numero_sequence']) and isset($_POST['bull_numero_trimestre']) and !empty($_POST['bull_sequence_1']) )
{		$numero_sequence=$_POST['bull_numero_sequence'];
		$numero_trimestre=$_POST['bull_numero_trimestre'];
	 $id=$_POST['bull_sequence_1'];
	
	$t=mysqli_query($mysqli,"select *from eleve where id_classe=$id and visible_eleve!='non' order by nom_eleve asc");
	$compt=mysqli_num_rows($t);//on compte lenombre d'eleve enregistre dans l classe
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli,"select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucun élève n\'a été enrégistré dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else{
		echo'					<form method="GET" action="">
									<table class="table table-striped table-bordered table-hover">
									<thead>
									
                                        <tr>
                                            <th >#</th>
                                            <th >Noms & Prénoms</th>';?>
 <?php //--------------------------------------------------------on compte le nombre de matière de la salle de classe-------------------------- ?>                                           
 <?php 
  $req_mat=mysqli_query($mysqli,"select *from affectation_matiere where id_classe=$id ");
  $jjj=0; $tableau_matiere=array();
		while ($tab_mat=mysqli_fetch_array($req_mat)){ $jjj++;
			//pour chaque enregistrement, on sélectionne le nom de la matière
			$nom_mat=mysqli_fetch_array(mysqli_query($mysqli,"select *from matiere where id_classe=$id and id_matiere='".$tab_mat['id_matiere']."'"));
			$tableau_matiere[$jjj]= $nom_mat['nom_matiere'];
			?>                                      
                                            <th ><?php echo $nom_mat['nom_matiere']; ?></th>
						<input type="hidden" name="id_matiere<?php echo $jjj; ?>C" value="<?php echo $nom_mat['id_matiere']; ?>" />
                        <input type="hidden" name="id_classe"  value="<?php echo $id; ?>" />
                        <input type="hidden" name="id_sequence"  value="<?php echo $numero_sequence; ?>" />
                        <input type="hidden" name="id_trimestre"  value="<?php echo $numero_trimestre; ?>" />
                        
                 <?php } //fin de la boucle while ($tab_mat=mysql_fetch_array($ti)) ?>
 <?php //-----------------------fin de l'affichage de l'entete du tableau des matières----------------------------------------------------------- ?>							
 <?php
											echo'
											<th >#</th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($tt=mysqli_fetch_array($t)){$i++;
		
		 //on selectionne la note de l'élève si elle existe-------------------------------------------------------
	 
$note_eleve=mysqli_fetch_array( mysqli_query($mysqli,"select *from note where id_eleve='".$tt['id_eleve']."' and id_sequence=$numero_sequence and id_trimestre=$numero_trimestre "));//on compte nombre d'enregistrement déja effectue

	//fin de la selection--------------------------------------------------------------------------------------
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>'; ?>
                                            <input type="hidden" name="id_eleve_<?php echo $i; ?>L"  value="<?php echo $tt['id_eleve']; ?>" />
<?php //--------------------------------------------------------pour chaque matier, on creera un input text pour la note-------------------------- ?>                                           
 <?php 
  $req_mat2=mysqli_query($mysqli,"select *from affectation_matiere where id_classe=$id ");
  $j=0;
		while ($tab_mat2=mysqli_fetch_array($req_mat2)){$j++;
			//pour chaque enregistrement, on sélectionne le nom de la matière
			$nom_mat2=mysqli_fetch_array(mysqli_query($mysqli,"select *from matiere where id_classe=$id and id_matiere='".$tab_mat2['id_matiere']."'"));
			
			?>                                      
                                            <th style="font-size:12px">
											<?php $ui= @$note_eleve[''.@majuscule_sans_axcent($tableau_matiere[$j]).''];
											 if (!empty($ui)) echo @$ui.' /20';
											 else echo "....";
											 ?></th>
                                            
			
                 <?php } //fin de la boucle while ($tab_mat2=mysql_fetch_array($req_mat2)) ?>
 <?php //-----------------------fin de creera un input text pour la note----------------------------------------------------------- ?>
                                            
                                          
                                            
									<?php echo'
                                        <td><a href="../fpdf/fpdf_bull_sequence.php?id_sequence='.$numero_sequence.'&id_eleve='.$tt['id_eleve'].'" target="_blank">Générer le bulettin Sequence '.$numero_sequence.'</a></td>
										</tr>
										';
                                       } 
                                    echo '</tbody> </table>
									</form>';
	}//fin du else
}
if(isset($_POST['id_eleve_profil']) and !empty($_POST['id_eleve_profil']) )
{   	
	$id=$_POST['id_eleve_profil'];
 
  //on cherche le repertoire de la photo de l'élève
//1. NOM DE L4ETABLISSEMENT
    $et=mysqli_fetch_array(mysqli_query($mysqli, "select *from etablissement")); 
    $nom_etablissement=majuscule($et['nom_etablissement']);
//2.  les élément de table anneee_scolaire, classe, eleve
	$j1=mysqli_fetch_array(mysqli_query($mysqli, "select
	 *from etablissement ET, annee_scolaire A, scolarite S, classe C, eleve E 
	 where E.id_eleve=$id
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
//4. affichage du profil de l'eleve
	
	echo '<div class="confirm" id="profil">
	<img src="'.$dossier_source.'" height="100" width="100"/>
  <p style=" font-size:16px; text-align:center;">
  <strong style="font-family: serif; font-size:16px; color:#06F;">'.$j1['nom_eleve'].'  '.$j1['prenom_eleve'].'</strong>
  
  
  <table class="table table-striped table-bordered table-hover" width="100%">
                                        <tr>
                                            <th><strong style="font-size:16px;">Matricule</strong></th>
                                            <td>'.$j1['matricule_eleve'].'</td>
                                        </tr>
                                        <tr>
                                            <th><strong style="font-size:16px;">Pass</strong></th>
                                            <td>'.$j1['pass_eleve'].'</td>
                                        </tr>
                                        <tr>
                                            <th><strong style="font-size:16px;">Sexe</strong></th>
                                            <td>'.$j1['sexe_eleve'].'</td>
                                        </tr>
                                        <tr>
                                            <th><strong style="font-size:16px;">date et lieu de naissance</strong></th>
                                            <td>'.$j1['date_naiss_eleve'].' à '.$j1['lieu_naiss_eleve'].'</td>
                                        </tr>
										 <tr>
                                            <th><strong style="font-size:16px;">Classe</strong></th>
                                            <td>'.$j1['nom_unique_classe'].$j1['numero_classe'].'</td>
                                        </tr>
                                        <tr>
                                            <th><strong style="font-size:16px;">Contact parent</strong></th>
                                            <td>'.$j1['contact_parent_eleve'].'</td>
                                        </tr>
                                        <tr>
                                            <th><strong style="font-size:16px;">Date inscription</strong></th>
                                            <td>'.affiche_date($j1['date_enre_eleve']).'</td>
                                        </tr>
                                        
                                    </table>
  <button onClick="hide_profil();" style="font-size:16px">Fermer</button> 
 
  </p>
  </div>';
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
?>
