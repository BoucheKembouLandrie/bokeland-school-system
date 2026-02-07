<?php include "../../php/configurations_etablissement.php"; ?>
<?php include "../../php/fonctions_php.php"; ?>
<?php
$visible="non"; 
//***********************fin de la recuperation des informations de la classe de l'élève*****************
if(isset($_POST['id_classe']) and isset($_POST['numero_trimestre']) )
{		
		$numero_trimestre=$_POST['numero_trimestre'];$numero_sequence=1;
	 $id=$_POST['id_classe'];
	
	$t=mysqli_query($mysqli, "select *from eleve where id_classe=$id and visible_eleve!='non' order by nom_eleve asc");
	$compt=mysqli_num_rows($t);//on compte lenombre d'eleve enregistre dans l classe
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli, "select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucun élève n\'a été enrégistré dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else{
		echo'					<form method="POST" action="">
		<a href="#" onclick="generer_bull_tous_eleve('.$id.','.$numero_trimestre.');">Générer les bulletins de tous les élèves</a>
									<table class="table table-striped table-bordered table-hover">
									<thead>
									
                                        <tr>
                                            <th >#</th>
                                            <th >Noms & Prénoms</th>';?>
 <?php //--------------------------------------------------------on compte le nombre de matière de la salle de classe-------------------------- ?>                                           
 <?php  $id_statut_enseignant=$_SESSION['id_membre_pre'];
		$t_idpersonnel=mysqli_fetch_array(mysqli_query($mysqli, "SELECT id_personnel FROM statut_personnel WHERE id_statut_personnel=$id_statut_enseignant "));
 
  $req_mat=mysqli_query($mysqli, "select *from affectation_matiere where id_classe=$id ");
  $jjj=0; $tableau_matiere=array();
		while ($tab_mat=mysqli_fetch_array($req_mat)){ $jjj++;
			//pour chaque enregistrement, on sélectionne le nom de la matière
			$nom_mat=mysqli_fetch_array(mysqli_query($mysqli, "select *from matiere where id_classe=$id and id_matiere='".$tab_mat['id_matiere']."'"));
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
	 
//$note_eleve=mysqli_fetch_array( mysqli_query($mysqli, "select *from note where id_eleve='".$tt['id_eleve']."' and id_trimestre=$numero_trimestre "));//on compte nombre d'enregistrement déja effectue

	//fin de la selection--------------------------------------------------------------------------------------
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>'; ?>
                                            <input type="hidden" name="id_eleve_<?php echo $i; ?>L"  value="<?php echo $tt['id_eleve']; ?>" />
<?php //--------------------------------------------------------pour chaque matier, on creera un input text pour la note-------------------------- ?>                                           
 <?php 
 //$tab_not = mysqli_fetch_array(mysqli_query($mysqli, "select *from note"));
 //$sequence = $tab_not['id_sequence'];
  
  $req_mat2=mysqli_query($mysqli, "select *from affectation_matiere where id_classe=$id ");
  $j=0;
		while ($tab_mat2=mysqli_fetch_array($req_mat2)){$j++;
		$nom_mat=mysqli_fetch_array(mysqli_query($mysqli, "select *from matiere where id_classe=$id and id_matiere='".$tab_mat2['id_matiere']."'"));
		$matiere=majuscule_sans_axcent($nom_mat['nom_matiere']);
		
		$note_eleve=mysqli_fetch_array(mysqli_query($mysqli, "select AVG($matiere) as trimestre from note where id_trimestre=$numero_trimestre and id_eleve='".$tt['id_eleve']."' and id_classe=$id"));
			//pour chaque enregistrement, on sélectionne le nom de la matière
			$nom_mat2=mysqli_fetch_array(mysqli_query($mysqli, "select *from matiere where id_classe=$id and id_matiere='".$tab_mat2['id_matiere']."'"));
	
			?>                                      
                                            <th style="font-size:12px">
											<?php $ui= @$note_eleve['trimestre'];
											 if (!empty($ui)) echo @$ui.' /20';
											 else echo "....";
											 ?></th>
                                            
			
                 <?php } //fin de la boucle while ($tab_mat2=mysql_fetch_array($req_mat2)) ?>
 <?php //-----------------------fin de creera un input text pour la note----------------------------------------------------------- ?>
                                            
                                          
                                            
									<?php echo'
                                        <td><a href="../fpdf/fpdf_bull_trimestre.php?id_sequence='.$numero_trimestre.'&id_eleve='.$tt['id_eleve'].'" target="_blank">Générer le bulettin Trimestre '.$numero_trimestre.'</a></td>
										</tr>
										';
                                       } 
                                    echo '</tbody> </table>
									</form>';
	}//fin du else
}

?>

