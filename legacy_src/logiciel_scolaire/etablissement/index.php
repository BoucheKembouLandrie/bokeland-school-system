<?php include"../php/configurations_etablissement.php"; ?>
<?php $page=5; ?>

<!DOCTYPE html>
<html lang="en">
	<head>
    	<?php include 'php/head.php'; ?>
		
		<!--[if lte IE 9]>
		  <link rel="stylesheet" href="assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- HTML5shiv and Respond.js for IE8 to support HTML5 elements and media queries -->

		<!--[if lte IE 8]>
		<script src="assets/js/html5shiv.min.js"></script>
		<script src="assets/js/respond.min.js"></script>
		<![endif]-->
	</head>

	<body class="login-layout">
    <?php include'php/header.php'; ?>
		<div class="main-container">
			<div class="main-content">
				<div class="row">
					<div class="col-sm-10 col-sm-offset-1">
						<div class="login-container">
							<div class="center">
								<h1>
									
									<span class="red" ><a href="" ><img src="img/LOGO MARC SCHOOL 3.png"  height="150"  /></a></span>
									
								</h1>
							</div>

							<div class="space-6"></div>

							<div class="position-relative">
								<div id="login-box" class="login-box visible widget-box no-border">
									<div class="widget-body">
										<div class="widget-main">
											<h4 class="header blue lighter bigger">
												<i class="ace-icon fa glyphicon-plus green"></i>
												Entrez vos informations
											</h4>

											<div class="space-6"></div>

											<form method="post" enctype="multipart/form-data" action="">
												<fieldset>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="text" class="form-control" placeholder="Matricule" name="matricule" required/>
															<i class="ace-icon fa fa-user"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="password" class="form-control" placeholder="Mot de passe" name="password" required/>
															<i class="ace-icon fa fa-lock"></i>
														</span>
													</label>

													<div class="space"></div>

													<div class="clearfix">
														<label class="inline">
															<input type="checkbox" class="ace" />
															<span class="lbl"> Se souvenir de moi</span>
														</label>
													<input type="submit" class="width-35 pull-right btn btn-sm btn-primary" name="connexion" class="ace-icon fa fa-key" value="Connexion">
														
													</div>

													<div class="space-4"></div>
												</fieldset>
											</form>

											<div class="social-or-login center">
												<span class="bigger-110">Retrouvez-nous</span>
											</div>

											<div class="space-6"></div>

											<div class="social-login center">
												<a href="#" class="btn btn-primary">
													<i class="ace-icon fa fa-facebook"></i>
												</a>

												<a href="#" class="btn btn-info">
													<i class="ace-icon fa fa-twitter"></i>
												</a>

												<a href="#" class="btn btn-danger">
													<i class="ace-icon fa fa-google-plus"></i>
												</a>
											</div>
										</div><!-- /.widget-main -->

										<div class="toolbar clearfix">
											<div>
												<a href="#" data-target="#forgot-box" class="forgot-password-link">
													<i class="ace-icon fa fa-arrow-left"></i>
													Mot de passe oublié
												</a>
											</div>

											<div>
												<a href="#" data-target="#signup-box" class="user-signup-link">
													Je ne suis pas inscrit 
													<i class="ace-icon fa fa-arrow-right"></i>
												</a>
											</div>
										</div>
									</div><!-- /.widget-body -->
								</div><!-- /.login-box -->

								<div id="forgot-box" class="forgot-box widget-box no-border">
									<div class="widget-body">
										<div class="widget-main">
											<h4 class="header red lighter bigger">
												<i class="ace-icon fa fa-key"></i>
												Récupération du mot de passe
											</h4>

											<div class="space-6"></div>
											<p>
												Entrez votre email pour reinitialiser votre pass
											</p>

											<form method="post" action="">
												<fieldset>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="email" class="form-control" placeholder="Email" />
															<i class="ace-icon fa fa-envelope"></i>
														</span>
													</label>

													<div class="clearfix">
														<button type="button" class="width-35 pull-right btn btn-sm btn-danger">
															<i class="ace-icon fa fa-lightbulb-o"></i>
															<span class="bigger-110">Envoyer</span>
														</button>
													</div>
												</fieldset>
											</form>
										</div><!-- /.widget-main -->

										<div class="toolbar center">
											<a href="#" data-target="#login-box" class="back-to-login-link">
												retour à connexion
												<i class="ace-icon fa fa-arrow-right"></i>
											</a>
										</div>
									</div><!-- /.widget-body -->
								</div><!-- /.forgot-box -->

								<div id="signup-box" class="signup-box widget-box no-border">
									<div class="widget-body">
										<div class="widget-main">
											<h4 class="header green lighter bigger">
												<i class="ace-icon fa fa-users blue"></i>
												Inscription
											</h4>

											<div class="space-6"></div>
											<p> Entrez vos informations: </p>

											<form>
												<fieldset>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="email" class="form-control" placeholder="Email" />
															<i class="ace-icon fa fa-envelope"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="text" class="form-control" placeholder="Nom d'utilisateur" />
															<i class="ace-icon fa fa-user"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="password" class="form-control" placeholder="mot de passe" />
															<i class="ace-icon fa fa-lock"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="password" class="form-control" placeholder="Confirmation du mot de passe" />
															<i class="ace-icon fa fa-retweet"></i>
														</span>
													</label>

													<label class="block">
														<input type="checkbox" class="ace" />
														<span class="lbl">
															J'accepte
															<a href="#">les conditions de confidentialités</a>
														</span>
													</label>

													<div class="space-24"></div>

													<div class="clearfix">
														<button type="reset" class="width-30 pull-left btn btn-sm">
															<i class="ace-icon fa fa-refresh"></i>
															<span class="bigger-110">Annuler</span>
														</button>

														<button type="button" class="width-65 pull-right btn btn-sm btn-success">
															<span class="bigger-110">Inscription</span>

															<i class="ace-icon fa fa-arrow-right icon-on-right"></i>
														</button>
													</div>
												</fieldset>
											</form>
										</div>

										<div class="toolbar center">
											<a href="#" data-target="#login-box" class="back-to-login-link">
												<i class="ace-icon fa fa-arrow-left"></i>
												Retour à connexion
											</a>
										</div>
									</div><!-- /.widget-body -->
								</div><!-- /.signup-box -->
							</div><!-- /.position-relative -->

							<section class="about">
								<p class="about-author">
								 &copy; 2018 <a href="../admin/" >Administration</a> -
								   by <a href="#"><?php echo $Marc_School ?> <?php echo $version_application ?></a>
							  </section>
						</div>
					</div><!-- /.col -->
				</div><!-- /.row -->
			</div><!-- /.main-content -->
		</div><!-- /.main-container -->

		<!-- basic scripts -->

		<!--[if !IE]> -->
		<script src="assets/js/jquery-2.1.4.min.js"></script>

		<!-- <![endif]-->

		<!--[if IE]>
