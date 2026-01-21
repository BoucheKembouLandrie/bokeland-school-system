<?php
 ///////////////////////////////////////cette fonction génère aléatoirement un code de validation ///////////////////////////////////////////
           
 function code_aleatoire($nb_caractere) ///la variable $nb_caractere désigne le nombre de caractères que nous désirons générer
{
        $code_aleatoire = ""; // on initialisenotre code de validation au vide car nous allons faire une concaténation pour obtenir notre code
       
        $chaine = "A1B2C3D4E5F6G7H8J9K1L2M3N4P5Q6R7S8T9U1V11W12X13Y"; //on défini les caractères qui apparaitront dans notre code de validation
        $longeur_chaine = strlen($chaine); // la fonction strlen() compte le nombre de caractère de la chaine spécidfié
       
        for($i = 1; $i <= $nb_caractere; $i++)
        {
            $place_aleatoire = mt_rand(0,($longeur_chaine-1));// la fonction mt_rand() choisi un nombre aléatoire compri entre 2 nombres
            $code_aleatoire .= $chaine[$place_aleatoire]; //cette instruction selection dans le tableau de caractère, le caractère correspondant u chiffre choisi aléatoirement
        }													//effectu un concatenation pour enfin avoir le code de validation

        return $code_aleatoire;   //on retourne alors le code de validation
}

/*
    strtolower() - Renvoie une chaîne en minuscules
    ucfirst() - Met le premier caractère en majuscule
    ucwords() - Met en majuscule la première lettre de tous les mots
    mb_strtoupper() - Met tous les caractères en majuscules*/
	
	function majuscule($string) {

   $string = strtoupper($string);//transforme tous en majuscule sauf les lettre avec axcent

   $string = str_replace(
      array('é', 'è', 'ê', 'ë', 'à', 'â', 'î', 'ï', 'ô', 'ù', 'û'),
      array('É', 'È', 'Ê', 'Ë', 'À', 'Â', 'Î', 'Ï', 'Ô', 'Ù', 'Û'),
      $string); //on remplace les axent trouve 
   return $string;
}
function majuscule_sans_axcent($string) {


$string=strtoupper($string);
	$string=str_replace(array('é','è','à','i','ô','ï','î','û','ü','ü','ù','ê',),
	array ('E','E','A','I','O','I','I','U','U','U','U','E'),$string);
	return $string;
   /*$string = strtoupper($string);//transforme tous en majuscule sauf les lettre avec axcent

   $string = str_replace(
      array('é', 'è', 'ê', 'ë', 'à', 'â', 'î', 'ï', 'ô', 'ù', 'û',' '),
      array('E', 'E', 'E', 'E', 'A', 'A', 'I', 'i', 'O', 'U', 'U','_'),
      $string); //on remplace les axent trouve 
   return $string;*/
}
/*
echo substr('abcdef', 1);     // bcdef
echo substr('abcdef', 1, 3);  // bcd
echo substr('abcdef', 0, 4);  // abcd
echo substr('abcdef', 0, 8);  // abcdef
echo substr('abcdef', -1, 1); // f
$string = 'abcdef';
echo $string[0];                 // a
echo $string[3];                 // d
echo $string[strlen($string)-1]; // f*/

// Accéder à un simple caractère dans une chaîne
// peut également être réalisé en utilisant des crochets
function extraire_caracteres ($string, $nombre_caractere)
{
$retour="";
	if($nombre_caractere<=5)
	{
		for($i=0; $i<$nombre_caractere;$i++)
		{$retour.=$string[$i];}
	}
	else
	{
	$retour.= substr($string, 0, $nombre_caractere);
	}
	return $retour;
}

function chiffre_romains($num)
{
  //I V X  L  C   D   M
  //1 5 10 50 100 500 1k
  $rome =array("","I","II","III","IV","V","VI","VII","VIII","IX");
  $rome2=array("","X","XX","XXX","XL","L","LX","LXX","LXXX","XC");
  $rome3=array("","C","CC","CCC","CD","D","DC","DCC","DCCC","CM");
  $rome4=array("","M","MM","MMM","IVM","VM","VIM","VIIM","VIIIM","IXM");
  $str=$rome[$num%10];
  $num-=($num%10);
  $num/=10;
  $str=$rome2[$num%10].$str;
  $num-=($num%10);
  $num/=10;
  $str=$rome3[$num%10].$str;
  $num-=($num%10);
  $num/=10;
  $str=$rome4[$num%10].$str;
  return $str;
}

function rang($num)
{
    switch ($num) {
  case 1:
    $retour="Premier";
    break;
	case 2:
    $retour="Deuxième";
    break;
	case 3:
    $retour="Troixième";
    break;
  
  default:
    $retour="";
    break;
}
	return $retour;
}

