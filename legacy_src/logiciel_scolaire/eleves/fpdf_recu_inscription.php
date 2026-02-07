
<?php
require('fpdf/fpdf.php');
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
$pdf->Output();

$pdf = new FPDF('P','mm','A4');//'P' c'est la page en portrai. en paysage c'est 'L'. 'mm' c'est l'unite de mesure 'A4' c'est le format 
$pdf->AddPage();
$pdf->SetFont('Arial','B',16); //  SetFont(). On choisit de l'Arial gras en taille 16 :
$pdf->Image('logo.png', $x=20, $y=10,50,30); //Image('$nom', $bordure gauche, $bordurehaut,largeur,hauteur)
$pdf->Cell(70);// Décalage de 80 a droite
$pdf->Cell(0,10,'NOM DE L\'ETABLISSEMENT ','C');
$pdf->Ln(7);
$pdf->Cell(100);
$pdf->SetFont('Arial','B',10);
$pdf->Cell(0,7,'Paix - Travail - Patrie','C');
//------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->Cell(70);
$pdf->SetFont('Arial','B',16);
$pdf->Cell(0,10,'Situe a Yaounde: Eleveur ngousso','C');
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(70);
$pdf->SetFont('Arial','B',16);
$pdf->SetTextColor(200,200,255);
$pdf->Cell(0,10,'Tel: 698843185 / 671517951','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(70);
$pdf->SetFont('Arial','B',16);
$pdf->SetTextColor(0,0,0);
$pdf->Cell(0,10,'Annee scolaire: 2017 / 2018','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(20);
$pdf->Cell(50);
$pdf->SetFont('Times','U',14);
$pdf->SetTextColor(200,220,001);
$pdf->Cell(0,10,'RECU D\'INSCRIPTION','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','U',14);
$pdf->Cell(0,10,'RECU N','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,'NOMS / PRENOMS:','C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,'AZEMKOUO CEDRIC','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,'NE LE :','C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,'16 / 08 / 1994 a Yaounde','C');
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
$pdf->Cell(10,10,'ELECOL1712','C');
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
$pdf->Cell(10,10,'SONF152','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(10);
$pdf->Cell(10);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','B',14);
$pdf->Cell(0,10,'CLASSE:','C');
//------------------------------------------------------------------------
//------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(60);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',12);
$pdf->Cell(10,10,'TERMINALE C','C');
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
$pdf->Cell(10,10,'50000 FCFA','C');
//------------------------------------------------------------------------

//-----------------------------------------------------------------------------
$pdf->Ln(50);
$pdf->Cell(20);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','BI',12);
$pdf->Cell(10,10,'Visa de l\'eleve','C');
//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(0);
$pdf->Cell(120);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','BI',12);
$pdf->Cell(10,10,'Visa de scolarite','C');
//------------------------------------------------------------------------


//-----------------------------------------------------------------------------
$pdf->Ln(40);
$pdf->Cell(90);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(10,10,'Delivre 02 / 06 / 2017 a 17h 56min','C');

//------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$pdf->Ln(7);
$pdf->Cell(90);
$pdf->SetTextColor(0,0,0);
$pdf->SetFont('Times','I',9);
$pdf->Cell(10,10,'Par '.time(),'C');
//------------------------------------------------------------------------

//$pdf->Cell(100,10,"aaaaaaaaaaaaaaaaaa",1,'C');	// Cell($largeur,$hauteur,$contenu,$bordure)On imprime ensuite une cellule grâce à Cell()
/*$pdf->Cell(60,10,'Powered by FPDF.',1);//Si on veut ajouter une nouvelle cellule à droite avec du texte centré et retourner à la ligne, on fait :
$pdf->Ln(10); 
$pdf->Cell(60,10,'Powered by FPDF.',1);*/
//$pdf->Output("pdf/$message", "F"); //on enregistre le fichier pdf dans le repertoire pdf
$pdf->Output($dest='', $name='','true');


*/

?>
