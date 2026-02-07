$('#search').keyup(function(){ //on démare un évènement sur l'id search
	//la fonction keyup nous permet de savoir qu'un utilisateur a apuyé 
	//sur une touche de son clavier
	
	var search=$.trim($("#search").val()); // on déclare une variable et on recupère la valeur entrée
	
	if(search!=="")
	{
		$('#loader').show();
		$.post('post.php',{search:search},function(data){

			$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			$('#loader').hide();
			});
	}
	});
	
function select_eleve(){
var classe=$("#classe").val();
if (classe!==""){
	$('#loader').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
	$.post('post.php',{classe:classe},function(data){
		
		$('#resultat').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.
		});
}
}




/* $(document).ready(function(){


})*/


/* $(document).ready(function(){
//on cache toute les div.
$('#div_prenom').hide();
$('#div_date_naissance').hide();
$('#div_enregistrer').hide();

$('#date_naissance_div').hide();
$('#nom').keyup(function(){ //on démare un évènement sur l'id search
	//la fonction keyup nous permet de savoir qu'un utilisateur a apuyé 
	//sur une touche de son clavier

	var search=$(this).val(); // on déclare une variable et on recupère la valeur entrée

	search=$.trim(search); // la fonction trim efface tous les espaces avant la saisie
	//$('#resultat').text(search); cette ligne permet d'afficher ce qui est entre dans l'input dans la di #resultat
	if(search!=="")
	{ // si la variable search n'es pas vides, on appele notre page post.php
		//en pasant notre variable search puis en appelan la fonction avec le paramètre data
		$('#photo').show();//on affiche le chargement quand l'utilisateur tape sur le clavier
		/*$.post('post.php',{search:search},function(data){

			$('#resultat ul').html(data).show(); //cette ligne nous permettra d'afficher les donnée html
			//dans la dinv resultat plus précisement dans <ul</ul>
			$('#loader').hide();//cache le loader quand l'affichage est terminé.

			// quand l'utilisateur clique sur le lien
			$('a').click(function(){
				var lien = $(this).text();//on recupère le contenu lien sur lequel on a cliquez
				$('#loader').show();
				$.post('show.php',{lien:lien},function(data){
					$('#search').attr('value',lien); // pour remplir le champ input par tous le nom de l'utilisateur.
					$('#feedback').html(data);
					$('#loader').hide();
					$('#resultat ul').hide();
				});

			});
		})
	}
})





})*/