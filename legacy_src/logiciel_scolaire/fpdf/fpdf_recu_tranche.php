<?php include "../php/configurations_etablissement.php"; ?>
<?php include "../php/fonctions_php.php"; ?>
<?php include "../php/nel.php"; ?>
<?php
require('fpdf.php');
$visible="non";
	
	//fin de la recupération des données
	
if (isset($_GET['id_classe_liste_etat_generer']) and isset($_GET['id_classe_liste_etat_generer']) )
{	$id_classe=$_GET['id_classe_liste_etat_generer'];//id classe
	$id_eleve=$_GET['id_eleve'];
			
	////////////////////////////////////////////////////////////information de l'établissement///////////////
	$e=mysqli_fetch_array(mysqli_query($mysqli,"select *from etablissement"));
	$id_e=$e['id_etablissement'];
	$nom_e=utf8_decode($e['nom_etablissement']);
	  $devise_e=utf8_decode($e['devise_etablissement']);
	  $ville_e=utf8_decode($e['ville_etablissement']);
	  $logo_etablissement.=$e['logo_etablissement'];
	  $quartier_e=utf8_decode($e['quartier_etablissement']);
	  $contact_e=utf8_decode($e['contact_etablissement']);
	  //------------------------selection de l'nnée scolaire----------
	  	$a=mysqli_fetch_array(mysqli_query($mysqli,"select *from annee_scolaire where id_etablissement=$id_e"));
		$annee_scolaire= $a['nom_annee_scolaire'];
	  //----------------------------------------------------------------------------------
	///////////////////////////////////////fin de la sélection des informations de l'etablissement//////////////////
		
		//////////////////////////information du prof titulaire
				//$t=mysql_fetch_array(mysql_query("select *from personnel where id_personnel=$id_personnel"));		
		///////////////////////////////


$eta=mysqli_fetch_array(mysqli_query($mysqli, "select *from etablissement E, annee_scolaire A where A.id_etablissement=E.id_etablissement"));
$et=mysqli_fetch_array(mysqli_query($mysqli,"select *from eleve where id_eleve=$id_eleve"));
$nom_etablissement=majuscule($eta['nom_etablissement']);

	 $nom=$et['nom_eleve'];
	 $prenom=$et['prenom_eleve'];
	 $id_vrai_classe=$_GET['id_classe_liste_etat_generer'];
	  $cla=mysqli_fetch_array(mysqli_query($mysqli,"select *from classe where id_classe=$id_vrai_classe"));
	  $classe=$cla['nom_unique_classe']; $classe.=" "; $classe.=$cla['numero_classe'];
	  $annee_scolaire=str_replace('/','-',$eta['nom_annee_scolaire']);
	  $nom_eleve=utf8_decode( majuscule($nom)); $nom_eleve.=" "; $nom_eleve.=utf8_decode($prenom);
	   $date_jour = str_replace(
      array('/', ':'),
      array('_', '_'),
      affiche_date(time()));
		
$pdf = new FPDF('P','mm','A4');//'P' c'est la page en portrai. en paysage c'est 'L'. 'mm' c'est l'unite de mesure 'A4' c'est le format 
$pdf->AddPage();
//---------------------------------------------------------------------------------------------------------------------
$pdf->SetFont('Arial','B',11); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(12);
$pdf->Cell(0,10,"REPUBLIQUE DU CAMEROUN",'C');
$pdf->Ln(0);
$pdf->Cell(120);
$pdf->Cell(0,10,"REPUBLIC OF CAMEROON",'C');
//-----------------------------------------------------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(28);
$pdf->Cell(0,7,"PAIX - TRAVAIL - PATRIE",'C');
$pdf->Ln(0);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(128);
$pdf->Cell(0,7,"PEACE - WORK - FATHERLAND",'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->Cell(25);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"---------------------------------------------",'C');
$pdf->Ln(0);
$pdf->Cell(125);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"-----------------------------------------------------",'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->SetFont('Arial','B',9); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(0,10,"MINISTERE DES ENSEIGNEMENTS SECONDAIRES",'C');
$pdf->Ln(0);
$pdf->Cell(115);
$pdf->SetFont('Arial','B',9); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(0,10,"MINITRY OF SECONDARY EDUCATION",'C');
$pdf->Ln(5);
$pdf->Cell(17);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"----------------------------------------------------------------",'C');
$pdf->Ln(0);
$pdf->Cell(120);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"----------------------------------------------------------------",'C');
////---------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->Cell(28);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,10,utf8_decode("Année scolaire: ".$annee_scolaire),'C');
$pdf->Ln(0);
$pdf->Cell(128);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,10,utf8_decode("School year: ".$annee_scolaire),'C');
////////////-------------------------------------------------------------------------------------------------------------------------------
$pdf->Image(''.$logo_etablissement.'', $x=90, $y=5,30,30); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)
$pdf->Ln(10);
$pdf->Cell(40);
$pdf->SetFont('Arial','B',13); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(0,10,utf8_decode($nom_e),'C');
//-----------------------------------------------------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->SetFont('Arial','I',8);
//------------------------------------------------------------------
$pdf->Cell(0,7,utf8_decode("Situé à: ".$ville_e." :".$quartier_e.".       BP: 1257 ......"),'C');
//--------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(70);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,7,utf8_decode($devise_e),'C');
//------------------------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(125);
$pdf->SetFont('Arial','I',8);
$pdf->Cell(0,7,"Tel: ".$contact_e,'C');

