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
<form class="formoid-solid-blue" style="background-color:#ebecff;font-size:16px;font-family:'Roboto',Arial,Helvetica,sans-serif;color:#34495E;max-width:900px;min-width:150px" method="post"><div class="title"><h2>Nom etablissement</h2></div>
	<div class="element-name<?php frmd_add_class("name"); ?>"><label class="title"><span class="required">*</span></label><span class="nameFirst"><input placeholder="Nom First" type="text" size="8" name="name[first]" required="required"/><span class="icon-place"></span></span><span class="nameLast"><input placeholder="Nom Last" type="text" size="14" name="name[last]" required="required"/><span class="icon-place"></span></span></div>
	<div class="element-input<?php frmd_add_class("input"); ?>" title="Saisir le nom de l'établissement ici"><label class="title"><span class="required">*</span></label><div class="item-cont"><input class="large" type="text" name="input" required="required" placeholder="Nom de l'établissement"/><span class="icon-place"></span></div></div>
	<div class="element-radio<?php frmd_add_class("radio"); ?>"><label class="title">Radio Buttons<span class="required">*</span></label>		<div class="column column1"><label><input type="radio" name="radio" value="option 1" required="required"/><span>option 1</span></label><label><input type="radio" name="radio" value="option 2" required="required"/><span>option 2</span></label><label><input type="radio" name="radio" value="option 3" required="required"/><span>option 3</span></label></div><span class="clearfix"></span>
</div>
	<div class="element-select<?php frmd_add_class("select"); ?>" title="Choisissez votr ville"><label class="title"><span class="required">*</span></label><div class="item-cont"><div class="large"><span><select name="select" required="required">

		<option value="option 1">option 1</option>
		<option value="option 2">option 2</option>
		<option value="option 3">option 3</option></select><i></i><span class="icon-place"></span></span></div></div></div>
	<div class="element-select<?php frmd_add_class("select1"); ?>"><label class="title"><span class="required">*</span></label><div class="item-cont"><div class="large"><span><select name="select1" required="required">

		<option value="option 1">option 1</option>
		<option value="option 2">option 2</option>
		<option value="option 3">option 3</option></select><i></i><span class="icon-place"></span></span></div></div></div>
	<div class="element-phone<?php frmd_add_class("phone"); ?>"><label class="title"></label><div class="item-cont"><input class="large" type="tel" pattern="[+]?[\.\s\-\(\)\*\#0-9]{3,}" maxlength="24" name="phone" placeholder="Phone" value=""/><span class="icon-place"></span></div></div>
	<div class="element-input<?php frmd_add_class("input2"); ?>" title="Saisir le quartier ici"><label class="title"><span class="required">*</span></label><div class="item-cont"><input class="large" type="text" name="input2" required="required" placeholder="Localisation (Quartier)"/><span class="icon-place"></span></div></div>
	<div class="element-input<?php frmd_add_class("input1"); ?>" title="Saisir votre devise ici"><label class="title"><span class="required">*</span></label><div class="item-cont"><input class="large" type="text" name="input1" required="required" placeholder="Votre devise"/><span class="icon-place"></span></div></div>
<div class="submit"><input type="submit" value="Valider"/></div></form><script type="text/javascript" src="<?php echo dirname($form_path); ?>/formoid-solid-blue.js"></script>

<!-- Stop Formoid form-->
<?php endif; ?>

<?php frmd_end_form(); ?>