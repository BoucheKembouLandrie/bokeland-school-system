
<?php include "../php/fonctions_php.php"; ?>
  <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- BOOTSTRAP STYLES-->
    <link href="contenu/css/bootstrap.css" rel="stylesheet" />
     <!-- FONTAWESOME STYLES-->
    <link href="contenu/css/font-awesome.css" rel="stylesheet" />
     <!-- MORRIS CHART STYLES-->
    <link href="contenu/js/morris/morris-0.4.3.min.css" rel="stylesheet" />
        <!-- CUSTOM STYLES-->
    <link href="contenu/css/custom.css" rel="stylesheet" />
     <!-- GOOGLE FONTS-->
   <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />
      <link href="contenu/css/css alert.css" rel="stylesheet" />
      
      <script language="javascript">
   
    function verification_bull(a){	
var id_personnel_acces=a;
if (id_personnel_acces!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{id_personnel_acces:id_personnel_acces},function(data){
		//$('#profil').hide();
		$('#controle_acces').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		});}
}
//---------------------------------------------------------------------------------------------------------}---------}
      </script>