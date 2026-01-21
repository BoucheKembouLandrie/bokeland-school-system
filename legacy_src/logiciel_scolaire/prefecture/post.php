<?php include "../php/configurations_etablissement.php"; ?>
<?php include "../php/fonctions_php.php"; ?>
<?php
$visible="non"; 
//***********************fin de la recuperation des informations de la classe de l'élève*****************

if(isset($_POST['classe']) and !empty($_POST['classe'])  )
{	
	 $id=$_POST['classe'];
	$t=mysqli_query($mysqli, "select *from eleve where id_classe=$id and visible_eleve!='non' order by nom_eleve asc");
	$compt=mysqli_num_rows($t);//on compte lenombre d'eleve enregistre dans l classe
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli, "select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucun élève n\'a été enrégistré dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else{
		echo'					
									
									<a href="../fpdf/fpdf_liste_appel.php?id_classe_liste_a_generer='.$id.'" target="_blank"><h4>Générer la liste d\'appel</h4></a>
									<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms & Prénoms</th>
											<th>Matière</th>
                                            <th>Matricule</th>
                                            <th >Pass</th>
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
											<th>Matière</th>
                                            <td>'.$tt['matricule_eleve'].'</td>
                                            <td>'.$tt['pass_eleve'].'</td>
                                            <td>
											   <a href="#" onClick="affichage_profil('.$tt['id_eleve'].');"><img src="images/image connexion.png" height="20" width="20"/></a>
											   <a href="#" onClick="modif_profil('.$tt['id_eleve'].');"><img src="images/edit.png" height="15" width="20"/></a>
											    <a href="#" onClick="recu_eleve('.$tt['id_eleve'].');"><img src="images/recu.png" height="25" width="30"/></a>
											   <a href="#" onClick="confirm_supprime('.$tt['id_eleve'].');"><img src="images/false.png" height="10" width="10"/></a>
											</td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';
	}//fin du else
}
if(isset($_POST['classe_temps']) and !empty($_POST['classe_temps'])  )
{

	 echo $id=$_POST['classe_temps'];
	 for($i=1; $i<=10; $i++)mysqli_query($mysqli, 'insert into emploi_temps(id_classe, numero_horaire) values("'.$id.'","'.$i.'")');
	 $a=mysqli_fetch_array(mysqli_query($mysqli, "select *from classe where id_classe=$id"));
	$t=mysqli_query($mysqli, "select *from emploi_temps where id_classe=$id order by numero_horaire asc");
	$s=mysqli_num_rows($t);
	echo'
										<div class="panel-heading">
                           Emploi de temps de la classe <strong>'.$a['nom_unique_classe'].$a['numero_classe'].'</strong>
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
							<form method="GET" action="">
                                <table class="table table-striped table-hover" >
                                    <thead>
                                        <tr align="center">
                                            <th colspan="2" >Tranches horaires</th>
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
										
                                    <tbody <tr><td><?php echo '.$i.'" " </td>
                                            <td ><textarea name="'.$i. 'l_1c" style="width:100%; min-height:50px; max-height:50px">'.$t10['heure'].'</textarea></td>
                                            <td><textarea name="'.$i.'l_2c" style="width:100%; min-height:50px; max-height:50px">'.$t10['lundi'].'</textarea></td>
                                            <td><textarea name="'.$i.'l_3c" style="width:100%; min-height:50px; max-height:50px">'.$t10['mardi'].'</textarea></td>
                                            <td><textarea name="'.$i.'l_4c" style="width:100%; min-height:50px; max-height:50px">'.$t10['mercredi'].'</textarea></td>
                                            <td><textarea name="'.$i.'l_5c" style="width:100%; min-height:50px; max-height:50px">'.$t10['jeudi'].'</textarea></td>
                                            <td><textarea name="'.$i.'l_6c" style="width:100%; min-height:50px; max-height:50px">'.$t10['vendredi'].'</textarea></td>
                                            <td><textarea name="'.$i.'l_7c" style="width:100%; min-height:50px; max-height:50px">'.$t10['samedi'].'</textarea></td>
                                           
                                        </tr>
									
                                    	
                                    </tbody>
											
										';
                                       
         }    
		 echo'<input type="submit" name="enregistrer" value="Enregistrer"/>
		 </form>
		 </table>
                            </div>
                        </div>';
}

