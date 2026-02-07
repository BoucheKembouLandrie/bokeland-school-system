<?php include "../php/fonctions php.php"; include "../php/configurations etablissement.php"; ?>
<?php 
		
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title></title>
<meta charset="utf-8">
<link rel="stylesheet" href="css/reset.css" type="text/css" media="all">
<link rel="stylesheet" href="css/layout.css" type="text/css" media="all">
<link rel="stylesheet" href="css/style.css" type="text/css" media="all">
<script type="text/javascript" src="js/jquery-1.4.2.js" ></script>
<script type="text/javascript" src="js/cufon-yui.js"></script>
<script type="text/javascript" src="js/cufon-replace.js"></script>
<script type="text/javascript" src="js/Myriad_Pro_400.font.js"></script>
<script type="text/javascript" src="js/Myriad_Pro_700.font.js"></script>
<script type="text/javascript" src="js/Myriad_Pro_600.font.js"></script>
<!--[if lt IE 9]>
	<script type="text/javascript" src="http://info.template-help.com/files/ie6_warning/ie6_script_other.js"></script>
 	<script type="text/javascript" src="js/html5.js"></script>
<![endif]-->
</head>
<body id="page5">
<div class="main">
<!-- header -->
	<header>
		<div class="wrapper">
			<h1><a href="index.html" id="logo">Smart Biz</a></h1>
			<form id="search" action="" method="post">
				<div class="bg">
					<input type="submit" class="submit" value="">
					<input type="text" class="input">
				</div>
			</form>
		</div>
		<nav>
			<ul id="menu">
				<li class="alpha" id="menu_active"><a href="index.php"><span><span>Accueil</span></span></a></li>
				<li><a href="presentation.php"><span><span>Présentation</span></span> </a></li>
				<li><a href="informations.php"><span><span>Informations</span></span></a></li>
				<li><a href="contacts.php"><span><span>Contacts</span></span></a></li>
                <li><a href="connexion.php"><span><span>Connexion</span></span></a></li>
			</ul>
		</nav>
	</header>
<!-- / header -->
<!-- content -->
	<section id="content">
		<div class="wrapper">
			<div class="pad">
				<div class="wrapper"><h2>Connexion</h2></div>
			</div>
			<div class="box pad_bot1 bot">
				<div class="pad marg_top">
					<p></p>
					
					<p><?php include "connexion form/connexion.php"; 
					?></p>
				</div>
			</div>
		</div>
	</section>
<!-- / content -->
<!-- footer -->
	<footer>
		Website template designed by <a href="http://www.templatemonster.com/" target="_blank" rel="nofollow">www.templatemonster.com</a><br>
		3D Models provided by <a href="http://www.templates.com/product/3d-models/" target="_blank" rel="nofollow">www.templates.com</a>
	</footer>
<!-- / footer -->
</div>
<script type="text/javascript"> Cufon.now(); </script>
</body>
</html>