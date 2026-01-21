<?php include "../php/configurations_etablissement.php"; ?>
<?php include "../php/fonctions_php.php"; ?>
<?php include "../php/nel.php"; 
require ("src/jpgraph.php");
require ("src/jpgraph_bar.php");	  
?>

<?php
require('fpdf.php');

if ( isset($_POST['generer_bull_tous_eleve']) && isset($_POST['id_sequence_generer'])){
	//fin de la recupération des données
	$id_classe=$_POST['generer_bull_tous_eleve'];
	$req_classe=mysqli_query($mysqli, "select *from eleve where id_classe=$id_classe and visible_eleve!='non'");
	$e=mysqli_fetch_array(mysqli_query($mysqli, "select *from etablissement"));
	$id_e=$e['id_etablissement'];
	$nom_e=utf8_decode($e['nom_etablissement']);
	 $devise_e=utf8_decode($e['devise_etablissement']);
	  $ville_e=utf8_decode($e['ville_etablissement']);
	  $logo_etablissement.=($e['logo_etablissement']);
	  $quartier_e=utf8_decode($e['quartier_etablissement']);
	  $contact_e=utf8_decode($e['contact_etablissement']);
	  //------------------------selection de l'nnée scolaire----------
	  	$a=mysqli_fetch_array(mysqli_query($mysqli, "select *from annee_scolaire where id_etablissement=$id_e"));
		$annee_scolaire= $a['nom_annee_scolaire'];
		$id_sequence=$_POST['id_sequence_generer'];
	while($mont_tab=mysqli_fetch_array($req_classe))
	{
		$id_eleve=$mont_tab['id_eleve'];
	
	////////////////////////////////////////////////////////////information de l'établissement///////////////
	
	  //----------------------------------------------------------------------------------
	///////////////////////////////////////fin de la sélection des informations de l'etablissement//////////////////
		
		//////////////////////////information du prof titulaire
				//$t=mysql_fetch_array(mysql_query("select *from personnel where id_personnel=$id_personnel"));		
		///////////////////////////////


$eta=mysqli_fetch_array(mysqli_query($mysqli, "select *from etablissement E, annee_scolaire A where A.id_etablissement=E.id_etablissement"));
$et=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve where id_eleve=$id_eleve"));
$nom_etablissement=majuscule($eta['nom_etablissement']);

	 $nom=$et['nom_eleve'];
	 $prenom=$et['prenom_eleve'];$Homme="Homme"; $Femme="Femme"; $non="non";
	 
	 $cla_el=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve where id_eleve=$id_eleve"));
	 $id_vrai_classe=$cla_el['id_classe'];
	 $req_nonbre_classe1 = mysqli_query($mysqli, "select *from classe where id_classe=$id_vrai_classe");
	 	 $cla=mysqli_fetch_array($req_nonbre_classe1);
	  $nombre_garcons=mysqli_num_rows(mysqli_query($mysqli,"select *from eleve where sexe_eleve='$Homme' and visible_eleve!='$non' and id_classe=$id_vrai_classe"));
	  $nombre_fille=mysqli_num_rows(mysqli_query($mysqli, "select *from eleve where sexe_eleve='$Femme' and visible_eleve!='$non' and id_classe=$id_vrai_classe"));
	  $effectif_classe=mysqli_num_rows(mysqli_query($mysqli, "select *from eleve where visible_eleve!='$non' and id_classe=$id_vrai_classe"));
	  $classe=$cla['nom_unique_classe']; $classe.=" "; $classe.=$cla['numero_classe'];
	  $annee_scolaire=str_replace('/','-',$eta['nom_annee_scolaire']);
	  $nom_eleve=utf8_decode( majuscule($nom)); $nom_eleve.=" "; $nom_eleve.=utf8_decode(majuscule($prenom));
	  ///-----------------on recherche le professeur titulaire
	  $titulaire=mysqli_fetch_array(mysqli_query($mysqli, "select *from personnel where id_personnel='".$cla['id_enseignant_titulaire']."'"));
	  //----------------------------------
	   $date_jour = str_replace(
      array('/', ':'),
      array('_', '_'),
      affiche_date(time()));

//--------------------------------------------------------------------------------------------------------------------------------

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
	$construction_repertoire_histogramme1 = $dossier_source;
	$dossier_source= sous_repertoire($dossier_source, "Photo"); //lien du ciquieme sous repertoire
	if (!is_dir($dossier_source)){
			mkdir($dossier_source);}
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------
//---------------------------creation du repertoire dans le disque D****-------------------------------
$dossier_source2=$disque.':/'; //c'est dans ce repertoire qui contiendra l'acte à insérer.
$photo_eleve ='../';
$photo_eleve= sous_repertoire($photo_eleve, $nom_etablissement);
	$dossier_source2= sous_repertoire($dossier_source2, $nom_etablissement); // lien du premier sous repertoire
 		if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);} 
		
		$photo_eleve= sous_repertoire($photo_eleve, $annee_scolaire);
	 $dossier_source2= sous_repertoire($dossier_source2, $annee_scolaire); //lien du deuxieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
			
			$photo_eleve= sous_repertoire($photo_eleve, $classe);
	$dossier_source2= sous_repertoire($dossier_source2, $classe); //lien du troixieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
			
			$photo_eleve= sous_repertoire($photo_eleve, $nom_eleve);
	$dossier_source2= sous_repertoire($dossier_source2, $nom_eleve); //lien du qutrieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
	$construction_repertoire_histogramme2 = $dossier_source2;
	$photo_eleve= sous_repertoire($photo_eleve, "photo");
	$dossier_source2= sous_repertoire($dossier_source2, "Photo"); //lien du ciquieme sous repertoire
	if (!is_dir($dossier_source2)){
			mkdir($dossier_source2);}
