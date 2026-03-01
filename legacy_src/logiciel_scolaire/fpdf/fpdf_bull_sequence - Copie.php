<?php include "../php/configurations etablissement.php"; ?>
<?php include "../php/fonctions php.php"; ?>
<?php include "../php/nel.php"; ?>
<?php
require('fpdf.php');
$visible="non";
	//fin de la recupération des données
	$id_eleve=63;
	$id_sequence=1;

	////////////////////////////////////////////////////////////information de l'établissement///////////////
	$e=mysql_fetch_array(mysql_query("select *from etablissement"));
	$id_e=$e['id_etablissement'];
	$nom_e=utf8_decode($e['nom_etablissement']);
	  $devise_e=utf8_decode($e['devise_etablissement']);
	  $ville_e=utf8_decode($e['ville_etablissement']);
	  $quartier_e=utf8_decode($e['quartier_etablissement']);
	  $contact_e=utf8_decode($e['contact_etablissement']);
	  //------------------------selection de l'nnée scolaire----------
	  	$a=mysql_fetch_array(mysql_query("select *from annee_scolaire where id_etablissement=$id_e"));
		$annee_scolaire= $a['nom_annee_scolaire'];
	  //----------------------------------------------------------------------------------
	///////////////////////////////////////fin de la sélection des informations de l'etablissement//////////////////
		
		//////////////////////////information du prof titulaire
				//$t=mysql_fetch_array(mysql_query("select *from personnel where id_personnel=$id_personnel"));		
		///////////////////////////////


$eta=mysql_fetch_array(mysql_query("select *from etablissement E, annee_scolaire A where A.id_etablissement=E.id_etablissement"));
$et=mysql_fetch_array(mysql_query("select *from eleve where id_eleve=$id_eleve"));
$nom_etablissement=majuscule($eta['nom_etablissement']);

	 $nom=$et['nom_eleve'];
	 $prenom=$et['prenom_eleve'];$Homme="Homme"; $Femme="Femme"; $non="non";
	 
	 $cla_el=mysql_fetch_array(mysql_query("select *from eleve where id_eleve=$id_eleve"));
	 $id_vrai_classe=$cla_el['id_classe'];
	 
	  $cla=mysql_fetch_array(mysql_query("select *from classe where id_classe=$id_vrai_classe"));
	  $nombre_garcons=mysql_num_rows(mysql_query("select *from eleve where sexe_eleve='$Homme' and visible_eleve!='$non' and id_classe=$id_vrai_classe"));
	  $nombre_fille=mysql_num_rows(mysql_query("select *from eleve where sexe_eleve='$Femme' and visible_eleve!='$non' and id_classe=$id_vrai_classe"));
	  $effectif_classe=mysql_num_rows(mysql_query("select *from eleve where visible_eleve!='$non' and id_classe=$id_vrai_classe"));
	  $classe=$cla['nom_unique_classe']; $classe.=" "; $classe.=$cla['numero_classe'];
	  $annee_scolaire=str_replace('/','-',$eta['nom_annee_scolaire']);
	  $nom_eleve=utf8_decode( majuscule($nom)); $nom_eleve.=" "; $nom_eleve.=utf8_decode($prenom);
	  
	  ///-----------------on recherche le professeur titulaire
	  $titulaire=mysql_fetch_array(mysql_query("select *from personnel where id_personnel='".$cla['id_enseignant_titulaire']."'"));
	  //----------------------------------
	   $date_jour = str_replace(
      array('/', ':'),
      array('_', '_'),
      affiche_date(time()));
//---------------------------creation du repertoire dans le serveur wamp****-------------------------------
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
	
	$dossier_source= sous_repertoire($dossier_source, "Photo"); //lien du ciquieme sous repertoire
	if (!is_dir($dossier_source)){
			mkdir($dossier_source);}
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------
//---------------------------creation du repertoire dans le disque D****-------------------------------
$dossier_source2='D:/'; //c'est dans ce repertoire qui contiendra l'acte à insérer.
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
	
	$dossier_source2= sous_repertoire($dossier_source2, "Photo"); //lien du ciquieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------

