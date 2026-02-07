<?php include "../php/configurations_etablissement.php"; ?>
<?php include "../php/fonctions_php.php"; ?>
<?php include "../php/nel.php"; ?>
<?php
require('fpdf.php');
$visible="non";
	
if (isset($_GET['id_classe_liste_a_generer']) and isset($_GET['id_classe_liste_a_generer']) )
{	$id_classe=$_GET['id_classe_liste_a_generer'];//id classe

	
	////////////////////////////////////////////////////////////information de l'établissement///////////////
	$e=mysqli_fetch_array(mysqli_query($mysqli, "select *from etablissement"));
	$id_e=$e['id_etablissement'];
	$nom_e=utf8_decode($e['nom_etablissement']);
	  $devise_e=utf8_decode($e['devise_etablissement']);
	  $ville_e=utf8_decode($e['ville_etablissement']);
	  $logo_etablissement.=$e['logo_etablissement'];
	  $quartier_e=utf8_decode($e['quartier_etablissement']);
	  $contact_e=utf8_decode($e['contact_etablissement']);
	  //------------------------selection de l'nnée scolaire----------
	  	$a=mysqli_fetch_array(mysqli_query($mysqli, "select *from annee_scolaire where id_etablissement=$id_e"));
		$annee_scolaire= $a['nom_annee_scolaire'];
	  //----------------------------------------------------------------------------------
	///////////////////////////////////////fin de la sélection des informations de l'etablissement//////////////////
	
	////////////////////selection des informations des enseignants////////////////////////////////////////////////////////////
	$visible="non";
		  $ele0=mysqli_query($mysqli, "select *from affectation_matiere A, personnel P where A.id_classe=$id_classe and P.id_personnel=A.id_enseignant order by nom_personnel ,prenom_personnel asc");
//---------------------------------------------------------------

//----------/////selection de l'enseignant titulaire
$titu=mysqli_fetch_array(mysqli_query($mysqli, "select *from classe C, personnel P where C.id_classe=$id_classe and P.id_personnel=C.id_enseignant_titulaire   order by nom_personnel ,prenom_personnel asc"));
//------------------------------------------------------------------

/////////////////////-nom de la classe
	  $cla=mysqli_fetch_array(mysqli_query($mysqli, "select id_classe,nom_unique_classe,numero_classe from classe where id_classe=$id_classe"));
	  	  $classe=utf8_decode($cla['nom_unique_classe']);
		  $nu_classe=$cla['numero_classe'];
//--------------------------------------------------------------------
		
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
$pdf->Cell(66);
$pdf->SetFont('Times','B',16);
$pdf->Cell(0,7,"LISTE DES ENSEIGNANTS",'C');
$pdf->Ln(2);
$pdf->Cell(66);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"__________________________________________________________________",'C');
//------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12); $nu="N°";$nu=utf8_decode($nu);
$pdf->Cell(0,10,utf8_decode('CLASSE/ '.$classe.' '.$nu_classe),'C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(8);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12); 
$pdf->Cell(0,10,'ENSEIGNANT TITULAIRE: '.@sexe($titu['sex_personnel']).' '.utf8_decode($titu['nom_personnel']).'  '.utf8_decode($titu['prenom_personnel']).' ','C');
//------------------------------------------------------------------------
//-----------------------------------debut de l'affichage de lentete du tableau de la liste d'appel------------------------------
$pdf->Ln(12);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,utf8_decode('Noms/Prénoms'),'1','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(100);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,utf8_decode('Matière dispensée'),'1','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(160);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,'Coef','1','C');
//------------------------------------------------------------------------
//--------fin de l'affichage de l'entete du table----------------------------------------------------------------


//-----------------------------------debut de l'affichage des noms des eleves------------------------------
$i=0;
while ($ele=mysqli_fetch_array($ele0) ){$i++;
//on cherche la matière dispensée par l'enseignant et son coefficient.
$mat=mysqli_fetch_array(mysqli_query($mysqli, "select *from matiere M, affectation_matiere A where M.id_matiere='".$ele['id_matiere']."' and A.id_matiere='".$ele['id_matiere']."' and A.id_classe=$id_classe"));

$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','',12);
$pdf->Cell(0,10,$i.'. '.@sexe($ele['sex_personnel']).' '.utf8_decode($ele['nom_personnel']).'  '.utf8_decode($ele['prenom_personnel']).' ','1','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(100);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','',12);
$pdf->Cell(0,10,utf8_decode($mat['nom_matiere']),'1','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(160);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','',12);
$pdf->Cell(0,10,$mat['coef_matiere'],'1','C');
}