//----------------------------------fin de creation du repertoire de l'eleve-----------------------------------------------------------------------------

$photo_eleve.=$et['photo_eleve'];
$pdf = new FPDF('P','mm','A4');//'P' c'est la page en portrai. en paysage c'est 'L'. 'mm' c'est l'unite de mesure 'A4' c'est le format 
$pdf->AddPage();
//---------------------------------------------------------------------------------------------------------------------
$hauteur=0;
$pdf->SetFont('Arial','B',9); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(12);
$pdf->Cell(0,10,"REPUBLIQUE DU CAMEROUN",'C');
$pdf->Ln(0);
$pdf->Cell(120);
$pdf->Cell(0,10,"REPUBLIC OF CAMEROON",'C');
//-----------------------------------------------------------------------------------------------------------------------
$pdf->Ln(5); $hauteur=$hauteur+5;
$pdf->SetFont('Arial','B',5);
$pdf->Cell(23);
$pdf->Cell(0,7,"PAIX - TRAVAIL - PATRIE",'C');
$pdf->Ln(0);
$pdf->SetFont('Arial','B',5);
$pdf->Cell(128);
$pdf->Cell(0,7,"PEACE - WORK - FATHERLAND",'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(2);$hauteur=$hauteur+2;
$pdf->Cell(20);
$pdf->SetFont('Arial','B',5);
$pdf->Cell(0,7,"---------------------------------------------",'C');
$pdf->Ln(0);
$pdf->Cell(125);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"-----------------------------------------------------",'C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(2);$hauteur=$hauteur+2;
$pdf->SetFont('Arial','B',9); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(0,10,"MINISTERE DES ENSEIGNEMENTS SECONDAIRES",'C');
$pdf->Ln(0);
$pdf->Cell(115);
$pdf->SetFont('Arial','B',9); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(0,10,"MINITRY OF SECONDARY EDUCATION",'C');
$pdf->Ln(5);$hauteur=$hauteur+5;
$pdf->Cell(15);
$pdf->SetFont('Arial','B',5);
$pdf->Cell(0,7,"----------------------------------------------------------------",'C');
$pdf->Ln(0);
$pdf->Cell(125);
$pdf->SetFont('Arial','B',5);
$pdf->Cell(0,7,"----------------------------------------------------------------",'C');
////---------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(1);$hauteur=$hauteur+1;
$pdf->Cell(20);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,10,utf8_decode("Année scolaire: ".$annee_scolaire),'C');
$pdf->Ln(0);
$pdf->Cell(128);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,10,utf8_decode("School year: ".$annee_scolaire),'C');
////////////-------------------------------------------------------------------------------------------------------------------------------
//$pdf->Image(''.$logo_etablissement.'', $x=90, $y=3,30,30); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)
$pdf->Image("logo.png", $x=90, $y=3,30,30);
$pdf->Ln(8);$hauteur=$hauteur+8;
$pdf->Cell($bordure_nom_e+20);
$pdf->SetFont('Arial','B',12); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Cell(0,10,utf8_decode($nom_e),'C');
//-----------------------------------------------------------------------------------------------------------------------
$pdf->Ln(7);$hauteur=$hauteur+7;
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
$pdf->Ln(2);$hauteur=$hauteur+2;
$pdf->Cell(70);
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"-----------------------------------------------------",'C');
//-------------------------------------------------------------------------------------------
$pdf->Ln(1);$hauteur=$hauteur+1;
$pdf->SetFont('Arial','B',6);
$pdf->Cell(0,7,"............................................................................................................................................................................................................................................................................................................................",'C');
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------Fin de l'entête des document de l'etablissement-------------------------------