$pdf = new FPDF('P','mm','A4');//'P' c'est la page en portrai. en paysage c'est 'L'. 'mm' c'est l'unite de mesure 'A4' c'est le format 
$pdf->AddPage();
//---------------------------------------------------------------------------------------------------------------------
$pdf->SetFont('Arial','B',9); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(12);
$pdf->Cell(0,10,"REPUBLIQUE DU CAMEROUN",'C');
$pdf->Ln(0);
$pdf->Cell(120);
$pdf->Cell(0,10,"REPUBLIC OF CAMEROON",'C');
//-----------------------------------------------------------------------------------------------------------------------
$pdf->Ln(5);
$pdf->SetFont('Arial','B',5);
$pdf->Cell(23);
$pdf->Cell(0,7,"PAIX - TRAVAIL - PATRIE",'C');
$pdf->Ln(0);
$pdf->SetFont('Arial','B',5);
$pdf->Cell(128);
$pdf->Cell(0,7,"PEACE - WORK - FATHERLAND",'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->Cell(20);
$pdf->SetFont('Arial','B',5);
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
$pdf->Cell(15);
$pdf->SetFont('Arial','B',5);
$pdf->Cell(0,7,"----------------------------------------------------------------",'C');
$pdf->Ln(0);
$pdf->Cell(125);
$pdf->SetFont('Arial','B',5);
$pdf->Cell(0,7,"----------------------------------------------------------------",'C');
////---------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(1);
$pdf->Cell(20);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,10,utf8_decode("Année scolaire: ".$annee_scolaire),'C');
$pdf->Ln(0);
$pdf->Cell(128);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,10,utf8_decode("School year: ".$annee_scolaire),'C');
////////////-------------------------------------------------------------------------------------------------------------------------------
$pdf->Image('logo.png', $x=90, $y=3,30,30); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)
$pdf->Ln(8);
$pdf->Cell(40);
$pdf->SetFont('Arial','B',12); //  SetFont(). On choisit de l'Arial gras en taille 16 :
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
$pdf->Ln(1);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"............................................................................................................................................................................................................................................................................................................................",'C');
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------Fin de l'entête des document de l'etablissement-------------------------------

$pdf->Ln(5);
$pdf->Cell(50);
$pdf->SetFont('Times','B',12);
$pdf->Cell(65,7,utf8_decode("BULLETIN SEQUENTIEL N° ".$id_sequence.""),'1','C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Nom / Name:"),'C');

$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Classe / Class:"),'C');
//------------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(15);
$pdf->SetFont('Times','B',8);
$pdf->Cell(85,7,utf8_decode($nom_eleve),'C');

$pdf->Ln(0);
$pdf->Cell(98);
$pdf->SetFont('Times','B',8);
$pdf->Cell(85,7,utf8_decode($classe),'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(4);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Prénom / Surname"),'C');

$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Sexe /......"),'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(23);
$pdf->SetFont('Times','B',8);
$pdf->Cell(85,7,utf8_decode($prenom),'C');

$pdf->Ln(0);
$pdf->Cell(96);
$pdf->SetFont('Times','B',8);
$pdf->Cell(85,7,utf8_decode(sexe_2($et['sexe_eleve'])),'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(4);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Matricule / Reference:"),'C');

$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Effectif / Roll:"),'C');
//----------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(26);
$pdf->SetFont('Times','B',8);
$pdf->Cell(85,7,utf8_decode($et['matricule_eleve']),'C');

$pdf->Ln(0);
$pdf->Cell(97);
$pdf->SetFont('Times','B',8);
$pdf->Cell(85,7,utf8_decode($effectif_classe." (".$nombre_garcons." garcons/boys | ".$nombre_fille." filles/girls)"),'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(4);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Date et lieu de naissance"),'C');

$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Adresse des parents"),'C');
//------------------------------------------------------------------------------------------------------------------------------------

$pdf->Ln(3);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Date and place of birth :"),'C');
$pdf->Ln(0);

$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Parent's address"),'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(29);
$pdf->SetFont('Times','B',8);
$pdf->Cell(85,7,utf8_decode($et['date_naiss_eleve'].' à '.$et['lieu_naiss_eleve']),'C');

$pdf->Ln(0);
$pdf->Cell(100);
$pdf->SetFont('Times','B',8);
$pdf->Cell(85,7,utf8_decode($et['contact_parent_eleve']),'C');
//------------------------------------------------------------------------------------------------------------------------------------
$dossier_source.="index.jpg";
$pdf->Image($dossier_source, $x=157, $y=49,30,30); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(4);
$pdf->Cell(5);
$pdf->SetFont('Times','I',9);
$pdf->Cell(85,7,utf8_decode("Professeur principal"),'C');

$pdf->Ln(2);
$pdf->Cell(10);
$pdf->SetFont('Times','I',6);
$pdf->Cell(85,7,utf8_decode("............."),'C');

$pdf->Ln(0);
$pdf->Cell(35);
$pdf->SetFont('Times','B',10);
$pdf->Cell(85,5 ,utf8_decode(sexe($titulaire['sex_personnel']).$titulaire['nom_personnel']." ".$titulaire['prenom_personnel']),'C');

//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//----------debut de la confection du bulll--------------------------------------------------------------------
$pdf->Ln(7);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Disciplines "),'1','C');
$pdf->Ln(0);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,3,utf8_decode("Subjects"),'C');
//--------------------------------- sequence
$pdf->Ln(0);
$pdf->Cell(62);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Seq 1"),'1','C');
$pdf->Ln(0);
$pdf->Cell(62);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,3,utf8_decode("Seq 1"),'C');
//---------------------------------moyennes
$pdf->Ln(0);
$pdf->Cell(72);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Moy/20"),'1','C');
$pdf->Ln(0);
$pdf->Cell(72);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,3,utf8_decode("Avg/20"),'C');
//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(84);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Coefs"),'1','C');
$pdf->Cell(72);
$pdf->Ln(0);
$pdf->Cell(84);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,3,utf8_decode("Coefs"),'C');

