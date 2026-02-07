<?php include "../php/configurations_etablissement.php"; ?>
<?php include "../php/fonctions_php.php"; ?>
<?php
$visible="non"; 
/////////////////////-----------------suppression d'un élève-------------------
if(isset($_POST['supprime_eleve']) and !empty($_POST['supprime_eleve']) )
{   	
	$id=$_POST['supprime_eleve'];
	$visible="non";
	if(mysqli_query($mysqli, "update eleve set visible_eleve='$visible' where id_eleve=$id"))
	echo '<script language="javascript"> alert("Suppression effectuée!!!"); document.location.href="index.php";</script>';
}
/////////////////////-----------------Cobfirmation de la suppression d'un élève-------------------
if(isset($_POST['confirm_supprime']) and !empty($_POST['confirm_supprime']) )
{   	
	$id=$_POST['confirm_supprime'];
	$e=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve where id_eleve=$id and visible_eleve!='$visible'"));
	echo '<div class="confirm" id="confirm_supprime">
	<h1 style=" font-size:14px;">En effectuant cette action, vous supprimez définitivement cet élève et tous les documents qui lui sont destinés.</h1>
    <strong>Voulez vous vraiment supprimer l\'élève <strong style=" font-style:italic; font-size:18px; color:#090">'.$e['nom_eleve'].' '.$e['prenom_eleve'].'</strong> ?</strong> 
   <p>
  <button onClick="hide_confirm_supprime();" style="font-size:16px">Annuler</button> 
  <button onClick="supprime_eleve('.$id.');" style="font-size:16px">Ok</button> 
  </p>
  </div>';
}
/////////////////////-----------------formulaire de mofdification du profil de l'élève-------------------
$s10=mysqli_query($mysqli, "SELECT nom_classe, nom_unique_classe,id_classe FROM classe group by nom_unique_classe");
	  $s20=mysqli_query($mysqli, "SELECT *FROM annee_scolaire");
	  $s30=mysqli_query($mysqli, "SELECT *FROM scolarite"); 

if(isset($_POST['id_eleve_modif']) and !empty($_POST['id_eleve_modif']) )
{   	
	$id=$_POST['id_eleve_modif'];
 
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
	
	echo '<div class="confirm" id="modif_profil">
	<img src="'.$dossier_source.'" height="100" width="100"/>';
	//////////////////////////////
	///////////////////////////
	/////////////////////////////formulaire de modification du profil.
	echo'<form class="formoid-solid-blue" style="background-color:#ebecff;font-size:16px;font-family:Arial,Helvetica,sans-serif;color:#34495E;max-width:900px;min-width:150px" method="post" enctype="multipart/form-data">

<div ><h2 style="color:#000;">Modification du profil</h2></div>
<input type="submit" id="div_enregistrer" value="Enrégistrer"/>
    
	<div class="element-name"><label class="title">
    <span class="required">Noms/prénoms</span></label>
   
    <span class="nameLast" id="div_nom" >
    <input placeholder="Nom" type="text" size="8" name="nom" value="'.$j1['nom_eleve'].'" id="nom" required="required"/><span class="icon-place"></span></span>
    
    <span class="nameFirst" id="div_prenom">
    <input placeholder="Prénom ici" type="text" size="14" name="prenom" id="prenom" value="'.$j1['prenom_eleve'].'" required="required"/><span class="icon-place">
    </span></span></div>
    
	<div class="element-date" id="div_date_naissance">
    <label class="title"><span >Date de naissance</span></label>
    <div class="item-cont"><input class="large" type="date" id="date_naissance" name="date_naissance" required="required" value="'.$j1['date_naiss_eleve'].'" placeholder="Exemple: 2017-05-31" /><span class="icon-place"></span></div></div>
    
 
	<div class="element-select" id="div_lieu_naissance"><label class="title"><span class="required">Lieu naissance</span></label><div class="item-cont"><div class="large"><span><select name="lieu_naissance" required="required" >
    <option value="" selected="selected">-------- Sélectionnez une ville --------</option>';
		 include "php/select ville du cameroun.html";
       echo' </select><i></i><span class="icon-place"></span></span></div></div></div>
     
     <div class="element-radio" id="div_sexe" >
    <div class="column column1"><label><input type="radio" name="sexe" value="Homme" required="required" onChange="afficher_div("div_photo");"
	';
	if($j1['sexe_eleve']=="Homme") echo 'checked="checked"';
	echo' /><span>Homme <input type="radio" name="sexe" value="Femme" required="required" onChange="afficher_div("div_photo");"
	';
	if($j1['sexe_eleve']=="Femme") echo 'checked="checked"';
	echo'/><span>Femme</span></label>
    </div><span class="clearfix"></span>
</div>
	
    <div  id="div_photo">
    <label class="title"><span class="required">Photo de l\élève</span></label>
    <div class="item-cont"><input   class="large" type="file" name="logo" required="required"/><span class="icon-place"></span></div></div>
        
	
    
	        <div class="element-radio" id="div_redouble" ><label class="title"><span class="required">Redouble la classe?</span></label>
    <div class="column column1"><label><input type="radio" name="redouble" value="oui" required="required" ';
	if($j1['redouble_eleve']=="oui") echo 'checked="checked"';
	echo' /><span> Oui
	 <input type="radio" name="redouble" value="non" required="required"
	 ';
	if($j1['redouble_eleve']=="non") echo 'checked="checked"';
	echo' /><span> Non </span></label>
    </div><span class="clearfix"></span>
</div>
        <i></i><span class="icon-place"></span></span></div></div></div>
  <div id="t"></div>
	<div class="element-phone" id="div_contact">
    <label class="title">Contact du parent</label>
    <div class="item-cont"><input class="large" required="required" type="text" value="'.$j1['contact_parent_eleve'].'"  maxlength="24" name="contact" placeholder="Exemple: 698843185 " /><span class="icon-place"></span></div></div>
     <input type="hidden" name="id_classe" value="'.$j1['id_classe'].'">
	 <input type="hidden" name="photo_eleve" value="'.$j1['photo_eleve'].'">
	 <input type="hidden" name="id_eleve" value="'.$j1['id_eleve'].'">


</form>

  <p><button onClick="hide_modif_profil();" style="font-size:16px">Fermer</button></p> 
  </div>';
}
//////////////////////////////
	///////////////////////////
	/////////////////////////////fin formulaire de modification du profil.
