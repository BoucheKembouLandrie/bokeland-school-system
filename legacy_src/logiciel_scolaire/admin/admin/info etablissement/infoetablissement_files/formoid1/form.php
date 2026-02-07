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
<link rel="stylesheet" href="<?php echo dirname($form_path); ?>/formoid-default-skyblue.css" type="text/css" />
<span class="alert alert-success"><?php echo FINISH_MESSAGE; ?></span>
<?php else: ?>
<!-- Start Formoid form-->
<link rel="stylesheet" href="<?php echo dirname($form_path); ?>/formoid-default-skyblue.css" type="text/css" />
<script type="text/javascript" src="<?php echo dirname($form_path); ?>/jquery.min.js"></script>
<form class="formoid-default-skyblue" style="background-color:#ebecff;font-size:20px;font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;color:#585166;max-width:900px;min-width:150px" method="post"><div class="title"><h2>Nom etablissement</h2></div>
	<div class="element-input<?php frmd_add_class("input"); ?>" title="Saisir le nom de l'établissement ici"><label class="title">Nom de l'établissement<span class="required">*</span></label><input class="large" type="text" name="input" required="required"/></div>
	<div class="element-select<?php frmd_add_class("select"); ?>" title="Choisissez votr ville"><label class="title">Localisation (Ville)<span class="required">*</span></label><div class="large"><span><select name="select" required="required">

		<option value="option 1">option 1</option>
		<option value="option 2">option 2</option>
		<option value="option 3">option 3</option></select><i></i></span></div></div>
	<div class="element-input<?php frmd_add_class("input2"); ?>" title="Saisir le quartier ici"><label class="title">Localisation (Quartier)<span class="required">*</span></label><input class="large" type="text" name="input2" required="required"/></div>
	<div class="element-input<?php frmd_add_class("input1"); ?>" title="Saisir votre devise ici"><label class="title">Votre devise<span class="required">*</span></label><input class="large" type="text" name="input1" required="required"/></div>
<div class="submit"><input type="submit" value="Valider"/></div></form><script type="text/javascript" src="<?php echo dirname($form_path); ?>/formoid-default-skyblue.js"></script>

<!-- Stop Formoid form-->
<?php endif; ?>

<?php frmd_end_form(); ?>