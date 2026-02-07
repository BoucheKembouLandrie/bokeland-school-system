<?php 
$pdf->Ln(5);$hauteur=$hauteur+5;
$pdf->Cell(50);
$pdf->SetFont('Times','B',12);
$pdf->Cell(65,7,utf8_decode("BULLETIN SEQUENTIEL N° ".$id_sequence.""),'1','C');
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


 ?>