$pdf->Ln(5);$hauteur=$hauteur+5;
$pdf->Cell(50);
$pdf->SetFont('Times','B',12);
$pdf->Cell(65,7,utf8_decode("BULLETIN TRIMESTRE N° ".$id_sequence.""),'1','C');
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(7);$hauteur=$hauteur+7;
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
$pdf->Ln(4);$hauteur=$hauteur+4;
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
$pdf->Ln(4);$hauteur=$hauteur+4;
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
$pdf->Ln(4);$hauteur=$hauteur+4;
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Date et lieu de naissance"),'C');

$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetFont('Times','I',8);
$pdf->Cell(85,7,utf8_decode("Adresse des parents"),'C');
//------------------------------------------------------------------------------------------------------------------------------------

$pdf->Ln(3);$hauteur=$hauteur+3;
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
//$dossier_source.="index.jpg";
//$a="index.jpg";
$pdf->Image("115cb8eccbebfe4929b862f1a556e9c6.png", $x=157, $y=49,30,30); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)
//------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(4);$hauteur=$hauteur+4;
$pdf->Cell(5);
$pdf->SetFont('Times','I',9);
$pdf->Cell(85,7,utf8_decode("Professeur principal"),'C');

$pdf->Ln(2);$hauteur=$hauteur+2;
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
$pdf->Ln(8);$hauteur=$hauteur+7;
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Disciplines "),'1','C');
$pdf->Ln(0);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,3,utf8_decode("Subjects"),'C');


$pdf->Ln(0);
$pdf->Cell(48);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("seq1"),'1','C');
$pdf->Ln(0);
$pdf->Cell(50);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,3,utf8_decode("Avg/20"),'C');

$pdf->Ln(0);
$pdf->Cell(58);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("seq2"),'1','C');
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,3,utf8_decode("Avg/20"),'C');
//---------------------------------moyennes
$pdf->Ln(0);
$pdf->Cell(68);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Moy/20"),'1','C');
$pdf->Ln(0);
$pdf->Cell(72);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,3,utf8_decode("Avg/20"),'C');
//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,7,utf8_decode("Coefs"),'1','C');
$pdf->Cell(72);
$pdf->Ln(0);
$pdf->Cell(84);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,3,utf8_decode("Coefs"),'C');