//-------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->Cell(70);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"-----------------------------------------------------",'C');
//-------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"............................................................................................................................................................................................................................................................................................................................",'C');
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------Fin de l'entête des document de l'etablissement-------------------------------

$pdf->Ln(10);
$pdf->Cell(50);
$pdf->SetFont('Times','B',16);
$pdf->Cell(0,7,"RECU PAIEMENT DES TRANCHES",'C');
$pdf->Ln(2);
$pdf->Cell(50);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"______________________________________________________________________",'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->SetFont('Arial','B',10);
//------------------------------------------------------------------
$cla=mysqli_fetch_array(mysqli_query($mysqli,"select *from classe where id_classe=$id_classe "));
$pdf->Cell(0,7,utf8_decode("CLASSE: ".$cla['nom_unique_classe'].$cla['numero_classe']),'C');

//-----------------------------------debut de l'affichage de lentete du tableau de la liste d'appel------------------------------
$pdf->Ln(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,utf8_decode("Nom(s) & Prénom(s) : ".$nom." ".$prenom),'','C');
//------------------------------------------------------------------------
$t=mysqli_query($mysqli,"select *from  eleve where visible_eleve!='$visible' and id_classe=$id_classe order by nom_eleve, prenom_eleve asc");
//on compte le nombre de tranche que l'élève pay normalement.
$compt=mysqli_num_rows($t);	
$tnb=mysqli_query($mysqli,"select *from classe C, scolarite S, tranche T 
where C.id_classe=$id_classe and S.id_scolarite = C.id_scolarite and S.id_scolarite = T.id_scolarite");
$a=80;		
$x=0;
//----------------------------------------------------------------------------------------------------------------
while($ttnb=mysqli_fetch_array($tnb)){$x++;
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',13);
$pdf->Cell(0,10,utf8_decode("Tranche N° ").$x."    ( ".$ttnb['montant_tranche']." FCFA)",'1','C');

$r=mysqli_fetch_array(mysqli_query($mysqli,"select *from paiement_tranche where id_eleve=$id_eleve and numero_tranche_paiement=$x"));
$rest= $r['montant_tranche']-$r['montant_paye'];
if ($rest<=0){
$pdf->Ln(10); 
$pdf->Cell(10);
$pdf->SetTextColor(64,240,204);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,"OK",'','C');
$pdf->Ln(10); 
$pdf->Cell(10);
$pdf->Cell(0,10,utf8_decode("Montant versé: ".$r['montant_paye']." FCFA"),'','C');

}
else{
$pdf->Ln(10); 
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,utf8_decode("Montant versé: ".$r['montant_paye']." FCFA"),'','C');
$pdf->Ln(7); 
$pdf->Cell(40);
$pdf->SetFont('Times','I',12);
$pdf->Cell(0,10,enlettres($r['montant_paye'])." FCFA ",'','C');
$pdf->Ln(7);
$pdf->Cell(10);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,utf8_decode("Montant restant: ".$rest." FCFA"),'','C');
$pdf->Ln(7); 
$pdf->Cell(40);
$pdf->SetFont('Times','I',12);
$pdf->Cell(0,10,enlettres($rest)." FCFA ",'','C');
}
}
//-----------------------------------------------------------------------------
$pdf->Ln(20);
$pdf->Cell(30);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','BI',12);
$pdf->Cell(10,10,utf8_decode("Visa de l'élève"),'C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','BI',12);
$pdf->Cell(10,10,utf8_decode('Visa scolarité'),'C');
//------------------------------------------------------------------------