////////////////////---------------------------fin affichage du formulaire de modification du profil de l'élève profil de l'élève-----------------------------------

/////////////////////------------------------------------------------------------------------affichage du profil de l'eleve-------------------

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
if(isset($_POST['id_eleve_recu']) and !empty($_POST['id_eleve_recu']) )
{   	
	$id=$_POST['id_eleve_recu'];
 
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

//-----------on cherche les recu de l'élève dans la table recu
	$req_recu=mysqli_query($mysqli, "select *from recu where id_eleve=$id order by date_enre_recu asc");
	
	
	echo '<div class="confirm" id="profil">
	<img src="'.$dossier_source.'" height="100" width="100"/>
  <p style=" font-size:16px; text-align:center;">
  <strong style="font-family: serif; font-size:16px; color:#06F;">Recus de '.$j1['nom_eleve'].'  '.$j1['prenom_eleve'].'</strong>
  
  
  <table class="table table-striped table-bordered table-hover" width="100%">';

  while ($recu=mysqli_fetch_array($req_recu)){
                                        echo'<tr>
                                            <th><strong style="font-size:16px;">
											<a href="'.$recu['lien_recu'].'" target="_blank">'.$recu['nom_recu'].'
											</a>
											</strong></th>
                                            <th>Du '.affiche_date($recu['date_enre_recu']).'</th>
                                        </tr>
										
										';    
}
                                    echo'</table>
  <button onClick="hide_profil();" style="font-size:16px">Fermer</button> 
 
  </p>
  </div>';
}
//dans ce bloc, nous allons recuperer les informations portant sur l'eleve et les tranche qu'il a paye pour les affiche
if(isset($_POST['nom_eleve']) and !empty($_POST['nom_eleve'])  )
{
	 echo $id=$_POST['nom_eleve'];
	$p=mysqli_query($mysqli, "select *from paiement_tranche where id_eleve=$id order by numero_tranche_paiement asc");
	$i=0;
		while($tp=mysqli_fetch_array($p)){ $reste=$tp['montant_tranche']-$tp['montant_paye'];
		$i++;
		if($reste<=0)$reste=0;
			echo'<div ></hr></div>
			<h3 align="center"><u>Tranche N°'.$tp['numero_tranche_paiement'].' ('.$tp['montant_tranche'].' FCFA)</u>
			<a href="#" onclick="show_modif_tranche('.$i.', '.$tp['id_eleve'].');"><img src="images/edit.png" height="30" width="30"/><a>
			 
			</h3> ';
			//echo '<h4 >Du: <strong style="font-size:18">'.@$tp['date_debut_paiement'].'</strong>   Au: <strong style="font-size:18">'.@$tp['date_fin_paiement'].'.</strong> </br>';
			
			echo '	<div class="element-name"><label class="title">
    <span class="required">Montant versé ('.$tp['montant_paye'].' FCFA)</span></label>';
   
   if($reste<=0)echo '<img src="images/ok.png" height="30" width="30"/>
   <input type="hidden" name="montant'.$i.'" id="reste" value="0"/>
   ';else echo'
    <span class="nameLast" id="div_nom" >
    <input placeholder="EX: '.$tp['montant_tranche'].' "  type="number" min="0" size="8" name="montant'.$i.'"  id="montant" required="required" /><span class="icon-money">
	<strong style="font-size:12px">Reste: '.$reste.' FCFA</strong>';
	
	echo'<input type="hidden" name="id_eleve" id="reste" value="'.$tp['id_eleve'].'"/>
	<input type="hidden" name="nombre_tranche" id="reste" value="'.$i.'"/>
	<input type="hidden" name="montant_verse'.$i.'" id="reste" value="'.$tp['montant_paye'].'"/>
	</span></span>
 
			';
		}
		echo '<div class="submit" id="div_enregistrer"  ><input type="submit" id="div_enregistrer" value="Enrégistrer"/></div>';
	
    }