//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(90);
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
$pdf->Cell(0,7,utf8_decode("[Min--Max]"),'1','C');
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
$somme_coef_final=0;
$somme_point_final=0;	
$point_chaque_eleve=0; $tab_moyenne_chaque_eleve=array();
for ($j=1; $j<=3; $j++)
{
//selection des matieres du groupe 1,2 et 3 de la salle de classe-------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
$req_mat_groupe=mysqli_query($mysqli, "select *from matiere M, groupe G where G.id_classe=$id_vrai_classe and G.numero_groupe=$j and M.id_matiere=G.id_matiere order by nom_matiere asc");
//-------------------------------fin de la selection des matiere-----------------------------------------------------------
	
$pdf->Ln(4);$hauteur=$hauteur+4;
$pdf->Cell(10);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,10,utf8_decode("Groupe ".$j),'C');
$pdf->Ln(3);$hauteur=$hauteur+3;
//-----------------------------------------------------------------------------------------
//------------------------------------------------------------------------------matiere
$somme_note_coef=0;$somme_coef=0;
while($mat=mysqli_fetch_array($req_mat_groupe)){
//--------selection de la note de l'élève par sequence
$req_note=mysqli_query($mysqli, "select *from note where id_trimestre=$id_sequence and id_eleve=$id_eleve order by id_sequence asc");
$matiere=majuscule_sans_axcent($mat['nom_matiere']);
$note_seq = array();
while($note=mysqli_fetch_array($req_note)){
	$note_seq[] =  $note[''.majuscule($mat['nom_matiere']).''];
	}
	$seq_1=$note_seq[0];
	$seq_2=$note_seq[1];
	$trim=($seq_1+$seq_2)/2;
	
	//--------selection de la note de tous les élèves 
	
$req_note_tous=mysqli_query($mysqli, "select *from note where id_trimestre=$id_sequence order by id_sequence asc");
$note_seq_tous = array();
$tempo1 = 0; $ii = 0; $jj=0;
 $req_nonbre_classe2 = mysqli_query($mysqli, "select *from note where id_classe=$id_vrai_classe");
while($note_tous=mysqli_fetch_array($req_nonbre_classe2)){
	$ii++;
	$req_not=mysqli_query($mysqli, "select AVG ($matiere as moy) from note where id_trimestre=$id_sequence and id_eleve=$id_eleve ");
	$note_seq_tous[]=$req_not['moy'];
	}
	$c_chaque_eleve_par_mat=0;$poucentage_chaque_eleve_par_mat=0;$r_chaque_eleve_par_mat=0;
 foreach($note_seq_tous as $valeur_chaque_eleve)
 {
	 if ($valeur_chaque_eleve>=10)$c_chaque_eleve_par_mat++;//on compte le nombre de moyenne du groupe
 if($trim<$valeur_chaque_eleve)$r_chaque_eleve++;
	 }
	
	$rang_trim = $r_chaque_eleve_par_mat+1;
	$min_trim =min($note_seq_tous);
	$max_trim =max($note_seq_tous);
	$poucentage_par_mat = ($c_chaque_eleve_par_mat/$ii)*100;
//$prof=mysql_fetch_array(mysql_query("select *from personnel where"));
//-------------selection du coef de chaque matiere
$coef=mysqli_fetch_array(mysqli_query($mysqli, "select *from affectation_matiere where id_matiere='".$mat['id_matiere']."' and id_classe=$id_vrai_classe"));

//on cherche les les informations du professeur qui eseigne la matiere
$prof=mysqli_fetch_array(mysqli_query($mysqli, "select *from affectation_matiere A, personnel P where A.id_enseignant=P.id_personnel and  id_matiere='".$mat['id_matiere']."' and id_classe=$id_vrai_classe"));

$pdf->Ln(5);$hauteur=$hauteur+5;
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode(""),'1','C');
$pdf->Ln(0);
$pdf->SetFont('Times','B',9);
$pdf->Cell(0,3,utf8_decode(majuscule($mat['nom_matiere'])),'','C');
$pdf->Ln(0);
$pdf->SetFont('Times','I',6);
$pdf->Cell(0,8,utf8_decode(sexe($prof['sex_personnel']).$prof['nom_personnel']." ".$prof['prenom_personnel']),'C');
//---------------------------------moyennes seq 1
$pdf->Ln(0);
$pdf->Cell(48);
$pdf->SetFont('Times','B',8);
if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{$pdf->Cell(0,5,utf8_decode(""),'1','C');}
else
{$pdf->Cell(0,5,utf8_decode($seq_1),'1','C');}

//---------------------------------moyennes seq2
$pdf->Ln(0);
$pdf->Cell(58);
$pdf->SetFont('Times','B',8);
if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{$pdf->Cell(0,5,utf8_decode(""),'1','C');}
else
{$pdf->Cell(0,5,utf8_decode($seq_2),'1','C');}

