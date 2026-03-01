<?php 

$verification=0;
	//include"config.php"; 
// Constantes
define('TARGET', '../../photo_profil_du_personnel/');    // Repertoire cible endroit ou les image vont alle ce placer
define('MAX_SIZE', 9000000);    // Taille max en octets du logo
define('WIDTH_MAX', 90000);    // Largeur max de l'image en pixels
define('HEIGHT_MAX', 8000);    // Hauteur max de l'image en pixels
 
// Tableaux de donnees
$tabExt = array('jpg','gif','png','jpeg');    // Extensions de logo autorise
$infosImg = array(); // le tableau qui contindra les informations de l'image
 
// Variables
$extension = ''; // la variable qui contiendra l'extension de l'image
$message = ''; // la variable qui contiendra le message à afficher après une action
$nomImage = ''; //  la variable qui ontiendra le nom de l'image
 
/************************************************************
 * Creation du repertoire cible si inexistant
 *************************************************************/
if( !is_dir(TARGET) ) {
  if( !mkdir(TARGET, 0755) ) {
    exit('Erreur
 : le répertoire cible ne peut-être créé ! Vérifiez que vous diposiez 
des droits suffisants pour le faire ou créez le manuellement !');
  }
}
 
/************************************************************
 * Script d'upload
 *************************************************************/

  // On verifie si le champ est rempli
  if( !empty($_FILES['logo']['name']) ) // on verifi si le nom de l'image existe ou a ét rempli
  { 
    // Recuperation de l'extension du logo
    $extension  = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
 
    // On verifie l'extension du logo
    if(in_array(strtolower($extension),$tabExt)) // on verifie si l'extention du logo existe dans le tableau $tabext[]
    { // la fonction "strtolower()" permet de mettre l'extention en miniscule.
      // On recupere les dimensions du logo
      @$infosImg = getimagesize($_FILES['logo']['tmp_name']);// la fonction "getimagesize ()" renvoi les dimenssion de l'image et les stocke dans un tableau
	  // l'index "0" donne la largeur et l'index "1" donne la hauteur
 
      // On verifie le type de l'image
      if($infosImg[2] >= 1 && $infosImg[2] <= 14)
      {
        // On verifie les dimensions et taille de l'image
        if(($infosImg[0] <= WIDTH_MAX) && ($infosImg[1] <= HEIGHT_MAX) && (filesize($_FILES['logo']['tmp_name']) <= MAX_SIZE))
        {
          // Parcours du tableau d'erreurs
          if(isset($_FILES['logo']['error']) 
            && UPLOAD_ERR_OK === $_FILES['logo']['error'])
          {
            // On renomme le logo
            $nomImage = md5(uniqid()) .'.'. $extension;
 			// echo $nomImage;
            // Si c'est OK, on teste l'upload
            if(move_uploaded_file($_FILES['logo']['tmp_name'], TARGET.$nomImage))
            {
              /*$message = '<script language="javascript"> alert("Enregistrement reussi")</script> !';*/
            	$verification=1;
			}
            else
            {
              // Sinon on affiche une erreur systeme
				$message = '<script language="javascript"> alert("Problème lors du chargement du fichier logo")</script> !';
            }
          }
          else
          {
		  	$message = '<script language="javascript"> alert("Une erreur interne a empêché le chargement du fichier logo: ")</script> !';
          }
        }
        else
        {
          // Sinon erreur sur les dimensions et taille de l'image
		  $message = '<script language="javascript"> alert("Erreur dans les dimensions de l\'image !")</script> !';
        }
      }
      else
      {
        // Sinon erreur sur le type de l'image
       $message = '<script language="javascript"> alert("Votre fichier logo n\'est pas une image")</script> !';
      }
    }
    else
    {
      // Sinon on affiche une erreur pour l'extension
      $message = '<script language="javascript"> alert("L\'extension du logo est incorrecte")</script> !';
    }
  }
  else
  {
    // Sinon l'utilisateur n'a rien entrée dans le champ logo on affecte le vide à ma variable $nomImage =
    $verification=1;
  }


?>