//***********************fin de la recuperation des informations de l'eleve*****************

if(isset($_POST['classe']) and !empty($_POST['classe'])  )
{
	 $id=$_POST['classe'];
	$t=mysqli_query($mysqli, "select *from eleve where id_classe=$id and visible_eleve!='$visible' order by nom_eleve asc");
	
	$t2=mysqli_query($mysqli, "select *from classe where id_classe=$id");
	
	$t22=mysqli_fetch_array($t2); $id_sco=$t22['id_scolarite'];
	
	$t3=mysqli_query($mysqli, "select *from scolarite where id_scolarite=$id_sco ");
	$t33=mysqli_fetch_array($t3);
	$n=$t33['nbr_tranche'];
	
	$t4=mysqli_query($mysqli, "select *from tranche where id_scolarite=$id_sco ");
	$compt=mysqli_num_rows($t);
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli, "select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucun élève n\'a été enrégistré dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else {
	echo '
	
    <div class="element-select" id="div_classe" k>
    <div class="item-cont"><div class="large"><span><select onchange="paiement_tranche_eleve(this.value);" name="annee_scolaire" id="nom_eleve" required="required">
    <option  value=""  selected="selected">-------- Sélectionnez le nom de l\'élève--------</option>';
		 while($t10=mysqli_fetch_array($t)){ 
    echo '<option value="'.$t10['id_eleve'].'">'.$t10['nom_eleve'].' '.$t10['prenom_eleve'];
        }       
        echo'</select></div></div>';
        echo '<div id="resultat_paiement_eleve">
        
        </div>';		
		}//fin de la condition if($compt==0)
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
		echo'					
									
									<a href="../fpdf/fpdf_liste_appel.php?id_classe_liste_a_generer='.$id.'" target="_blank"><h4>Générer la liste d\'appel</h4></a>
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
		while($tt=mysqli_fetch_array($t)){$i++;
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>
                                            <td>'.$tt['matricule_eleve'].'</td>
                                            <td>'.$tt['pass_eleve'].'</td>
                                            <td>
											   <a href="#" onClick="affichage_profil('.$tt['id_eleve'].');"><img src="images/image connexion.png" height="20" width="20"/></a>';
									/*		   <a href="#" onClick="modif_profil('.$tt['id_eleve'].');"><img src="images/edit.png" height="15" width="20"/></a>*/
								echo'			    <a href="#" onClick="recu_eleve('.$tt['id_eleve'].');"><img src="images/recu.png" height="25" width="30"/></a>
											   <a href="#" onClick="confirm_supprime('.$tt['id_eleve'].');"><img src="images/false.png" height="10" width="10"/></a>
											</td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';
	}//fin du else
}