//---------------------------------moyennes trim
$pdf->Ln(0);
$pdf->Cell(68);
$pdf->SetFont('Times','B',8);
if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{$pdf->Cell(0,5,utf8_decode(""),'1','C');}
else
{$pdf->Cell(0,5,utf8_decode($trim),'1','C');}


//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetFont('Times','',8);
if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{$pdf->Cell(0,5,utf8_decode(""),'1','C');}
else
{$pdf->Cell(0,5,utf8_decode($coef['coef_matiere']),'1','C');}
$pdf->Cell(72);

if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{/*on ne fait par l'addition des coef car la matière n'est pas renseignée*/}
else
{$somme_coef=$somme_coef+$coef['coef_matiere'];}
//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(90);
$pdf->SetFont('Times','B',8);
if($trim<0)
{$note_coef=0;}
else
{$note_coef=$trim*$coef['coef_matiere'];}

$somme_note_coef=$somme_note_coef+$note_coef; //la somme des notes x les coef
if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{$pdf->Cell(0,5,utf8_decode(""),'1','C');}
else
{$pdf->Cell(0,5,utf8_decode($note_coef),'1','C'); }
//---------------------------------rang

$note_matiere=$trim;


 $et11=mysqli_query($mysqli, "select id_eleve from eleve where id_classe =$id_vrai_classe order by id_eleve asc");
  $iii=0;
  $tab_note_matiere = array();
  while($ta = mysqli_fetch_array($et11))
  {
	  $id = $ta['id_eleve'];
	  $r = mysqli_fetch_array(mysqli_query($mysqli, "select AVG($matiere) as somme  FROM note where id_trimestre=$id_sequence and id_eleve=$id"));
	    $r['somme'];
	 $tab_note_matiere[$iii] = $r['somme']; $iii++;
	}
	
	$c=0;$r=0;
	foreach($tab_note_matiere as $v)
	{if ($v>=10)$c++;//on compte le nombre de moyenne du groupe
 if($trim<$v)$r++;
		} 
		$iii;
		$rang_trim_matiere=$r+1;
		$min_trim_matiere = min($tab_note_matiere);
		$max_trim_matiere = max($tab_note_matiere);
		$taux_reussite_matiere = ($c/$iii)*100;
		
		





//$note_matiere=1;
$rang_trim=mysqli_fetch_array(mysqli_query($mysqli, "SELECT COUNT(*)+1 AS Rang from note 
         WHERE  id_classe=$id_vrai_classe and $note_matiere < $matiere "));
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','',8);
if(($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0))
{$pdf->Cell(0,5,utf8_decode(""),'1','C');}
else
{$pdf->Cell(0,5,utf8_decode($rang_trim_matiere),'1','C'); }
//---------------------------------notes min / max

$min_trim =mysqli_fetch_array(mysqli_query($mysqli, "SELECT min($matiere) AS mmin FROM note N where $matiere>0 and N.id_trimestre=$trim and N.id_classe=$id_vrai_classe"));
$max_trim=mysqli_fetch_array(mysqli_query($mysqli, "SELECT max($matiere) AS mmax FROM note N where $matiere>0 and N.id_trimestre=$trim and N.id_classe=$id_vrai_classe"));
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','',8);

 if($min_trim['mmin']<0)$mini=0;else $mini=$min_trim['mmin'];
	if($max_trim['mmax']<0)$maxi=0; else $maxi=$max_trim['mmax'];
$pdf->Cell(0,5,utf8_decode('['.chiffre_apres_virgule($min_trim_matiere,2)."--".chiffre_apres_virgule($max_trim_matiere,2).']'),'1','C');


//---------------------------------pourcentage de reussite
//calcul du pourcentage de reussite de la matière
$taux_reussite_matiere = chiffre_apres_virgule($taux_reussite_matiere,2);
//$nombre_moyenne_matiere=mysqli_num_rows(mysqli_query($mysqli, "select *from note where id_trimestre=id_sequence and id_classe=$id_vrai_classe and $matiere>=10"));

//$poucentage_par_mat=($nombre_moyenne_matiere/$effectif_classe)*100;
//$poucentage_par_mat=chiffre_apres_virgule($poucentage_par_mat,2);
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode(chiffre_apres_virgule($taux_reussite_matiere,2))." %",'1','C');
//---------------------------------Appreciation
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','',8);

$pdf->Cell(0,5,utf8_decode(appreciation($trim)),'1','C');

//---------------------------------signature
$pdf->Ln(0);
$pdf->Cell(173);
$pdf->SetFont('Times','',8);
$pdf->Cell(0,5,utf8_decode(""),'1','C');
} //fin de la boucle while
//total des point et coef
$somme_point_final=$somme_point_final+$somme_note_coef;
$somme_coef_final=$somme_coef_final+$somme_coef;
$moyenne_groupe=$somme_note_coef/$somme_coef;
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------on calcul la moyenne de groupe de tous les élève--------------------------------------------

