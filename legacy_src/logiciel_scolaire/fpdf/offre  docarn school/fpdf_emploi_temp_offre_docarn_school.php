<?php include "../../php/configurations etablissement.php"; ?>
<?php include "../../php/fonctions php.php"; ?>
<?php include "../../php/nel.php"; 
require ("../src/jpgraph.php");
require ("../src/jpgraph_bar.php");	  
?>

<?php
require('../fpdf.php');
$visible="non";

	
if (isset($_GET['id_classe']) and isset($_GET['id_classe']) )
{	$id_classe=$_GET['id_classe'];//id classe

	
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
	
	////////////////////selection des informations de l'eleve////////////////////////////////////////////////////////////
	$visible="non";
		  $ele0=mysql_query("select *from eleve where id_classe=$id_classe  and visible_eleve!='$visible' order by nom_eleve ,prenom_eleve asc");
	  $ele=mysql_fetch_array(mysql_query("select *from eleve where id_classe=$id_classe and visible_eleve!='$visible' order by nom_eleve ,prenom_eleve  asc"));
	  $cla=mysql_fetch_array(mysql_query("select id_classe,nom_unique_classe,numero_classe from classe where id_classe=$id_classe"));
	  	  $classe=utf8_decode($cla['nom_unique_classe']);
		  $nu_classe=$cla['numero_classe'];
		  //on compte le nombre d'eleve de la classe
		  $nbr_eleve=mysql_num_rows(mysql_query("select *from eleve where id_classe=$id_classe and visible_eleve!='$visible'"));
		  //on compte le nombre de garcons 
		  $nbr_garcon=mysql_num_rows(mysql_query("select *from eleve where id_classe=$id_classe and sexe_eleve='Homme' and visible_eleve!='$visible' "));
		  //on compte le nombre de fille
		  $nbr_fille=mysql_num_rows(mysql_query("select *from eleve where id_classe=$id_classe and sexe_eleve='Femme' and visible_eleve!='$visible'"));
		//fin de la recupération des données des élève
		
		//////////////////////////information du prof titulaire
				//$t=mysql_fetch_array(mysql_query("select *from personnel where id_personnel=$id_personnel"));		
		///////////////////////////////
		
$pdf = new FPDF('L','mm','A4');//'P' c'est la page en portrai. en paysage c'est 'L'. 'mm' c'est l'unite de mesure 'A4' c'est le format 
$pdf->AddPage();
//---------------------------------------------------------------------------------------------------------------------
$pdf->SetFont('Arial','B',13); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(40);
$pdf->Cell(0,10,"REPUBLIQUE DU CAMEROUN",'C');
$pdf->Ln(0);
$pdf->Cell(180);
$pdf->Cell(0,10,"REPUBLIC OF CAMEROON",'C');
//-----------------------------------------------------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(56);
$pdf->Cell(0,7,"PAIX - TRAVAIL - PATRIE",'C');
$pdf->Ln(0);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(188);
$pdf->Cell(0,7,"PEACE - WORK - FATHERLAND",'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->Cell(53);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,7,"---------------------------------------------",'C');
$pdf->Ln(0);
$pdf->Cell(185);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,7,"-----------------------------------------------------",'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->SetFont('Arial','B',11); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(28);
$pdf->Cell(0,10,"MINISTERE DES ENSEIGNEMENTS SECONDAIRES",'C');
$pdf->Ln(0);
$pdf->Cell(175);
$pdf->SetFont('Arial','B',11); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(0,10,"MINITRY OF SECONDARY EDUCATION",'C');
$pdf->Ln(5);
$pdf->Cell(45);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,7,"----------------------------------------------------------------",'C');
$pdf->Ln(0);
$pdf->Cell(180);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,7,"----------------------------------------------------------------",'C');
////---------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->Cell(56);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,10,utf8_decode("Année scolaire: ".$annee_scolaire),'C');
$pdf->Ln(0);
$pdf->Cell(188);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,10,utf8_decode("School year: ".$annee_scolaire),'C');
////////////-------------------------------------------------------------------------------------------------------------------------------
$pdf->Image('logo.png', $x=140, $y=5,30,30); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)
$pdf->Ln(10);
$pdf->Cell(80);
$pdf->SetFont('Arial','B',15); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(0,10,utf8_decode($nom_e),'C');
//-----------------------------------------------------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->SetFont('Arial','I',10);
//------------------------------------------------------------------
$pdf->Cell(0,7,utf8_decode("Situé à: ".$ville_e." :".$quartier_e.".       BP: 1257 ......"),'C');
//--------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(100);
$pdf->SetFont('Arial','B',10);
$pdf->Cell(0,7,utf8_decode($devise_e),'C');
//------------------------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(175);
$pdf->SetFont('Arial','I',10);
$pdf->Cell(0,7,"Tel: ".$contact_e,'C');

