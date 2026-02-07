<?php

define('EMAIL_FOR_REPORTS', '');
define('RECAPTCHA_PRIVATE_KEY', '@privatekey@');
define('FINISH_URI', 'http://');
define('FINISH_ACTION', 'message');
define('FINISH_MESSAGE', '');
define('UPLOAD_ALLOWED_FILE_TYPES', 'doc, docx, xls, csv, txt, rtf, html, zip, jpg, jpeg, png, gif');

define('_DIR_', str_replace('\\', '/', dirname(__FILE__)) . '/');
require_once _DIR_ . '/handler.php';

?>

<?php if (frmd_message()): ?>
<link rel="stylesheet" href="<?php echo dirname($form_path); ?>/formoid-solid-blue.css" type="text/css" />
<span class="alert alert-success"><?php echo FINISH_MESSAGE; ?></span>
<?php else: ?>
<!-- Start Formoid form-->
<link rel="stylesheet" href="<?php echo dirname($form_path); ?>/formoid-solid-blue.css" type="text/css" />
<script type="text/javascript" src="<?php echo dirname($form_path); ?>/jquery.min.js"></script>

<form class="formoid-solid-blue" style="background-color:#FFFFFF;font-size:14px;font-family:'Roboto',Arial,Helvetica,sans-serif;color:#34495E;max-width:480px;min-width:150px" method="post" action="">
	<div class="title"><h2>Nom etablissement</h2></div>
	<div class="element-input<?php frmd_add_class("input"); ?>" title="Saisir votre matricule ici"><label class="title"><span class="required">Matricule (Obligatoire)</span></label><div class="item-cont">
    <input class="large" type="text" name="matricule" required="required" placeholder="Entrez votre matricule"/><span class="icon-place"></span></div></div>
	<div class="element-password<?php frmd_add_class("password"); ?>" title="Saisir votre mot de passe ici"><label class="title"><span class="required">Pass (Obligatoire)</span></label><div class="item-cont">
    <input class="large" type="password" name="password" value="" required="required" placeholder="Entrez votre mot de passe"/>
    <span class="icon-place"></span></div></div>
<div class="submit"><input type="submit" value="Connexion"/></div></form>

<!-- Stop Formoid form-->
<?php endif; ?>

<?php frmd_end_form(); ?>