$reqi=mysqli_query($mysqli, "select *from eleve where id_classe=$id_vrai_classe and visible_eleve!='non'");

  $tab_eleve_groupe=array(); $k=0;
  while ($t111=mysqli_fetch_array($reqi))
  {  $MOY=0; $tab_point_groupe_chaque_eleve=array();
  //cette requette permet d'avoir les notes de de group de tous les élèves..................
  	$req_mat_g=mysqli_query($mysqli, "select *from matiere M, groupe G where G.id_classe=$id_vrai_classe and G.numero_groupe=$j and M.id_matiere=G.id_matiere order by nom_matiere asc");	 
	//..................................................
  $note_eleve_groupe=0;$coef_eleve_groupe=0; $k++; //ces variable servent a sommer successivement les notes et les coef de tous les élèves
	  while($t222=mysqli_fetch_array($req_mat_g))
  { 
  $matiere_groupe = $t222['nom_matiere'];
  $note_el=mysqli_fetch_array(mysqli_query($mysqli, "select AVG($matiere_groupe) as ng from note where id_trimestre=$id_sequence and id_classe=$id_vrai_classe and id_eleve='".$t111['id_eleve']."'")); 
   $coef_el=mysqli_fetch_array(mysqli_query($mysqli, "select *from affectation_matiere where id_matiere='".$t222['id_matiere']."' and id_classe=$id_vrai_classe"));
	 
	 if($note_el['ng']<0)
		{}
		else
		{$coef_eleve_groupe=$coef_eleve_groupe+$coef_el['coef_matiere'];}
		
	 if($note_el['ng']<0)
		{}
		else
		{$note_eleve_groupe=$note_eleve_groupe+$note_el['ng']*$coef_el['coef_matiere'];
	 //echo".." .$coef_eleve_groupe=$coef_eleve_groupe+$coef_['coef_matiere'];
	 	 }
	 
	  
  }  
	$tab_eleve_groupe[$k]=$note_eleve_groupe/$coef_eleve_groupe;
	  }
//-------------------------------------fin du calcul de la moyenne de groupe de tous les élève------------------------------------ 

//-------------------------------------calcul du pourcentage et rang du groupe------------------------------------ 
 $c=0;$poucentage_reussite_groupe=0;$r=0;
 foreach($tab_eleve_groupe as $valeur)
 {if ($valeur>=10)$c++;//on compte le nombre de moyenne du groupe
 if($moyenne_groupe<$valeur)$r++;
	 }
	 $rang_groupe=$r+1;
	 $poucentage_reussite_groupe=($c/$effectif_classe)*100;
	 