//-------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->Cell(100);
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,7,"-----------------------------------------------------",'C');
//-------------------------------------------------------------------------------------------
$pdf->Ln(2);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"..........................................................................................................................................................................................................................................................................................................................................................................................................................................................................",'C');
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------Fin de l'entête des document de l'etablissement-------------------------------

$pdf->Ln(10);
$pdf->Cell(100);
$pdf->SetFont('Times','B',16);
$pdf->Cell(0,7,"EMPLOI DE TEMPS",'C');
$pdf->Ln(2);
$pdf->Cell(100);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"____________________________________",'C');
//------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->SetFont('Arial','B',12);
$cla=mysql_fetch_array(mysql_query("select *from classe where id_classe=$id_classe "));
$pdf->Cell(0,7,utf8_decode("CLASSE: ".$cla['nom_unique_classe'].$cla['numero_classe']),'C');
//------------------------------------------------------------------------
$pdf->Ln(8);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12); 
$pdf->Cell(0,10,'Titulaire: M. XXXXXXXX YYYYYYYYYYY','C');
//------------------------------------------------------------------------
//-----------------------------------debut de l'affichage de lentete du tableau EMPLOI DE TEMPS------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,utf8_decode('Tranches horaires'),'1','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(70);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,'Lundi','1','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(110);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,'Mardi','1','C');
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(140);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,'Mercredi','1','C');
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(170);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,'Jeudi','1','C');

//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(200);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,'Vendredi','1','C');

//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(230);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,'Samedi','1','C');

//--------fin de l'affichage de l'entete du table----------------------------------------------------------------
//-------------------------------SELECTION DE L4EMPLOI DE TEMPS DE LA CLASSE SELECTIONNE
	 $a=mysql_query("select *from emploi_temps where id_classe=$id_classe order by numero_horaire asc");

//-----------------------------------debut de l'affichage de l'emploi de temps------------------------------
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
while ($temps=mysql_fetch_array($a) )
{
	$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',12);
$pdf->Cell(0,10,utf8_decode($temps['heure']),'1','C');
//--------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(70);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(0,10,utf8_decode($temps['lundi']),'1','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(110);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(0,10,utf8_decode($temps['mardi']),'1','C');
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(140);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(0,10,utf8_decode($temps['mercredi']),'1','C');
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(170);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(0,10,utf8_decode($temps['jeudi']),'1','C');

//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(200);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(0,10,utf8_decode($temps['vendredi']),'1','C');

//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(230);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(0,10,utf8_decode($temps['samedi']),'1','C');
}

//creation du dossier qui comportera les liste d'appel

$et=mysql_fetch_array(mysql_query("select *from etablissement"));
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
	
	$dossier_source2= sous_repertoire($dossier_source2, $nom_dossier); //lien du ciquieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------
	$dossier_source.="Emploi de temps";
	$dossier_source.=$date_jour;
	 $dossier_source.=".pdf";
	 
	 $dossier_source2.="Emploi de temps";
	$dossier_source2.=$date_jour;
	 $dossier_source2.=".pdf";
//$pdf->Output("pdf/$message", "F"); //on enregistre le fichier pdf dans le repertoire pdf

	if (!is_dir($dossier_source2))$pdf->Output("$dossier_source2", 'F');
	if (!is_dir($dossier_source))$pdf->Output("$dossier_source", 'F');
	$pdf->Output();

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
