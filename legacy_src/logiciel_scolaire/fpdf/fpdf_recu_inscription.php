<?php include "../php/configurations_etablissement.php"; ?>
<?php include "../php/fonctions_php.php"; ?>
<?php include "../php/nel.php"; ?>
<?php
require('fpdf.php');
$visible="non";
/*
$pdf = new FPDF('P','mm','A4');//'P' c'est la page en portrai. en paysage c'est 'L'. 'mm' c'est l'unite de mesure 'A4' c'est le format 
$pdf->AddPage();
$pdf->SetFont('Arial','B',16); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$message="Je suis entri de vouloir monter un pdf.pdf";
$pdf->Cell(100,10,"aaaaaaaaaaaaaaaaaa",1,'C');	// Cell($largeur,$hauteur,$contenu,$bordure)On imprime ensuite une cellule grâce à Cell()
$pdf->Cell(60,10,'Powered by FPDF.',1);//Si on veut ajouter une nouvelle cellule à droite avec du texte centré et retourner à la ligne, on fait :
$pdf->Ln(10); 
$pdf->Cell(60,10,'Powered by FPDF.',1);
//$pdf->Output("pdf/$message", "F"); //on enregistre le fichier pdf dans le repertoire pdf
$pdf->Output();*/
if (isset($_GET['nom']) and isset($_GET['prenom']) )
{	$id_personnel=$_GET['id_personnel'];
	$t=mysqli_fetch_array(mysqli_query($mysqli, "select *from personnel where id_personnel=$id_personnel"));
	$e=mysqli_fetch_array(mysqli_query($mysqli, "select *from etablissement"));
	//on recuper les donnees passees par url
	 $nom=utf8_decode($_GET['nom']);
	 $prenom=utf8_decode($_GET['prenom']);
	  $date_naissance=$_GET['date_naiss'];
	  $lieu_naissance=utf8_decode($_GET['lieu_naissance']);
	
	  $montant_inscription=$_GET['montant_inscription'];
	  $annee_scolaire=utf8_decode($_GET['annee_scolaire']);
	  $temps=$_GET['date_enre_eleve'];
	  $matricule=$_GET['matricule'];
	  $pass=utf8_decode($_GET['pass']);
	  $nom_personnel= utf8_decode($t['nom_personnel']);
	  $nom_personnel.= utf8_decode($t['prenom_personnel']);
	  $sexe= $t['sex_personnel'];
	  $nom_e=utf8_decode($e['nom_etablissement']);
	  $devise_e=utf8_decode($e['devise_etablissement']);
	  $ville_e=utf8_decode($e['ville_etablissement']);
	  $logo_etablissement.=$e['logo_etablissement'];
	  $quartier_e=utf8_decode($e['quartier_etablissement']);
	  $contact_e=utf8_decode($e['contact_etablissement']);
	  
	  $ele=mysqli_fetch_array(mysqli_query($mysqli,"select *from eleve where matricule_eleve='$matricule' and visible_eleve!='$visible' "));
	  $id=$ele['id_eleve'];
	  $idc=$ele['id_classe'];
	  $cla=mysqli_fetch_array(mysqli_query($mysqli,"select nom_unique_classe,numero_classe from classe where id_classe=$idc"));
	  	  $classe=utf8_decode($cla['nom_unique_classe']);
		  $nu_classe=$cla['numero_classe'];

	
	//fin de la recupération des données
		
	
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
//$pdf->Image(''.$logo_etablissement.'', $x=90, $y=5,30,30); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)
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
$pdf->Cell(66);
$pdf->SetFont('Times','B',16);
$pdf->Cell(0,7,"RECU D'INSCRIPTION",'C');
$pdf->Ln(2);
$pdf->Cell(66);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"___________________________________________________",'C');
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','U',14); $nu="N°";$nu=utf8_decode($nu);
$pdf->Cell(0,10,'RECU '.$nu.' '.$id,'C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,'NOMS & PRENOMS:','C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,$nom.' '.$prenom,'C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,utf8_decode("Né le : "),'C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,$date_naissance. utf8_decode(" à ").$lieu_naissance,'C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,'MATRICULE:','C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,$matricule,'C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,'PASS:','C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,$pass,'C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,'CLASSE: ','C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,$classe.$nu_classe,'C');
//------------------------------------------------------------------------

//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,'MONTANT:','C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(0); 
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,$montant_inscription.' FCFA','C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(5);
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,enlettres($montant_inscription).' FCFA','C');
//------------------------------------------------------------------------

//-----------------------------------------------------------------------------
$pdf->Ln(20);
$pdf->Cell(20);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','BI',12);
$pdf->Cell(10,10,utf8_decode("Visa de l'élève"),'C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','BI',12);
$pdf->Cell(10,10,utf8_decode('Visa scolarité'),'C');
//------------------------------------------------------------------------


//-----------------------------------------------------------------------------
$pdf->Ln(15);
$pdf->Cell(50);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(10,10,utf8_decode("Délivré le: ").utf8_decode(affiche_date($temps)),'C');

//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->Cell(55);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(10,10,'Par: ','C');
//------------------------------------------------------------------------

//$pdf->Cell(100,10,"aaaaaaaaaaaaaaaaaa",1,'C');	// Cell($largeur,$hauteur,$contenu,$bordure)On imprime ensuite une cellule grâce à Cell()
/*$pdf->Cell(60,10,'Powered by FPDF.',1);//Si on veut ajouter une nouvelle cellule à droite avec du texte centré et retourner à la ligne, on fait :
$pdf->Ln(10); 
$pdf->Cell(60,10,'Powered by FPDF.',1);*/


$et=mysqli_fetch_array(mysqli_query($mysqli,"select *from etablissement"));
$nom_etablissement=majuscule($et['nom_etablissement']);
	 $nom=$_GET['nom'];
	 $prenom=$_GET['prenom'];
	 $id_vrai_classe=$_GET['id_classe'];
	  $cla=mysqli_fetch_array(mysqli_query($mysqli,"select *from classe where id_classe=$id_vrai_classe"));
	  $classe=$cla['nom_unique_classe']; $classe.=" "; $classe.=$cla['numero_classe'];
	  $annee_scolaire=str_replace('/','-',$_GET['annee_scolaire']);
	  $nom_eleve=utf8_decode( majuscule($nom)); $nom_eleve.=" "; $nom_eleve.=utf8_decode($prenom);
	 

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
	
	$dossier_source.="Recu_inscription.pdf";
	$dossier_source2.="Recu_inscription.pdf";
//$pdf->Output("pdf/$message", "F"); //on enregistre le fichier pdf dans le repertoire pdf
 $nom_recu="Recu_inscription";
if (!is_dir($dossier_source)){
	mysqli_query($mysqli,"insert into recu (id_eleve, nom_recu, lien_recu, date_enre_recu) value('".$id."', '".$nom_recu."','".$dossier_source."', '".time()."')");
	if (!is_dir($dossier_source2)){$pdf->Output("$dossier_source2", 'F');
	$pdf->Output("$dossier_source", 'F');
	$pdf->Output();}
}
}



?>