if(isset($_POST['id_classe_liste_a_generer']) and !empty($_POST['id_classe_liste_a_generer'])  )
{
	 $id=$_POST['id_classe_liste_a_generer'];
	//on inclu le fichier fpdf liste appel
	echo '<script language="javascript"> document.location.href="../fpdf/fpdf_liste_appel.php?id='.$id.'";</script>';
}
//**************--------------------affichage des élèves insolvable*****************----------------------------------------------
if(isset($_POST['affiche_eleve_insolvable']) and !empty($_POST['affiche_eleve_insolvable'])  )
{
	$id=$_POST['affiche_eleve_insolvable'];
	$t=mysqli_query($mysqli, "select *from  eleve where visible_eleve!='$visible' and id_classe=$id order by nom_eleve, prenom_eleve asc");
	
	//on compte le nombre de tranche que l'élève pay normalement.
	$compt=mysqli_num_rows($t);
	$i=0;
	if ($compt==0){
		$ti=mysqli_query($mysqli, "select *from classe where id_classe=$id");
		$tabi=mysqli_fetch_array($ti);
	echo '<h4>Aucun élève trouvé dans la salle: <strong>'.$tabi['nom_unique_classe'].$tabi['numero_classe'].'</strong></h4>';
	}
	else{
		$tnb=mysqli_query($mysqli, "select *from classe C, scolarite S, tranche T 
											 where C.id_classe=$id and S.id_scolarite = C.id_scolarite and S.id_scolarite = T.id_scolarite");
		echo'<a href="../fpdf/fpdf_liste_etat.php?id_classe_liste_etat_generer='.$id.'" target="_blank" ><h4>Générer une liste d\'état</h4></a>
									<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th> #</th>
                                            <th>Noms & Prénoms</th>';
											$x=0;
											while($ttnb=mysqli_fetch_array($tnb)){$x++;
                                            echo '<th>Tranche N°'.$x.' </br>('.$ttnb['montant_tranche'].' FCFA)</th>';}
                                        
									echo'	</tr>
                                    </thead>';
		  
		  $i=0;
		while($tt=mysqli_fetch_array($t)){$i++; 
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>';
											$id_e=$tt['id_eleve'];
											$r=mysqli_query($mysqli, "select *from paiement_tranche where id_eleve=$id_e");
											while($ttt=mysqli_fetch_array($r)){
											$rest= $ttt['montant_tranche']-$ttt['montant_paye'];
											if ($rest<=0)
											echo '<td><img src="images/ok.png" width="30" height="30"/></td>';
											else
                                           echo' 
                                            <td>Payé:  <strong>'.$ttt['montant_paye'].' FCFA</strong></br>
											Reste: <strong style="color:#900">'.$rest.' FCFA</strong></td>';
											}
											echo'
                                        </tr>';
                                      } 
                                    echo '</tbody> </table>';
	}//fin du else
}//*****************-----------------------fin de l'affichage de l liste des élèves insolvable***************-----------------------
?>
<?php // modification des information de l'élève
if(isset($_POST['nom'])){
if(isset($_POST['nom']) and isset($_POST['prenom']) and isset($_POST['classe']) and isset($_POST['date_naissance']) and isset($_POST['lieu_naissance']) and isset($_POST['sexe']) and isset($_POST['contact']) and isset($_POST['redouble']) and isset($_POST['montant_inscription']) and isset($_POST['annee_scolaire']) and !empty($_POST['nom']) and !empty($_POST['prenom']) and !empty($_POST['classe']) and !empty($_POST['date_naissance']) and !empty($_POST['lieu_naissance']) and !empty($_POST['sexe']) and !empty($_POST['contact']) and !empty($_POST['redouble']) and !empty($_POST['montant_inscription']) and !empty($_POST['annee_scolaire']))
{     $nom=$_POST['nom'];
	  $prenom=$_POST['prenom'];
	  $date_naissance=$_POST['date_naissance'];
	  $lieu_naissance=$_POST['lieu_naissance'];
	  $sexe=$_POST['sexe'];
	  $contact=$_POST['contact'];
	  $redouble=$_POST['redouble'];
	  $montant_inscription=$_POST['montant_inscription'];
	  $annee_scolaire=$_POST['annee_scolaire'];
	  $temps=time();
	 // $matricule=" ";
	  //$pass=code_aleatoire(8);//on genere un mot de passe aléatoire
	  $id_classe=$_POST['classe'];
	  echo '<script language="javascript"> alert("Votre nouveau nom est '.$nom.' et le prenom est '.$prenom.'");</script>';
}
 else if( (isset($_POST['nom']) or isset($_POST['prenom']) or isset($_POST['classe']) or isset($_POST['date_naissance']) or isset($_POST['lieu_naissance']) or isset($_POST['sexe']) or isset($_POST['contact']) or isset($_POST['redouble']) or isset($_POST['montant_inscription']) or isset($_POST['annee_scolaire']) )and ( empty($_POST['nom']) or empty($_POST['prenom']) or empty($_POST['classe']) or empty($_POST['date_naissance']) or empty($_POST['lieu_naissance']) or empty($_POST['sexe']) or empty($_POST['contact']) or empty($_POST['redouble']) or empty($_POST['montant_inscription']) or empty($_POST['annee_scolaire'])) )
{echo $message = '<script language="javascript"> alert("Tous les champs doivent être remplis.");</script> ';}
}
//---------------------------------------------------modification des tanche----------------------------------------------------------------------------
if( isset($_POST['a']) and isset($_POST['a']) )
{ //si la variable "a" existe, cela veut dire que l'utilisateur soiuhaite modifier son profil
	 echo '
			
			<div class="confirm" id="modif_tranche" class="element-number" style=" background:color:#2F6">
			<h1 style=" font-size:14px"><strong>Modification de la tranche N°'.$_POST['a'].'</strong></h1>
			Entrez le montant(en fcfa).  Ce montant sera pris en compte pour cette tranche.  
			<form method="post" action="">
			<input  type="number" placeholder="Ex: 15000" min="0" name="mon_tranche" style="border-radius:1px; height="10px""   required="required" />
  			<input  type="hidden"  name="numero_tranche" value="'.$_POST['a'].'" />
			<input  type="hidden" name="id_eleve_tranche" value="'.$_POST['b'].'" />
  				<input type="submit" value="Enrégistrer" style="font-size:16px">
			</form>
				<p><button onClick="hide_modif_tranche();" style="font-size:16px">Annuler</button></p>
  </div>
			
			';
} //---------------------------------------------------------------------------------------------------------------------------------------------------
if( isset($_POST['search_etat']))
{
	$search=$_POST['search_etat'];

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
	$el=mysqli_fetch_array($requete);
	$id=$el['id_eleve'];
	$i=0;
	if ($compt==0){
		
	echo '<h4>Aucun nom ne correspond à votre recherche.</strong></h4>';
	}
	else{
		$tnb=mysqli_query($mysqli, "select *from classe C, scolarite S, tranche T 
											 where C.id_classe=$id and S.id_scolarite = C.id_scolarite and S.id_scolarite = T.id_scolarite");
								echo '<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms & Prénoms</th>';
											$x=0;
											while($ttnb=mysqli_fetch_array($tnb)){$x++;
                                            echo '<th>Tranche N°'.$x.' </br>('.$ttnb['montant_tranche'].' FCFA)</th>';}
                                        
									echo'	</tr>
                                    </thead>';
		  
		  $i=0;
		while($tt=mysqli_fetch_array($requete)){$i++; 
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$tt['nom_eleve'].' '.$tt['prenom_eleve'].'</td>';
											$id_e=$tt['id_eleve'];
											$r=mysqli_query($mysqli, "select *from paiement_tranche where id_eleve=$id_e");
											while($ttt=mysqli_fetch_array($r)){
											$rest= $ttt['montant_tranche']-$ttt['montant_paye'];
											if ($rest<=0)
											echo '<td><img src="images/ok.png" width="30" height="30"/></td>';
											else
                                           echo' 
                                            <td>Payé:  <strong>'.$ttt['montant_paye'].' FCFA</strong></br>
											Reste: <strong style="color:#900">'.$rest.' FCFA</strong></td>';
											}
											echo'
                                        </tr>';
                                      } 
                                    echo '</tbody> </table>';
	}//fin du else
	
}
//-----------------------------------------------------------------------------------------------------------------------------------------------
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
											   <a href="#" onClick="affichage_profil('.$tt['id_eleve'].');"><img src="images/image connexion.png" height="20" width="20"/></a>';
								/*			   <a href="#" onClick="modif_profil('.$tt['id_eleve'].');"><img src="images/edit.png" height="15" width="20"/></a>*/
					echo'						   <a href="#" onClick="recu_eleve('.$tt['id_eleve'].');"><img src="images/recu.png" height="25" width="30"/></a>
											   <a href="#" onClick="confirm_supprime('.$tt['id_eleve'].');"><img src="images/false.png" height="10" width="10"/></a>
											</td>
                                        </tr>';
                                       } 
                                    echo '</tbody> </table>';
	}//fin du else
	
}
////////////-------------------------------------------------------affichge du bilan d'inscription dans un intervalle de 6 jour///////////////////
if( isset($_POST['date_min']) and isset($_POST['date_max']))
{
	$date_min=$_POST['date_min']; $date_max=$_POST['date_max']; //on recupere l'intervalle de date dans lequel l'utilisateur souhaite voir le nombre d'inscription
	//on selectionne l'indentifiant de toutes les salle de classe
	$id_s=mysqli_query($mysqli, "select *from classe");
                              echo '
									<h4 > <strong style="color:#06F"> Nombre élèves inscrit par salle de classe.</strong></h4>
									<table class="table table-striped table-bordered table-hover">
									<thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Classes</th>
                                            <th>Nombre d\'inscrit</th>
                                            <th >Nbre Garcon(s)</th>
											<th >Nbre Fille(s)</th>
											 <th ></th>
                                        </tr>
                                    </thead>';
		  $i=0;
		while($t_s=mysqli_fetch_array($id_s)){
		$comp_fille=mysqli_num_rows(mysqli_query($mysqli, "select sexe_eleve from eleve where date_enre_eleve>=$date_min and date_enre_eleve<=$date_max and sexe_eleve='Femme' and id_classe='".$t_s['id_classe']."'and visible_eleve!='non'"));
		$comp_garcon=mysqli_num_rows(mysqli_query($mysqli, "select sexe_eleve from eleve where date_enre_eleve>=$date_min and date_enre_eleve<=$date_max and sexe_eleve='Homme' and id_classe='".$t_s['id_classe']."'and visible_eleve!='non'"));
		$effectif=mysqli_num_rows(mysqli_query($mysqli, "select id_eleve from eleve where date_enre_eleve>=$date_min and date_enre_eleve<=$date_max and id_classe='".$t_s['id_classe']."' and visible_eleve!='non'"));
		
					if($effectif!==0){$i++;
									echo '
                                    <tbody>
										<tr>
                                            <td>'.$i.'</td>
                                            <td>'.$t_s['nom_unique_classe'].$t_s['numero_classe'].'</td>
                                            <td><strong style="font-size:18px">'.$effectif.'</strong></td>
                                            <td>'.$comp_garcon.'</td>
											<td>'.$comp_fille.'</td>
                                            <td>
											   <a href="#" onClick=""><img src="images/cadenas-ouvert.png" height="20" width="20"/></a>
											</td>
                                        </tr>';}//fin du if
                                       } 
									   $comp_Tfille=mysqli_num_rows(mysqli_query($mysqli, "select sexe_eleve from eleve where date_enre_eleve>=$date_min and date_enre_eleve<=$date_max and sexe_eleve='Femme' and visible_eleve!='non'"));
		$comp_Tgarcon=mysqli_num_rows(mysqli_query($mysqli, "select sexe_eleve from eleve where date_enre_eleve>=$date_min and date_enre_eleve<=$date_max and sexe_eleve='Homme' and visible_eleve!='non'"));
		$Teffectif=mysqli_num_rows(mysqli_query($mysqli, "select id_eleve from eleve where date_enre_eleve>=$date_min and date_enre_eleve<=$date_max  and visible_eleve!='non'"));
                                    echo '
									<tr>
                                            <th colspan="2" align="center"><strong style=" font-size:18px; color: #090;">TOTAL</sto
											</th>
                                            
                                            <th><strong style="font-size:20px"><strong style=" font-size:18px; color: #090;">'.$Teffectif.'</strong></th>
                                            <th><strong style=" font-size:18px; color: #090;">'.$comp_Tgarcon.'</strong></th>
											<th><strong style=" font-size:18px; color: #090;">'.$comp_Tfille.'</strong></th>
                                        </tr>
									</tbody> </table>';
}
//////////////////////////////-----------------------------------------fin de l'affichge du bilan des inscription/////////////////////////////////////
?>