//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(93);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("NxC"),'1','C');
$pdf->Ln(0);
$pdf->Cell(93);
$pdf->SetFont('Times','B',6);
$pdf->Cell(0,3,utf8_decode("Total"),'C');

//---------------------------------rang
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Rangs"),'1','C');
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','B',6);
$pdf->Cell(0,3,utf8_decode("Positions"),'C');

//---------------------------------notes min / max
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Min/Max"),'1','C');
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','B',6);
$pdf->Cell(0,3,utf8_decode("Extreme"),'C');

//---------------------------------pourcentage de reussite
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("%réussite"),'1','C');
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',6);
$pdf->Cell(0,3,utf8_decode("%Success"),'C');
//---------------------------------Appreciation
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Appréciations"),'1','C');
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','B',6);
$pdf->Cell(0,3,utf8_decode("Observations"),'C');

//---------------------------------signature
$pdf->Ln(0);
$pdf->Cell(173);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Signatures"),'1','C');
$pdf->Ln(0);
$pdf->Cell(173);
$pdf->SetFont('Times','B',6);
$pdf->Cell(0,3,utf8_decode("Signatures"),'C');
//-------------------------------------------------------------------fin de l'entete du tableau des notes-------------------------------
//-------------------------------------------------------------------fin de l'entete du tableau des notes-------------------------------
//-------------------------------------------------------------------fin de l'entete du tableau des notes-------------------------------
//-------------------------------------------------------------------fin de l'entete du tableau des notes-------------------------------
//-----------------------------groupe 1
$pdf->Ln(4);
$pdf->Cell(10);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,10,utf8_decode("Groupe 1"),'C');
$pdf->Ln(3);
//-----------------------------------------------------------------------------------------
//------------------------------------------------------------------------------matiere
for ($i=1; $i<=4; $i++){
$pdf->Ln(5);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Disciplines "),'1','C');
$pdf->Ln(0);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,8,utf8_decode("Subjects"),'C');
//--------------------------------- sequence
$pdf->Ln(0);
$pdf->Cell(62);
$pdf->SetFont('Times','B',8);
$pdf->Cell(0,5,utf8_decode("Seq 1"),'1','C');
//---------------------------------moyennes
$pdf->Ln(0);
$pdf->Cell(72);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Moy/20"),'1','C');
//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(84);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Coefs"),'1','C');
$pdf->Cell(72);
//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(93);
$pdf->SetFont('Times','B',8);
$pdf->Cell(0,5,utf8_decode("NxC"),'1','C');
//---------------------------------rang
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Rangs"),'1','C');
//---------------------------------notes min / max
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Min/Max"),'1','C');
//---------------------------------pourcentage de reussite
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("%réussite"),'1','C');
//---------------------------------Appreciation
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Appréciations"),'1','C');

