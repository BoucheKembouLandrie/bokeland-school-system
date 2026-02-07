<?php
//---------------------librairie permettant de faire des histogramme
include ("src/jpgraph.php");
include ("src/jpgraph_bar.php");
//-----------------------------------------------------------------------------------------
/*define('MYSQL_HOST', 'localhost');
define('MYSQL_USER', 'root');
define('MYSQL_PASS', '');
define('MYSQL_DATABASE', 'tuto_jp_graph');

$tableauAnnees = array();
$tableauNombreVentes = array();

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
for($i=1; $i<=6; $i++){
	$tableauAnnees[] = 'Séq ' . $i;
	$tableauNombreVentes[] = $i*1;
}

/*
printf('<pre>%s</pre>', print_r($tableauAnnees,1));
printf('<pre>%s</pre>', print_r($tableauNombreVentes,1));
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
$bplot = new BarPlot($tableauNombreVentes);

// Spécification des couleurs des barres
$bplot->SetFillColor(array('red', 'green', 'blue'));
// Une ombre pour chaque barre
$bplot->SetShadow();

// Afficher les valeurs pour chaque barre
$bplot->value->Show();
// Fixer l'aspect de la police
$bplot->value->SetFont(FF_ARIAL,FS_NORMAL,9);
// Modifier le rendu de chaque valeur
$bplot->value->SetFormat('%d ventes');

// Ajouter les barres au conteneur
$graph->Add($bplot);

// Le titre
$graph->title->Set("Graphique 'HISTOGRAMME' : ventes par années");
$graph->title->SetFont(FF_FONT1,FS_BOLD);

// Titre pour l'axe horizontal(axe x) et vertical (axe y)
$graph->xaxis->title->Set("Années");
$graph->yaxis->title->Set("Nombre de ventes");

$graph->yaxis->title->SetFont(FF_FONT1,FS_BOLD);
$graph->xaxis->title->SetFont(FF_FONT1,FS_BOLD);

// Légende pour l'axe horizontal
$graph->xaxis->SetTickLabels($tableauAnnees);

// Afficher le graphique
$graph->Stroke();

?>