//creation du dossier qui comportera les liste d'appel

$et=mysqli_fetch_array(mysqli_query($mysqli, "select *from etablissement"));
$nom_etablissement=majuscule($et['nom_etablissement']);
	 $nom_dossier="Fichiers";
	  $classe=str_replace('/','_',$cla['nom_unique_classe']); $classe.=" "; $classe.=$cla['numero_classe'];//le tableau cla[] comporte les information de la classe
	  $annee_scolaire=str_replace('/','-',$annee_scolaire);
	  
	  $date_jour = str_replace(
      array('/', ':'),
      array('_', '_'),
      affiche_date(time()));
	
///////////////-------------------------------------enregistrement de la liste d'appel dans le serveur ///////////////////////////////////////////
///////////////-------------------------------------enregistrement de la liste d'appel dans le serveur ///////////////////////////////////////////
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
	
	$dossier_source= sous_repertoire($dossier_source, $nom_dossier); //lien du ciquieme sous repertoire
	if (!is_dir($dossier_source)){
			mkdir($dossier_source);}
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------

///////////////-------------------------------------enregistrement de la liste d'appel dans le disque D ///////////////////////////////////////////
///////////////-------------------------------------enregistrement de la liste d'appel dans le disque D///////////////////////////////////////////
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
	
	$dossier_source2= sous_repertoire($dossier_source2, $nom_dossier); //lien du ciquieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------
	$dossier_source.="liste_enseignant";
	$dossier_source.=$date_jour;
	 $dossier_source.=".pdf";
	 
	 $dossier_source2.="liste_enseignant";
	$dossier_source2.=$date_jour;
	 $dossier_source2.=".pdf";
//$pdf->Output("pdf/$message", "F"); //on enregistre le fichier pdf dans le repertoire pdf

if (!is_dir($dossier_source)){
	if (!is_dir($dossier_source2))$pdf->Output("$dossier_source2", 'F');
	$pdf->Output("$dossier_source", 'F');
	if (mysqli_query($mysqli, 'insert into liste_appel(chemin_fichier_liste_appel, id_classe, date_enre_liste_appel) values("'.$dossier_source.'","'.$id_classe.'","'.time().'")')){$pdf->Output();}
}

}
//--------fin l'affichage des noms des eleves-------------------------------------------------------------
//------------------------------------------------------------------------

//$pdf->Cell(100,10,"aaaaaaaaaaaaaaaaaa",1,'C');	// Cell($largeur,$hauteur,$contenu,$bordure)On imprime ensuite une cellule grâce à Cell()
/*$pdf->Cell(60,10,'Powered by FPDF.',1);//Si on veut ajouter une nouvelle cellule à droite avec du texte centré et retourner à la ligne, on fait :
$pdf->Ln(10); 
$pdf->Cell(60,10,'Powered by FPDF.',1);*/

/*
$et=mysql_fetch_array(mysql_query("select *from etablissement"));
$nom_etablissement=majuscule($et['nom_etablissement']);
	 $nom=$_GET['nom'];
	 $prenom=$_GET['prenom'];
	 $id_vrai_classe=$_GET['id_classe'];
	  $cla=mysql_fetch_array(mysql_query("select *from classe where id_classe=$id_vrai_classe"));
	  $classe=$cla['nom_unique_classe']; $classe.=" "; $classe.=$cla['numero_classe'];
	  $annee_scolaire=str_replace('/','-',$_GET['annee_scolaire']);
	  $nom_eleve=utf8_decode( majuscule($nom)); $nom_eleve.=" "; $nom_eleve.=utf8_decode($prenom);
	  
	


$dossier_source='../'; //c'est dans ce repertoire qui contiendra l'acte à insérer.
	$dossier_source= sous_repertoire($dossier_source, '');
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
	$dossier_source.="Recu inscription.pdf";
//$pdf->Output("pdf/$message", "F"); //on enregistre le fichier pdf dans le repertoire pdf
if (!is_dir($dossier_source)){$pdf->Output("$dossier_source", 'F');
$pdf->Output();}
}
*/

?>