if(isset($_POST['affiche_classe_temps']) and !empty($_POST['affiche_classe_temps'])  )
{
	 $id=$_POST['affiche_classe_temps'];
	 for($i=1; $i<=10; $i++)mysqli_query($mysqli, 'insert into emploi_temps(id_classe, numero_horaire) values("'.$id.'","'.$i.'")');
	 $a=mysqli_fetch_array(mysqli_query($mysqli, "select *from classe where id_classe=$id"));
	$t=mysqli_query($mysqli, "select *from emploi_temps where id_classe=$id order by numero_horaire asc");
	$s=mysqli_num_rows($t);
	echo'
										<div class="panel-heading">
                           <a href="../fpdf/fpdf_emploi_temp.php?id_classe='.$id.'" target="_blank">Générer l\'emploi de temps de la classe <strong>'.$a['nom_unique_classe'].$a['numero_classe'].'</strong></a>
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
	$t=mysqli_query($mysqli, "select *from eleve where id_classe=$id and visible_eleve!='non' order by nom_eleve asc");
	$compt=mysqli_num_rows($t);//on compte lenombre d'eleve enregistre dans l classe
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli, "select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucun élève n\'a été enrégistré dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else{
							
			//	<a href="../fpdf/fpdf liste appel.php?id_classe_liste_a_generer='.$id.'" target="_blank"><h4>Générer la liste d\'appel</h4></a>
								echo'	<table class="table table-striped table-bordered table-hover">
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
		while($tt=mysqli_fetch_array($t)){$i++;
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>
                                            <td>'.$tt['matricule_eleve'].'</td>
                                            <td>'.$tt['pass_eleve'].'</td>
                                            <td>
											   <a href="#" onClick="affichage_profil('.$tt['id_eleve'].');"><img src="images/image connexion.png" height="20" width="20"/></a></td>
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
		$requete = mysqli_query($mysqli, $req);
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
											   <a href="#" onClick="affichage_profil('.$tt['id_eleve'].');"><img src="images/image connexion.png" height="20" width="20"/></a></td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';
	}//fin du else
	
}
//--------------------------------------------------------------------------------------------------------------------------------------------------
if(isset($_POST['id_classe']) and !empty($_POST['id_classe']))
{
	 $id=$_POST['id_classe'];
	 
	 //on selectionne toute les matier de la salle de classe
	 $matiere=mysqli_query($mysqli, "select *from matiere where id_classe=$id order by nom_matiere asc ");
	 
	 //on compte le nombre de matiere
	 $compt=mysqli_num_rows($matiere);//on compte lenombre d'eleve enregistre dans l classe

	if ($compt==0){
		echo '<h4>Aucune matière enrégistrée dans la salle !!!</h4>';
	}
	else{
		echo'				<form method="GET" action="">
			<input type="submit" name="enregistre_affectation" value="Enregistrer"/>
			<input type="hidden" name="id_classe_affectation" value="'.$id.'"/>
									<table class="table table-striped table-bordered table-hover">
									<thead>
										<tr>
										  <td colspan="6">
										  Titulaire de la classe
										  <select name="id_enseignant_titulaire" class="selectpicker form-control" required >';
		//on selectionne le nom de tous les enseignants de l'etablissement
	 $perso=mysqli_query($mysqli, "select *from personnel P, statut_personnel S where S.statut='Enseignant' and S.id_personnel=P.id_personnel order by nom_personnel, prenom_personnel asc "); 
	 
echo' <option value="" >................................ Sélectionnez l\'enseignant titulaire  ................................</option>';

  $perso2=mysqli_fetch_array(mysqli_query($mysqli, "select *from classe where id_classe=$id"));
  
 while($tperso=mysqli_fetch_array($perso)){
	 echo'
    <option value="'.$tperso['id_personnel'].'"';
	if($perso2['id_enseignant_titulaire']==$tperso['id_personnel']) echo 'selected';
	echo'>'.sexe($tperso['sex_personnel']).' '.$tperso['nom_personnel'].' '.$tperso['prenom_personnel'].'
    </option>';
	}
	echo'
      </select> 
										  </td>
										</tr>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms matières</th>
                                            <th>Coefs</th>
											<th>Groupe</th>
                                            <th >Noms enseignants</th>
											 <th >#</th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($tt=mysqli_fetch_array($matiere)){$i++;
		//on selectionne le nom de tous les enseignants de l'etablissement
	 $personnel=mysqli_query($mysqli, "select *from personnel P, statut_personnel S where S.statut='Enseignant' and S.id_personnel=P.id_personnel order by nom_personnel, prenom_personnel asc ");
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_matiere'].'
											<input type="hidden" name="id_matiere'.$i.'" value="'.$tt['id_matiere'].'"/></td>
											<td><input type="number" name="coef'.$i.'" ';
											//-----------on selectionne les information a remplir par défaut dans les champ
	 $T_COEF=mysqli_fetch_array(mysqli_query($mysqli, "select *from affectation_matiere where id_classe=$id and id_matiere='".$tt['id_matiere']."' "));
	  $T_groupe=mysqli_fetch_array(mysqli_query($mysqli, "select numero_groupe from groupe where id_classe=$id and id_matiere='".$tt['id_matiere']."' "));
	 										 echo ' value="'.$T_COEF['coef_matiere'].'" min="1" required/></td>
                                            
											<td>
											<select name="id_groupe'.$i.'" required>
                                            <option value="">Sélectionnez un groupe</option>'; ?>
											
										<option value="1" <?php if($T_groupe['numero_groupe']==1)echo 'selected'; ?>>Groupe 1</option>
                                        <option value="2" <?php if($T_groupe['numero_groupe']==2)echo 'selected'; ?>>Groupe 2</option>
                                        <option value="3" <?php if($T_groupe['numero_groupe']==3)echo 'selected'; ?>>Groupe 3</option>
                                            
                                            <?php echo'
                                            </select>
                                            </td>
											
											<td>'; ?>
											<select name="id_enseignant<?php echo $i; ?>" required>
											<option value="">Sélectionnez un enseignant</option>
											<?php while($pp=mysqli_fetch_array($personnel)){ ?>
											<option value="<?php echo $pp['id_personnel'];?>"
											<?php 
											if($T_COEF['id_enseignant']==$pp['id_personnel'])
											echo 'selected';?>
											"><?php echo sexe($pp['sex_personnel']).' '.$pp['nom_personnel'].' '.$pp['prenom_personnel']; ?></option>
											<?php }?>
											</select>
											<?php 
											echo'</td>
                                            <td></td>
                                            <td>
											   </td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>
										</form>';
	}//fin du else
}
//-------------------------------------------------------------------------------------------------------------------------------------
if(isset($_POST['id_classe_matiere']) and !empty($_POST['id_classe_matiere'])  )
{
	 $id=$_POST['id_classe_matiere'];

	$t=mysqli_query($mysqli, "select *from matiere where id_classe=$id order by nom_matiere asc");
	$compt=mysqli_num_rows($t);//on compte lenombre d'eleve enregistre dans l classe
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli, "select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucune matière enrégistrée dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else{
		echo'					
									<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms des matières</th>
                                            <th>Coefs</th>
                                            <th >Groupe</th>
											 <th >#</th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($tt=mysqli_fetch_array($t)){$i++;
		//------------*on selectionne le coef de la matière
		$c=mysqli_fetch_array(mysqli_query($mysqli, "select *from affectation_matiere where id_matiere='".$tt['id_matiere']."' and id_classe=$id"));
		//------------*on selectionne le groupe de la matiere
		$g=mysqli_fetch_array(mysqli_query($mysqli, "select *from groupe where id_matiere='".$tt['id_matiere']."' and id_classe=$id"));
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_matiere'].'</td>
                                            <td>'.$c['coef_matiere'].'</td>
                                            <td>';
											 if ($g['numero_groupe']==0) echo "";
											 else echo' Groupe '.$g['numero_groupe'];
											 echo '</td>
                                            <td>
											   
											</td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';
	}//fin du else
}
//-----------------------------------------------------------------------------------------------------------------------------------
if(isset($_POST['liste_enseignant_classe']) and !empty($_POST['liste_enseignant_classe'])  )
{	
	 $id=$_POST['liste_enseignant_classe'];
	
	 if($id=="all") 
	{
		$ti=mysqli_query($mysqli, "select *from personnel P, statut_personnel S  where S.statut='Enseignant' and P.id_personnel=S.id_personnel order by nom_personnel, prenom_personnel asc");
		
		echo'					
									
									
									<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms & Prénoms</th>
											<th>Matricule</th>
											<th>#</th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($pe=mysqli_fetch_array($ti)){$i++;
		/*//on selectionne les info du personnel
		$pe=mysql_fetch_array(mysql_query("select *from personnel P, statut_personnel S where P.id_personnel='".$tt['id_enseignant']."' order by nom_personnel, prenom_personnel asc"));
		//on selectionne la matiere dispensee
		$mat=mysql_fetch_array(mysql_query("select *from matiere M where M.id_matiere='".$tt['id_matiere']."' "));*/
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.@sexe($pe['sex_personnel']).' '.$pe['nom_personnel'].' '.$pe['prenom_personnel'].'</td>
											<td>'.$pe['matricule_statut_personnel'].'</td>
											<td>
											<a href="#" onClick="affichage_profil('.$pe['id_personnel'].');"><img src="images/image connexion.png" height="20" width="20"/></a>
											</td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';
	}///fin du if($id=="all") 
	else
	{
	$t=mysqli_query($mysqli, "select *from  affectation_matiere A where A.id_classe=$id ");
	$compt=mysqli_num_rows($t);//on compte lenombre d'eleve enregistre dans l classe
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli, "select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucun enseignant n\'a été affecté dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else{
	$ti=mysqli_query($mysqli, "select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
		echo'					
									
									<a href="../fpdf/fpdf_liste_enseignant.php?id_classe_liste_a_generer='.$id.'" target="_blank"><h4>Générer la liste des enseignants de la '.$tabi['nom_unique_classe'].$tabi['numero_classe'].' </h4></a>
									<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms & Prénoms</th>
											<th>Matière</th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($tt=mysqli_fetch_array($t)){$i++;
		//on selectionne les info du personnel
		$pe=mysqli_fetch_array(mysqli_query($mysqli, "select *from personnel P, statut_personnel S where P.id_personnel='".$tt['id_enseignant']."' order by nom_personnel, prenom_personnel asc"));
		//on selectionne la matiere dispensee
		$mat=mysqli_fetch_array(mysqli_query($mysqli, "select *from matiere M where M.id_matiere='".$tt['id_matiere']."' "));
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.@sexe($pe['sex_personnel']).' '.$pe['nom_personnel'].' '.$pe['prenom_personnel'].'</td>
											<td>'.$mat['nom_matiere'].'</td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';
	}//fin du else
	
}//fin du else ($id==all)
}
//-----------------------affichage du profil de l'enseignant---------------------------------

if(isset($_POST['id_enseignant_profil']) and !empty($_POST['id_enseignant_profil'])  )
{	
	 $id=$_POST['id_enseignant_profil'];
	
		$ti=mysqli_fetch_array(mysqli_query($mysqli, "select *from personnel P, statut_personnel S  where P.id_personnel= $id and S.statut='Enseignant' and P.id_personnel=S.id_personnel order by nom_personnel, prenom_personnel asc"));
		
		echo'					
		<div class="confirm" id="confirm_supprime">
 			<img src="../photo_profil_du_personnel/'.$ti['photo_personnel'].'" height="100" width="100"/>
			<strong style=" font-size:16px">'.sexe($ti['sex_personnel']).' '.$ti['nom_personnel'].' '.$ti['prenom_personnel'].'</strong>
			</br></br>
			<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th><strong style=" font-size:16px">SEXE: </strong></th>
                                            <td>'.$ti['sex_personnel'].'</td>
                                        </tr>
										<tr>
                                            <th><strong style=" font-size:16px">CONTACT: </strong></th>
                                            <td>'.$ti['contact_personnel'].'</td>
                                        </tr>
										<tr>
                                            <th><strong style=" font-size:16px">EMAIL: </strong></th>
                                            <td>'.$ti['email_personnel'].' </td>
                                        </tr>
                                    </thead>
									<tbody>
									
									</tbody>
			</table>
			
   				<p>
  					<button onClick="hide_profil_enseignant();" style="font-size:16px">Fermer</button> 
  				</p>
  		</div>
									';
}
//-------------------------------fin de l'affichage du profil de l'enseignant-----------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------
/*if(isset($_POST['id_classe']) and isset($_POST['numero_trimestre']) )
{		
		$numero_trimestre=$_POST['numero_trimestre'];
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
	 
$note_eleve=mysqli_fetch_array( mysqli_query($mysqli, "select *from note where id_eleve='".$tt['id_eleve']."' and id_sequence=$numero_sequence and id_trimestre=$numero_trimestre "));//on compte nombre d'enregistrement déja effectue

	//fin de la selection--------------------------------------------------------------------------------------
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>'; ?>
                                            <input type="hidden" name="id_eleve_<?php echo $i; ?>L"  value="<?php echo $tt['id_eleve']; ?>" />
<?php //--------------------------------------------------------pour chaque matier, on creera un input text pour la note-------------------------- ?>                                           
 <?php  $id_statut_enseignant2=$_SESSION['id_membre_pre'];
		$t_idpersonnel2=mysqli_fetch_array(mysqli_query($mysqli, "SELECT id_personnel FROM statut_personnel WHERE id_statut_personnel=$id_statut_enseignant2 "));
 
  $req_mat2=mysqli_query($mysqli, "select *from affectation_matiere where id_classe=$id ");
  $j=0;
		while ($tab_mat2=mysqli_fetch_array($req_mat2)){$j++;
			//pour chaque enregistrement, on sélectionne le nom de la matière
			$nom_mat2=mysqli_fetch_array(mysqli_query($mysqli, "select *from matiere where id_classe=$id and id_matiere='".$tab_mat2['id_matiere']."'"));
			
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


*/


if(isset($_POST['sequence_1']) and isset($_POST['numero_sequence']) and isset($_POST['numero_trimestre']) and !empty($_POST['sequence_1']) )
{		$numero_sequence=$_POST['numero_sequence'];
		$numero_trimestre=$_POST['numero_trimestre'];
	 $id=$_POST['sequence_1'];
	
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
		<a href="#" onclick="generer_bull_tous_eleve('.$id.','.$numero_sequence.');">Générer les bulletins de tous les élèves</a>
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
	 
$note_eleve=mysqli_fetch_array( mysqli_query($mysqli, "select *from note where id_eleve='".$tt['id_eleve']."' and id_sequence=$numero_sequence and id_trimestre=$numero_trimestre "));//on compte nombre d'enregistrement déja effectue

	//fin de la selection--------------------------------------------------------------------------------------
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>'; ?>
                                            <input type="hidden" name="id_eleve_<?php echo $i; ?>L"  value="<?php echo $tt['id_eleve']; ?>" />
<?php //--------------------------------------------------------pour chaque matier, on creera un input text pour la note-------------------------- ?>                                           
 <?php  $id_statut_enseignant2=$_SESSION['id_membre_pre'];
		$t_idpersonnel2=mysqli_fetch_array(mysqli_query($mysqli, "SELECT id_personnel FROM statut_personnel WHERE id_statut_personnel=$id_statut_enseignant2 "));
 
  $req_mat2=mysqli_query($mysqli, "select *from affectation_matiere where id_classe=$id ");
  $j=0;
		while ($tab_mat2=mysqli_fetch_array($req_mat2)){$j++;
			//pour chaque enregistrement, on sélectionne le nom de la matière
			$nom_mat2=mysqli_fetch_array(mysqli_query($mysqli, "select *from matiere where id_classe=$id and id_matiere='".$tab_mat2['id_matiere']."'"));
			
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
//---------------------------------------------------------------------------------------------------------------------------------------------

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
////////////////////---------------------------fin affichage du profil de l'élève-----------------------------------

?>