//-------------------------------------fin du calcul du pourcentage de réussite du groupe------------------------------------ 
$pdf->Ln(7);$hauteur=$hauteur+7;
$pdf->SetFont('Times','B',9);
$pdf->Cell(10);
$pdf->Cell(0,5,utf8_decode("Résultat groupe ".$j.":    Moyenne: ".chiffre_apres_virgule($moyenne_groupe,2)." /20"),'C');
//---------------------------------coefs
$pdf->Ln(0);
$pdf->Cell(80);
$pdf->SetFont('Times','B',9);
$pdf->Cell(10,5,utf8_decode($somme_coef),'1','C');
//---------------------------------notes x coefs
$pdf->Ln(0);
$pdf->Cell(90);
$pdf->SetFont('Times','B',9);
$pdf->Cell(11,5,utf8_decode($somme_note_coef),'1','C');
//---------------------------------rang
$pdf->Ln(0);
$pdf->Cell(101);
$pdf->SetFont('Times','B',9);
$pdf->Cell(10,5,utf8_decode($rang_groupe),'1','C');
//---------------------------------notes min / max
$min_trim_g = min($tab_eleve_groupe);
$max_trim_g = max($tab_eleve_groupe);
if($min_trim_g<0) $mini = 0; else $mini = $min_trim_g;
if($max_trim_g<0) $maxi = 0; else $maxi = $max_trim_g;
$pdf->Ln(0);
$pdf->Cell(111);
$pdf->SetFont('Times','B',8);
$pdf->Cell(19,5,utf8_decode('['.chiffre_apres_virgule($mini,2)."--".chiffre_apres_virgule($maxi,2).']'),'1','C');
//---------------------------------pourcentage de reussite
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(17,5,utf8_decode(chiffre_apres_virgule($poucentage_reussite_groupe,2).'%'),'1','C');
//---------------------------------Appreciation
$pdf->Ln(0);
$pdf->Cell(147);
$pdf->SetFont('Times','B',9);
$pdf->Cell(26,5,utf8_decode(appreciation($moyenne_groupe)),'1','C');
//------------------------------------------fin des resultat du groupe 1--------------------------------------------------------------------------------

}//fin de la boucle for

//-------------------calcul de la note de chaque élève-------------------------------
$req_chaque_eleve=mysqli_query($mysqli, "select *from eleve where id_classe=$id_vrai_classe and visible_eleve!='non'");
 $k=0;
  while ($t111_chaque_eleve=mysqli_fetch_array($req_chaque_eleve))
  {  $somme_note_chaque_eleve=0; $somme_coef_chaque_eleve=0;$k++;
  //cette requette permet d'avoir les notes de de group de tous les élèves..................
  	$req_mat_chaque_eleve=mysqli_query($mysqli, "select *from matiere M, groupe G where G.id_classe=$id_vrai_classe and M.id_matiere=G.id_matiere order by nom_matiere asc");	 
	//..................................................
	  while($t222_chaque_eleve=mysqli_fetch_array($req_mat_chaque_eleve))
  {   
  $note_chaque_eleve=mysqli_fetch_array(mysqli_query($mysqli, "select *from note where id_trimestre=$trim and id_classe=$id_vrai_classe and id_eleve='".$t111_chaque_eleve['id_eleve']."'")); 
  
   $coef_chaque_eleve=mysqli_fetch_array(mysqli_query($mysqli, "select *from affectation_matiere where id_matiere='".$t222_chaque_eleve['id_matiere']."' and id_classe=$id_vrai_classe"));
    
		if($note_chaque_eleve[''.majuscule_sans_axcent($t222_chaque_eleve['nom_matiere']).'']<0){}
		 else
		{$somme_coef_chaque_eleve=$somme_coef_chaque_eleve+ $coef_chaque_eleve['coef_matiere'];} 
		 
		 if($note_chaque_eleve[''.majuscule_sans_axcent($t222_chaque_eleve['nom_matiere']).'']<0){}
		 else
		{$somme_note_chaque_eleve=$somme_note_chaque_eleve+$note_chaque_eleve[''.majuscule_sans_axcent($t222_chaque_eleve['nom_matiere']).'']*$coef_chaque_eleve['coef_matiere'];}
	  
  }  
  $tab_moyenne_chaque_eleve[$k]=$somme_note_chaque_eleve/$somme_coef_chaque_eleve;
	  }


//------------------------------------creation de l'histogramme de l'élève
$moyenne_eleve=$somme_point_final/$somme_coef_final;
require "histogramme_trimestre.php";

//-------------------------------------calcul du pourcentage, moyenne et rang de toute la classe------------------------------------ 
 $c_chaque_eleve=0;$poucentage_chaque_eleve=0;$r_chaque_eleve=0;$moyenne_generale_classe=0;
 foreach($tab_moyenne_chaque_eleve as $valeur_chaque_eleve)
 {if ($valeur_chaque_eleve>=10)$c_chaque_eleve++;//on compte le nombre de moyenne du groupe
 if($moyenne_eleve<$valeur_chaque_eleve)$r_chaque_eleve++;
	 $moyenne_generale_classe=$moyenne_generale_classe+$valeur_chaque_eleve;
	 }
	 $moyenne_generale_classe=$moyenne_generale_classe/$effectif_classe;
	 $rang_chaque_eleve=$r_chaque_eleve+1;
	 $poucentage_chaque_eleve=($c_chaque_eleve/$effectif_classe)*100;