function sexe($string)
{
	if($string=="Femme")$return="Mme. ";
	if ($string=="Homme")$return="M. ";
	return $return;
}
function sexe_2($string)
{
	if($string=="Femme")$return=utf8_encode('Féminin ');
	if ($string=="Homme")$return="Masculin ";
	return $return;
}
/*
    srand() - Initialise le générateur de nombres aléatoires
    getrandmax() - Plus grande valeur aléatoire possible
    mt_rand() - Génère une meilleure valeur aléatoire
    openssl_random_pseudo_bytes() - Génère une chaine pseudo-aléatoire d'octets*/
	
	function nombre_aleatoire($petite_valeur, $grande_valeur)
	{
		return rand($petite_valeur, $grande_valeur);
	}
	
	function sous_repertoire($var_source, $var_a_inserer)
{
 $var_source.=$var_a_inserer;
 $var_source.='/';
 return $var_source;
}
function affiche_date($date_seconde)
{
$w=$date_seconde; 
$decalage=2;

$heure=date(' G',$w);
 $heure=$heure+$decalage;
  
 $dmy= date('d  /  M  /  Y', $w); 
 $min=date(' i ', $w); 	
 $return=$dmy; $return.=":    "; $return.=$heure; $return.="H ";$return.=$min; $return.="Min";
 return $return;
}
 function date_francais($a){
//Voici les deux tableaux des jours et des mois traduits en français
$nom_jour_fr = array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");

$mois_fr = Array("", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", 
        "septembre", "octobre", "novembre", "décembre");
		
// on extrait la date du jour
list($nom_jour, $jour, $mois, $annee) = explode('/', date("w/d/n/Y", $a));
$return= $nom_jour_fr[$nom_jour];
$return.= " ";
$return.= $jour;
$return.= " ";
$return.= $mois_fr[$mois];
$return.= " ";
$return.= $annee;
return $return;
//Affichera par exemple : "date du jour en français : samedi 24 juin 2006."
 }
 
 function chiffre_apres_virgule($nombre,$nombre_chiffre_apres_virgule)
 {
	 //$nombre= (int)$nombre;
	 return round($nombre,$nombre_chiffre_apres_virgule);}
 
 function appreciation ($note)
 {
	 //$note=is_numeric($note);
	 if ($note>=0 and $note<=4 ) {$appreciation="nul";}
	 elseif ($note>4 and $note<=7 ) {$appreciation="faible";}
	 elseif ($note>7 and $note<=8 ) {$appreciation="insuffisant";}
	 elseif ($note>8 and $note<10 ) {$appreciation=utf8_encode("médiocre");}
	 elseif ($note>=10 and $note<12 ) {$appreciation="passable";}
	 elseif ($note>=12 and $note<14 ) {$appreciation="assez bien";}
	 elseif ($note>=14 and $note<16 ) {$appreciation="bien";}
	 elseif ($note>=16 and $note<18 ) {$appreciation=utf8_encode("très bien");}
	 elseif ($note>=18 and $note<20 ) {$appreciation="excellent";}
	 elseif ($note==20 ) {$appreciation="parfait";}
	 else {$appreciation="";}
	 return $appreciation;
}
 function discipline ($absence)
 {
	 //$note=is_numeric($note);
	 if ($absence=5 and $absence<=10) {$discipline="AVERTISSEMENT";}
	 elseif ($absence>=11 and $note<=14 ) {$discipline="BLAME CONDUITE";}
	 elseif ($absence>=15 and $absence<=18 ) {$discipline="BLAME + 1 JOUR D'EXCLUSION";}
	 elseif ($absence>=19 and $absence<=21 ) {$discipline=utf8_encode("BLAME + 3 JOUR D'EXCLUSION");}
	 elseif ($absence>=22 and $absence<=25 ) {$discipline="BLAME + 5 JOUR D'EXCLUSION";}
	 elseif ($note>=26 and $absence<=29 ) {$discipline="BLAME + 8 JOUR D'EXCLUSION ";}
	 elseif ($absence>=30 ) {$discipline="CONSEIL DE DISCIPLINE & EXCLUSION DEFINITIVE";}
	 else {$discipline="";}
	 return $discipline;
}
 
