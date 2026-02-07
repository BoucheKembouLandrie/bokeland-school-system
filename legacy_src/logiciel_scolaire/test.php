<?php include "php/configurations_etablissement.php"; ?>
<?php include "php/fonctions_php.php"; ?>
<?php include "php/nel.php"; 

if ( isset($_GET['id_sequence']) and isset($_GET['id_eleve']) ){
	//fin de la recupération des données
	$id_eleve=$_GET['id_eleve'];
	$id_sequence=$_GET['id_sequence'];
	$matiere ="ANGLAIS"; $trim = 12;
  $et11=mysqli_query($mysqli, "select id_eleve from eleve where id_classe =1 order by id_eleve asc");
  $i=0;
  $tab_note = array();
  while($ta = mysqli_fetch_array($et11))
  {
	  $id = $ta['id_eleve'];
	  $r = mysqli_fetch_array(mysqli_query($mysqli, "select AVG($matiere) as somme  FROM note where id_trimestre=1 and id_eleve=$id		"));
	    $r['somme'];
	 $tab_note[$i] = $r['somme']; $i++;
	}$c=0;$r=0;
	foreach($tab_note as $v)
	{if ($v>=10)$c++;//on compte le nombre de moyenne du groupe
 if($trim<$v)$r++;
 echo ' moy '.$v.' ';
		} 
		echo 'rang '.$r+1;
		echo " nombre moy ".$c."/".$i;

}
?>