<?php
//---------------------librairie permettant de faire des histogramme

//-----------------------------------------------------------------------------------------
/*define('MYSQL_HOST', 'localhost');
define('MYSQL_USER', 'root');
define('MYSQL_PASS', '');
define('MYSQL_DATABASE', 'tuto_jp_graph');

$tableauAnnees = array();
$tableauNombreNotes = array();

// **********************************************
// Extraction des données dans la base de données
// *************************************************

$sql = <<<EOF
	SELECT  
		YEAR(`DTHR_VENTE`) AS ANNEE,
		COUNT(ID) AS NBR_VENTES  
	FROM `ventes`
	GROUP BY YEAR(`DTHR_VENTE`)
EOF;

$mysqlCnx = @mysql_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASS) or die('Pb de connxion mysql');

@mysql_select_db(MYSQL_DATABASE) or die('Pb de sélection de la base');

$mysqlQuery = @mysql_query($sql, $mysqlCnx) or die('Pb de requête');
*/
$tableauAnnees=array();
$tableauNombreNotes=array();
for($i=1; $i<=$id_sequence; $i++){
	$tableauAnnees[] = 'Séq ' . $i;
	$tableauNombreNotes[] =chiffre_apres_virgule(calcul_note_sequence($mysqli, $id_eleve, $i),2);
}

/*
printf('<pre>%s</pre>', print_r($tableauAnnees,1));
printf('<pre>%s</pre>', print_r($tableauNombreNotes,1));
*/

// *******************
// Création du graphique
// *******************


// Construction du conteneur
// Spécification largeur et hauteur
$graph = new Graph(400,250);

// Réprésentation linéaire
$graph->SetScale("textlin");

// Ajouter une ombre au conteneur
$graph->SetShadow();

// Fixer les marges
$graph->img->SetMargin(40,30,25,40);

// Création du graphique histogramme
$bplot = new BarPlot($tableauNombreNotes);

// Spécification des couleurs des barres
$bplot->SetFillColor(array('red', 'green', 'blue'));
// Une ombre pour chaque barre
$bplot->SetShadow();

// Afficher les valeurs pour chaque barre
$bplot->value->Show();
// Fixer l'aspect de la police
$bplot->value->SetFont(FF_ARIAL,FS_NORMAL,9);
// Modifier le rendu de chaque valeur
$bplot->value->SetFormat('%d');

// Ajouter les barres au conteneur
$graph->Add($bplot);

// Le titre
$graph->title->Set("Histogramme des notes de ".utf8_decode($nom_eleve));
$graph->title->SetFont(FF_FONT1,FS_BOLD);

// Titre pour l'axe horizontal(axe x) et vertical (axe y)
$graph->xaxis->title->Set(utf8_decode("Séquence"));
$graph->yaxis->title->Set("Notes /20");

$graph->yaxis->title->SetFont(FF_FONT1,FS_BOLD);
$graph->xaxis->title->SetFont(FF_FONT1,FS_BOLD);

// Légende pour l'axe horizontal
$graph->xaxis->SetTickLabels($tableauAnnees);

// Afficher le graphique
//repertoire dans lequel sera ranger l'histogramme de l'élève
//----------------------------------------------------------------------------------------------------------------------------------------------------------
$histogramme1=$construction_repertoire_histogramme1;
$histogramme1= sous_repertoire($histogramme1, "histogrammes"); //lien du qutrieme sous repertoire
	if (!is_dir($histogramme1)){
			mkdir($histogramme1);}
$histogramme1.='/histogramme_sequence_'.$id_sequence.'.png';

			@unlink($histogramme1);//si le ichier existe déjà, on le supprime et on crée l'autre
//----------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------
$histogramme2=$construction_repertoire_histogramme2;
$histogramme2= sous_repertoire($histogramme2, "histogrammes"); //lien du qutrieme sous repertoire
	if (!is_dir($histogramme2)){
			mkdir($histogramme2);}
$histogramme2.='/histogramme_sequence_'.$id_sequence.'.png';

			@unlink($histogramme2);//si le ichier existe déjà, on le supprime et on crée l'autre
//----------------------------------------------------------------------------------------------------------------------------------------------------------


			$graph->Stroke($histogramme1);
			$graph->Stroke($histogramme2);
		




?>