//---------------------------------signature
$pdf->Ln(0);
$pdf->Cell(173);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Signatures"),'1','C');

}
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------total groupe 1
$pdf->Ln(7);
$pdf->SetFont('Times','B',9);
$pdf->Cell(10);
$pdf->Cell(0,5,utf8_decode("Résultat groupe 1:    Moyenne: 15.74 /20"),'C');
//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(84);
$pdf->SetFont('Times','B',9);
$pdf->Cell(9,5,utf8_decode("Coefs"),'1','C');
//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(93);
$pdf->SetFont('Times','B',9);
$pdf->Cell(8,5,utf8_decode("NxC"),'1','C');
//---------------------------------rang
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','B',9);
$pdf->Cell(10,5,utf8_decode("Rangs"),'1','C');
//---------------------------------notes min / max
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','B',9);
$pdf->Cell(19,5,utf8_decode("Min/Max"),'1','C');
//---------------------------------pourcentage de reussite
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(17,5,utf8_decode("%réussite"),'1','C');
//---------------------------------Appreciation
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','B',9);
$pdf->Cell(26,5,utf8_decode("Appréciations"),'1','C');
//------------------------------------------fin des resultat du groupe 1--------------------------------------------------------------------------------
//-----------------------------groupe 2
$pdf->Ln(2);
$pdf->Cell(10);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,10,utf8_decode("Groupe 2"),'C');
$pdf->Ln(3);
//------------------------------------------------------------------------------matiere
for ($i=1; $i<=9; $i++){
$pdf->Ln(5);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Disciplines "),'1','C');
$pdf->Ln(0);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,8,utf8_decode("Subjects"),'C');
//--------------------------------- sequence
$pdf->Ln(0);
$pdf->Cell(62);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Seq 1"),'1','C');
//---------------------------------moyennes
$pdf->Ln(0);
$pdf->Cell(72);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Moy/20"),'1','C');
//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(84);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Coefs"),'1','C');
$pdf->Cell(72);
//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(93);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("NxC"),'1','C');
//---------------------------------rang
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Rangs"),'1','C');
//---------------------------------notes min / max
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Min/Max"),'1','C');
//---------------------------------pourcentage de reussite
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("%réussite"),'1','C');
//---------------------------------Appreciation
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Appréciations"),'1','C');

//---------------------------------signature
$pdf->Ln(0);
$pdf->Cell(173);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode("Signatures"),'1','C');

}
//----------------------------------------------------------total groupe 2
$pdf->Ln(7);
$pdf->SetFont('Times','',9);
$pdf->Cell(10);
$pdf->Cell(0,5,utf8_decode("Résultat groupe 2:    Moyenne: 15.74 /20"),'C');
//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(84);
$pdf->SetFont('Times','B',9);
$pdf->Cell(9,5,utf8_decode("Coefs"),'1','C');
//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(93);
$pdf->SetFont('Times','B',9);
$pdf->Cell(8,5,utf8_decode("NxC"),'1','C');
//---------------------------------rang
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','B',9);
$pdf->Cell(10,5,utf8_decode("Rangs"),'1','C');
//---------------------------------notes min / max
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','B',9);
$pdf->Cell(19,5,utf8_decode("Min/Max"),'1','C');
//---------------------------------pourcentage de reussite
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(17,5,utf8_decode("%réussite"),'1','C');
//---------------------------------Appreciation
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','B',9);
$pdf->Cell(26,5,utf8_decode("Appréciations"),'1','C');
//------------------------------------------fin des resultat du groupe 1--------------------------------------------------------------------------------
//-----------------------------groupe 2
$pdf->Ln(4);
$pdf->Cell(10);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,10,utf8_decode("Groupe 3"),'C');
$pdf->Ln(3);
for ($i=1; $i<=3; $i++){
$pdf->Ln(5);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Disciplines "),'1','C');
$pdf->Ln(0);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,8,utf8_decode("Subjects"),'C');
//--------------------------------- sequence
$pdf->Ln(0);
$pdf->Cell(62);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Seq 1"),'1','C');
//---------------------------------moyennes
$pdf->Ln(0);
$pdf->Cell(72);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Moy/20"),'1','C');
//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(84);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Coefs"),'1','C');
$pdf->Cell(72);
//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(93);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("NxC"),'1','C');
//---------------------------------rang
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Rangs"),'1','C');
//---------------------------------notes min / max
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Min/Max"),'1','C');
//---------------------------------pourcentage de reussite
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("%réussite"),'1','C');
//---------------------------------Appreciation
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Appréciations"),'1','C');

