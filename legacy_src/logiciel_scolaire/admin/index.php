<?php include"../php/configurations_etablissement.php"; ?>
<!DOCTYPE html>
<!--[if lt IE 7]> <html class="lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]> <html class="lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]> <html class="lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Espace administrateur</title>
  <link rel="stylesheet" href="css/style.css">
  <!--[if lt IE 9]><script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
</head>
<body>
  <section class="container">
    <div class="login">
      <h1>Espace administrateur <br> <a href="../etablissement/">Se connecter en tant que Personnels</a></h1>
      <form method="post" action="">
        <p><input type="text" name="login" value="" placeholder="Login" required></p>
        <p><input type="password" name="pass" value="" placeholder="Mot de passe" required></p>
        <p class="remember_me">
          <label>
          </label>
        </p>
        <p class="submit"><input type="submit" name="commit" value="Connexion"></p>
      </form>
    </div>

  </section>

  <section class="about">
    <p class="about-author">
      2018 <a href="#" >Administration</a> -
       by <a href="#"><?php echo $Marc_School ?> <?php echo $version_application ?></a>
  </section>
</body>
</html>

<?php // récupération des valeur entrée par l'utilisateur

 if(isset($_POST['login']) and isset($_POST['pass']) )
{
    $login=trim($_POST['login']);
    $pass=$_POST['pass'];
	 $nbr_info_admin=mysqli_num_rows(mysqli_query($mysqli, "select *from  admin where login_admin = '$login' and pass_admin='$pass'"));
	  $info_admin=mysqli_fetch_array(mysqli_query($mysqli, "select *from  admin where login_admin = '$login' and pass_admin='$pass'"));
  	if (($nbr_info_admin!==0))
	{
		$_SESSION['login_admin']= $login;
		$_SESSION['pass_admin']= $pass;
		$_SESSION['id_admin']= $info_admin['id_admin'];
	  echo '<script language="javascript">  document.location.href="admin/"; </script>';
      exit(); // pour que le reste de code ne s'exécute plus
    }
    else
    {
       echo '<script language="javascript">  alert("Login ou mot de passe invalide."); </script>';
	   echo '<script language="javascript">  history.go(-1); </script>';
	   exit(); // pour que le reste de code ne s'exécute plus
       }
}

?>