function calcul_note_sequence($mysqli, $id_eleve, $id_sequence)
{ //cette fonction calcul la note d'un élève connaissant l'id l'élève et la séquence
 $cla_el=mysqli_fetch_array(mysqli_query($mysqli, "select *from eleve where id_eleve=$id_eleve"));
	 $id_vrai_classe=$cla_el['id_classe'];
 $effectif_classe=mysqli_num_rows(mysqli_query($mysqli, "select *from eleve where visible_eleve!='non' and id_classe=$id_vrai_classe"));
	$somme_coef_final=0;
$somme_point_final=0;	
$point_chaque_eleve=0; $tab_moyenne_chaque_eleve=array();
for ($j=1; $j<=3; $j++)
{
//selection des matieres du groupe 1,2 et 3 de la salle de classe-------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
$req_mat_groupe=mysqli_query($mysqli, "select *from matiere M, groupe G where G.id_classe=$id_vrai_classe and G.numero_groupe=$j and M.id_matiere=G.id_matiere order by nom_matiere asc");
//-------------------------------fin de la selection des matiere-----------------------------------------------------------
//------------------------------------------------------------------------------matiere
$somme_note_coef=0;$somme_coef=0;
while($mat=mysqli_fetch_array($req_mat_groupe)){
//--------selection de la note de l'élève et du profetteur
$note=mysqli_fetch_array(mysqli_query($mysqli,"select *from note where id_sequence=$id_sequence and id_eleve=$id_eleve"));
//$prof=mysql_fetch_array(mysql_query("select *from personnel where"));
//-------------selection du coef de chaque matiere
$coef=mysqli_fetch_array(mysqli_query($mysqli,"select *from affectation_matiere where id_matiere='".$mat['id_matiere']."' and id_classe=$id_vrai_classe"));

//on cherche les les informations du professeur qui eseigne la matiere
$prof=mysqli_fetch_array(mysqli_query($mysqli,"select *from affectation_matiere A, personnel P where A.id_enseignant=P.id_personnel and  id_matiere='".$mat['id_matiere']."' and id_classe=$id_vrai_classe"));




//---------------------------------coefs

if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{}
else
{}


if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{/*on ne fait par l'addition des coef car la matière n'est pas renseignée*/}
else
{$somme_coef=$somme_coef+$coef['coef_matiere'];}
//---------------------------------notes x coefs

if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{$note_coef=0;}
else
{$note_coef=$note[''.majuscule_sans_axcent($mat['nom_matiere']).'']*$coef['coef_matiere'];}

$somme_note_coef=$somme_note_coef+$note_coef; //la somme des notes x les coef
if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{}
else
{ }
//---------------------------------rang
$matiere=majuscule_sans_axcent($mat['nom_matiere']);
$note_matiere=$note[''.majuscule_sans_axcent($mat['nom_matiere']).''];
$rang=mysqli_fetch_array(mysqli_query($mysqli,"SELECT COUNT(*)+1 AS Rang from note 
         WHERE  id_classe=$id_vrai_classe and $note_matiere < $matiere "));

if($note[''.majuscule_sans_axcent($mat['nom_matiere']).'']<0)
{}
else
{ }
//---------------------------------notes min / max

$min=mysqli_fetch_array(mysqli_query($mysqli,"SELECT min($matiere) AS mmin FROM note N where $matiere>0 and N.id_sequence=$id_sequence and N.id_classe=$id_vrai_classe"));
$max=mysqli_fetch_array(mysqli_query($mysqli,"SELECT max($matiere) AS mmax FROM note N where $matiere>0 and N.id_sequence=$id_sequence and N.id_classe=$id_vrai_classe"));

 if($min['mmin']<0)$mini=0;else $mini=$min['mmin'];
	if($max['mmax']<0)$maxi=0; else $maxi=$max['mmax'];

//---------------------------------pourcentage de reussite
//calcul du pourcentage de reussite de la matière

$nombre_moyenne_matiere=mysqli_num_rows(mysqli_query($mysqli,"select *from note where id_sequence=$id_sequence and id_classe=$id_vrai_classe and $matiere>=10"));

$poucentage=($nombre_moyenne_matiere/$effectif_classe)*100;
$poucentage=chiffre_apres_virgule($poucentage,2);

//---------------------------------Appreciation


//---------------------------------signature

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
  
  $note_el=mysqli_fetch_array(mysqli_query($mysqli,"select *from note where id_sequence=$id_sequence and id_classe=$id_vrai_classe and id_eleve='".$t111['id_eleve']."'")); 
   $coef_el=mysqli_fetch_array(mysqli_query($mysqli,"select *from affectation_matiere where id_matiere='".$t222['id_matiere']."' and id_classe=$id_vrai_classe"));
	 
	 if($note_el[''.majuscule_sans_axcent($t222['nom_matiere']).'']<0)
		{}
		else
		{$coef_eleve_groupe=$coef_eleve_groupe+$coef_el['coef_matiere'];}
		
	 if($note_el[''.majuscule_sans_axcent($t222['nom_matiere']).'']<0)
		{}
		else
		{$note_eleve_groupe=$note_eleve_groupe+$note_el[''.majuscule_sans_axcent($t222['nom_matiere']).'']*$coef_el['coef_matiere'];
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

//---------------------------------coefs

//---------------------------------notes x coefs

//---------------------------------rang

//---------------------------------notes min / max

//---------------------------------pourcentage de reussite

//---------------------------------Appreciation

//------------------------------------------fin des resultat du groupe 1--------------------------------------------------------------------------------

}//fin de la boucle for

$moyenne_eleve=$somme_point_final/$somme_coef_final;	
return $moyenne_eleve;
} 


 $bordure_nom_e=60; $bordure_nom_e_paysage=100;
?>