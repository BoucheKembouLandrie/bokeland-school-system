<?php
/*$bodytag= str_replace("%body%","black","<body text='%body%'>");
$vowels= array ("a","e","i","o","u","A","E","I","O","U");
$onlyconsonants=str_replace($vowels,"", "HELLO WORLD of PHP");
echo $onlyconsonants;
$phrase=("you should eat fruits, vegetables, and fiber every day.");
$healtly=array ("fruits","vegetablesz","fiber");
$yummy=array ("pizza","beer","ice cream");
$newphrase=str_replace($healtly,$yummy,$phrase);
echo $newphrase;
$str=str_replace("ll","","good golly miss molly", $count);
echo $count;*/
function strtoupperfr($string){
	$string=strtoupper($string);
	$string=str_replace(array('é','è','à','i','ô','ï','î','û','ü','ü','ù','ê',),
	array ('E','E','A','I','O','I','I','U','U','U','U','E'),$string);
	return $string;
}
	
$chaine = 'tu l\'as tùà ???';
$chaine = strtoupperfr($chaine);
echo $chaine;
?>