<script src="assets/js/jquery-1.11.3.min.js"></script>
<![endif]-->
		<script type="text/javascript">
			if('ontouchstart' in document.documentElement) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>

		<!-- inline scripts related to this page -->
		<script type="text/javascript">
			jQuery(function($) {
			 $(document).on('click', '.toolbar a[data-target]', function(e) {
				e.preventDefault();
				var target = $(this).data('target');
				$('.widget-box.visible').removeClass('visible');//hide others
				$(target).addClass('visible');//show target
			 });
			});
			
			
			
			//you don't need this, just used for changing background
			jQuery(function($) {
				 $('#btn-login-light').on('click', function(e) {
				$('body').attr('class', 'login-layout light-login');
				$('#id-text2').attr('class', 'grey');
				$('#id-company-text').attr('class', 'blue');
				
				e.preventDefault();
			 });
				 $('#btn-login-dark').on('click', function(e) {
				$('body').attr('class', 'login-layout');
				$('#id-text2').attr('class', 'white');
				$('#id-company-text').attr('class', 'blue');
				
				e.preventDefault();
			 });
			 $('#btn-login-blur').on('click', function(e) {
				$('body').attr('class', 'login-layout blur-login');
				$('#id-text2').attr('class', 'white');
				$('#id-company-text').attr('class', 'light-blue');
				
				e.preventDefault();
			 });
			 
			});
		</script>
	</body>
</html>

<?php 
if (isset($_POST['matricule']) and isset($_POST['password']) and isset($_POST['connexion']))
{  $pass=$_POST['password'];
	$matricule=$_POST['matricule'];
	$a1=$_POST['matricule'];
	$premiers_caracters=extraire_caracteres(majuscule($a1),3);
	
	switch ($premiers_caracters) {
	case 'SCO'://connexion des membre de la scolarite
		include"php/connexion_scolarite.php";
		break; //fin connexion des membre de la scolarite
		
	case 'PRE'://connexion des membre de la direction des études
		include"php/connexion_prefecture.php";
		break; //fin connexion des membre de la direction des études
		
	case 'SUR'://connexion des membre de la surveillance générale
		include"php/connexion_surveillant.php";
		break;//fin connexion des membre de la surveillance générale
		
	case 'ENS'://connexion des membre enseignants
		include"php/connexion_enseignant.php";
		break; //fin connexion des membre enseignants
		
	case 'ELE'://connexion des membre élève
		include"php/connexion_eleve.php";
		break;//fin connexion des membre élève
		
	default://si l'un de ces cas n'est pas valide, on renvoi l'utilisateur qui essaye de se connecter.
	echo '<script language="javascript"> alert("Ce login n\'est pas valide. ") </script>';
	echo '<script language="javascript"> history.go(-1); </script>';
		break;}//fin de la redirection des membre n'ayant pas accès
}
 ?>