//-----------------------------------------------------------------------------
$pdf->Ln(15);
$pdf->Cell(100);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(10,10,utf8_decode("Délivré le: ").utf8_decode(affiche_date(time())),'C');

//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->Cell(105);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(10,10,'Par: ','C');
//--------------------------------------------------------------------------------------------------------------------------------
/*while($ttnb=mysql_fetch_array($tnb)){$x++;
$pdf->Ln(10); 
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,10,utf8_decode("Tranche N°").$x."(".$ttnb['montant_tranche']." fcfa)",'1','C');
$a=$a+35;}

//-----------------------------------debut de l'affichage des noms des eleves------------------------------
$ii=0;
while($tt=mysql_fetch_array($t)){$ii++; 
$pdf->Ln(10); 
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,10,$ii.".  ".utf8_decode($tt['nom_eleve']." ".$tt['prenom_eleve']),'1','C');
//---------------------------------------------------------
$id_e=$tt['id_eleve'];
$r=mysql_query("select *from paiement_tranche where id_eleve=$id_e");
$a2=80;
while($ttt=mysql_fetch_array($r)){
$rest= $ttt['montant_tranche']-$ttt['montant_paye'];
if ($rest<=0){
$pdf->Ln(0); 
$pdf->Cell($a2);
$pdf->SetTextColor(64,240,204);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,"OK",'1','C');

}
else{
$pdf->Ln(0); 
$pdf->Cell($a2);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,10,utf8_decode("P: ".$ttt['montant_paye']."F | R: ".$rest)."F",'1','C');

}$a2=$a2+35;
}
}
*/
//creation du dossier qui comportera les liste d'appel

	 

$dossier_source='../'; //c'est dans ce repertoire qui contiendra l'acte à insérer.
	 $dossier_source= sous_repertoire($dossier_source, $nom_etablissement); // lien du premier sous repertoire
 		if (!is_dir($dossier_source)){
			mkdir($dossier_source);} 
		
	 $dossier_source= sous_repertoire($dossier_source, $annee_scolaire); //lien du deuxieme sous repertoire
	if (!is_dir($dossier_source)){
			mkdir($dossier_source);}
			
	 $dossier_source= sous_repertoire($dossier_source, $classe); //lien du troixieme sous repertoire
	if (!is_dir($dossier_source)){
			mkdir($dossier_source);}
			
	$dossier_source= sous_repertoire($dossier_source, $nom_eleve); //lien du qutrieme sous repertoire
	if (!is_dir($dossier_source)){
			mkdir($dossier_source);}
	
	$dossier_source= sous_repertoire($dossier_source, "Recu"); //lien du ciquieme sous repertoire
	if (!is_dir($dossier_source)){
			mkdir($dossier_source);}
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------

//-------------------------------------------copie dans le disque D.---------------------
$dossier_source2='C:/'; //c'est dans ce repertoire qui contiendra l'acte à insérer.
	$dossier_source2= sous_repertoire($dossier_source2, $nom_etablissement); // lien du premier sous repertoire
 		if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);} 
		
	 $dossier_source2= sous_repertoire($dossier_source2, $annee_scolaire); //lien du deuxieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
			
	$dossier_source2= sous_repertoire($dossier_source2, $classe); //lien du troixieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
			
	$dossier_source2= sous_repertoire($dossier_source2, $nom_eleve); //lien du qutrieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
	
	$dossier_source2= sous_repertoire($dossier_source2, "Recu"); //lien du ciquieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------
	
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------
	$dossier_source.="Recu_paiement_tranche ";
	$dossier_source.=$date_jour;
	 $dossier_source.=".pdf";
	 
	 $dossier_source2.="Recu_paiement_tranche";
	$dossier_source2.=$date_jour;
	 $dossier_source2.=".pdf";
	 $nom_recu="Recu_paiement_tranche";
//$pdf->Output("pdf/$message", "F"); //on enregistre le fichier pdf dans le repertoire pdf

if (!is_dir($dossier_source)){
	mysqli_query($mysqli,"insert into recu (id_eleve, nom_recu, lien_recu, date_enre_recu) value('".$id_eleve."', '".$nom_recu."','".$dossier_source."', '".time()."')");
	if (!is_dir($dossier_source2)){$pdf->Output("$dossier_source2", 'F');
	$pdf->Output("$dossier_source", 'F');
	$pdf->Output();}
}

}
//--------fin l'affichage des noms des eleves-------------------------------------------------------------
//------------------------------------------------------------------------

?>