//---------------------------------signature
$pdf->Ln(0);
$pdf->Cell(173);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Signatures"),'1','C');

}
//----------------------------------------------------------total groupe 2
$pdf->Ln(7);
$pdf->SetFont('Times','B',9);
$pdf->Cell(10);
$pdf->Cell(0,7,utf8_decode("Résultat groupe 3:    Moyenne: 15.74 /20"),'C');
//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(84);
$pdf->SetFont('Times','B',9);
$pdf->Cell(9,5,utf8_decode("Coefs"),'1','C');
//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(93);
$pdf->SetFont('Times','B',9);
$pdf->Cell(8,5,utf8_decode("NxC"),'1','C');
//---------------------------------rang
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','B',9);
$pdf->Cell(10,5,utf8_decode("Rangs"),'1','C');
//---------------------------------notes min / max
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','B',9);
$pdf->Cell(19,5,utf8_decode("Min/Max"),'1','C');
//---------------------------------pourcentage de reussite
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(17,5,utf8_decode("%réussite"),'1','C');
//---------------------------------Appreciation
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','B',9);
$pdf->Cell(26,5,utf8_decode("Appréciations"),'1','C');
//


//------------------------------------------fin des resultats de l'élève--------------------------------------------------------------------------------
//---------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(60);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,7,utf8_decode("Résultats de l'élève"),'1','C');
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,7,utf8_decode("Résultats de la classe"),'1','C');
$pdf->Ln(0);
$pdf->Cell(150);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,7,utf8_decode("Conduite"),'1','C');
//-------------------------------------------------------------------------------------
$pdf->Ln(1);
$pdf->Cell(60);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,30,utf8_decode(""),'1','C');
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,30,utf8_decode(""),'1','C');
$pdf->Ln(0);
$pdf->Cell(150);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,30,utf8_decode(""),'1','C');
//------------------------------------------------------
$pdf->Ln(5);
$pdf->Cell(60);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,5,utf8_decode("Total des points:"),'C');
$pdf->Ln(0);
$pdf->Cell(83);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,5,utf8_decode("12.99"),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,5,utf8_decode("Moyenne premier:"),'C');
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,5,utf8_decode("12.99"),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(150);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,5,utf8_decode("Absences non just:"),'C');
$pdf->Ln(0);
$pdf->Cell(175);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,5,utf8_decode("12"),'C');

//------------------------------------------------------
$pdf->Ln(3);
$pdf->Cell(60);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,5,utf8_decode("Total des coefs:"),'C');
$pdf->Ln(0);
$pdf->Cell(83);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,5,utf8_decode("30"),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,5,utf8_decode("Moyenne dernier:"),'C');
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,5,utf8_decode("12.99"),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(150);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,5,utf8_decode("Blâme conduite:"),'C');
$pdf->Ln(0);
$pdf->Cell(175);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,5,utf8_decode("oui"),'C');

//------------------------------------------------------
$pdf->Ln(2);
$pdf->Cell(60);
$pdf->SetFont('Times','I',11);
$pdf->Cell(40,5,utf8_decode(".................................."),'C');
$pdf->Ln(3);
$pdf->Cell(60);
$pdf->SetFont('Times','I',11);
$pdf->Cell(40,5,utf8_decode("Moyenne:"),'C');
$pdf->Ln(0);
$pdf->Cell(83);
$pdf->SetFont('Times','B',11);
$pdf->Cell(40,5,utf8_decode("10.89"),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,3,utf8_decode("Moy classe:"),'C');
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,3,utf8_decode("12.99"),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(150);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,3,utf8_decode("Exclusion:"),'C');
$pdf->Ln(0);
$pdf->Cell(175);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,3,utf8_decode("5J"),'C');