//-------------------------------------fin du calcul du pourcentage de réussite du groupe------------------------------------ 


//------------------------------------------fin des resultats de l'élève--------------------------------------------------------------------------------
//---------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
$pdf->Ln(10);$hauteur=$hauteur+10;
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
$pdf->Ln(1);$hauteur=$hauteur+2;
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
$pdf->Cell(40,5,utf8_decode($somme_point_final),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,5,utf8_decode("Moyenne premier:"),'C');
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,5,utf8_decode(chiffre_apres_virgule(max($tab_moyenne_chaque_eleve),2)),'C');

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
$pdf->Cell(40,5,utf8_decode($somme_coef_final),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,5,utf8_decode("Moyenne dernier:"),'C');
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,5,utf8_decode(chiffre_apres_virgule(min($tab_moyenne_chaque_eleve),2)),'C');

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
$pdf->Ln(3);$hauteur=$hauteur+3;
$pdf->Cell(60);
$pdf->SetFont('Times','I',11);
$pdf->Cell(40,5,utf8_decode("Moyenne:"),'C');
$pdf->Ln(0);
$pdf->Cell(83);
$pdf->SetFont('Times','B',11);
$pdf->Cell(40,5,utf8_decode(chiffre_apres_virgule($moyenne_eleve,2)),'C');

//------------------------------------------------------

$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,3,utf8_decode("Moy classe:"),'C');
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,3,utf8_decode(chiffre_apres_virgule($moyenne_generale_classe, 2)),'C');

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
$pdf->Cell(40,5,utf8_decode($rang_chaque_eleve." / ".$effectif_classe),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,3,utf8_decode("%Réussite"),'C');
$pdf->Ln(0);
$pdf->Cell(130);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,3,utf8_decode(chiffre_apres_virgule($poucentage_chaque_eleve, 2).'%'),'C');

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
$pdf->Cell(40,5,utf8_decode(appreciation($moyenne_eleve)),'C');

//------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(105);
$pdf->SetFont('Times','I',9);
$pdf->Cell(40,3,utf8_decode("Nombre de moyenne:"),'C');
$pdf->Ln(0);
$pdf->Cell(135);
$pdf->SetFont('Times','B',9);
$pdf->Cell(40,3,utf8_decode($c_chaque_eleve),'C');

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
//$histogramme=$dossier_source; $histogramme.="/histogramme sequence ".$id_sequence.".png";
$pdf->Image($histogramme1, $x=10, $y=$hauteur,58,40); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)


//--------------------------------------------------------------------------on enregistre une copie pres a l'impression----------------			
$dossier_source3='C:/'; //c'est dans ce repertoire qui contiendra l'acte à insérer.
	$dossier_source3= sous_repertoire($dossier_source3, "Bulletins trim"); // lien du premier sous repertoire
 		if (!is_dir($dossier_source3)){
			mkdir($dossier_source3);} 		
	 $dossier_source3= sous_repertoire($dossier_source3, $classe); //lien du deuxieme sous repertoire
	if (!is_dir($dossier_source3)){
			mkdir($dossier_source3);}
//------------------------------------------------------------------------------------------------------------------------------------------
 $reper=$dossier_source3.$nom_eleve." ".$prenom." ".time().".pdf";
//enregistrement du bulletin dans un repertoire
$pdf->Output("$reper", 'F');

if ($reper){$verification=1;}
else {$verification=0;}
//--------fin l'affichage des noms des eleves-------------------------------------------------------------
//------------------------------------------------------------------------
} //fin de la boucle while

if($verification==1) {echo '<script language="javascript"> alert("Les bulletins ont bien été générés. Ils se trouvent dans votre disque F dans le repertoire: Bulletins Seq 1/'.$classe.'");</script>';}
else{ echo '<script language="javascript"> alert("Erreur pendant la génération des bulletins.");</script>';}
}//fin de la condition si
?>