//------------------------------------------------------
$pdf->Ln(5);
$pdf->Cell(60);
$pdf->SetFont('Times','I',11);
$pdf->Cell(40,5,utf8_decode("Rang:"),'C');
$pdf->Ln(0);
$pdf->Cell(83);
$pdf->SetFont('Times','B',10);
$pdf->Cell(40,5,utf8_decode("10.89"),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,3,utf8_decode("%Réussite"),'C');
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,3,utf8_decode("12.99"),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(150);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,3,utf8_decode("Conseil de discipline:"),'C');
$pdf->Ln(0);
$pdf->Cell(180);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,3,utf8_decode("oui	"),'C');
//------------------------------------------------------
$pdf->Ln(5);
$pdf->Cell(60);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,5,utf8_decode("Appréciation:"),'C');
$pdf->Ln(0);
$pdf->Cell(79);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,5,utf8_decode("Excellent"),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,3,utf8_decode("Nombre de moyenne:"),'C');
$pdf->Ln(0);
$pdf->Cell(135);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,3,utf8_decode("12.99"),'C');

//-----------------------------------------------------------------------------------------------------------
$pdf->Ln(15);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Visa parent"),'1','C');
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Visa du professeur principal"),'1','C');
$pdf->Ln(0);
$pdf->Cell(120);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,5,utf8_decode("Visa du chef d'établissement"),'1','C');

$pdf->Ln(5);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,15,utf8_decode(""),'1','C');
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,15,utf8_decode(""),'1','C');
$pdf->Ln(0);
$pdf->Cell(120);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,15,utf8_decode(""),'1','C');
$pdf->Image('histogramme.png', $x=10, $y=210,58,40); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)

/*$pdf->Ln(7);
$pdf->SetFont('Arial','B',10);
//------------------------------------------------------------------
$cla=mysql_fetch_array(mysql_query("select *from classe where id_classe=$id_classe "));
$pdf->Cell(0,7,utf8_decode("CLASSE: ".$cla['nom_unique_classe'].$cla['numero_classe']),'C');

//-----------------------------------debut de l'affichage de lentete du tableau de la liste d'appel------------------------------
$pdf->Ln(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,utf8_decode("Nom(s) & Prénom(s) : ".$nom." ".$prenom),'','C');
//------------------------------------------------------------------------
$t=mysql_query("select *from  eleve where visible_eleve!='$visible' and id_classe=$id_classe order by nom_eleve, prenom_eleve asc");
//on compte le nombre de tranche que l'élève pay normalement.
$compt=mysql_num_rows($t);	
$tnb=mysql_query("select *from classe C, scolarite S, tranche T 
where C.id_classe=$id_classe and S.id_scolarite = C.id_scolarite and S.id_scolarite = T.id_scolarite");
$a=80;		
$x=0;
//----------------------------------------------------------------------------------------------------------------
while($ttnb=mysql_fetch_array($tnb)){$x++;
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',13);
$pdf->Cell(0,10,utf8_decode("Tranche N° ").$x."    ( ".$ttnb['montant_tranche']." FCFA)",'1','C');

$r=mysql_fetch_array(mysql_query("select *from paiement_tranche where id_eleve=$id_eleve and numero_tranche_paiement=$x"));
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
$dossier_source2='D:/'; //c'est dans ce repertoire qui contiendra l'acte à insérer.
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
	$dossier_source.="Recu paiement tranche ";
	$dossier_source.=$date_jour;
	 $dossier_source.=".pdf";
	 
	 $dossier_source2.="Recu paiement tranche";
	$dossier_source2.=$date_jour;
	 $dossier_source2.=".pdf";
	 $nom_recu="Recu paiement tranche";
//$pdf->Output("pdf/$message", "F"); //on enregistre le fichier pdf dans le repertoire pdf

if (!is_dir($dossier_source)){
	mysql_query("insert into recu (id_eleve, nom_recu, lien_recu, date_enre_recu) value('".$id_eleve."', '".$nom_recu."','".$dossier_source."', '".time()."')");
	if (!is_dir($dossier_source2)){$pdf->Output("$dossier_source2", 'F');
	$pdf->Output("$dossier_source", 'F');
	$pdf->Output();}
}-*/
$pdf->Output();

//--------fin l'affichage des noms des eleves-------------------------------------------------------------
//------------------------------------------------------------------------

?>
