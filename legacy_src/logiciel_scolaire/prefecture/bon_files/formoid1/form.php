<?php

define('EMAIL_FOR_REPORTS', '');
define('RECAPTCHA_PRIVATE_KEY', '@privatekey@');
define('FINISH_URI', 'http://');
define('FINISH_ACTION', 'message');
define('FINISH_MESSAGE', 'Thanks for filling out my form!');
define('UPLOAD_ALLOWED_FILE_TYPES', 'doc, docx, xls, csv, txt, rtf, html, zip, jpg, jpeg, png, gif');

define('_DIR_', str_replace('\\', '/', dirname(__FILE__)) . '/');
require_once _DIR_ . '/handler.php';

?>

<?php if (frmd_message()): ?>
<link rel="stylesheet" href="<?php echo dirname($form_path); ?>/formoid-metro-cyan.css" type="text/css" />
<span class="alert alert-success"><?php echo FINISH_MESSAGE; ?></span>
<?php else: ?>
<!-- Start Formoid form-->
<link rel="stylesheet" href="<?php echo dirname($form_path); ?>/formoid-metro-cyan.css" type="text/css" />
<script type="text/javascript" src="<?php echo dirname($form_path); ?>/jquery.min.js"></script>
<form class="formoid-metro-cyan" style="background-color:#ffffff;font-size:14px;font-family:Georgia,serif;color:#666666;max-width:480px;min-width:150px" method="post"><div class="title"><h2>Notifications</h2></div>
	<div class="element-input<?php frmd_add_class("input"); ?>" title="Expediteur"><label class="title">Expediteur<span class="required">*</span></label><input class="large" type="text" name="input" required="required"/></div>
	<div class="element-number<?php frmd_add_class("number"); ?>" title="Telephone recepteur"><label class="title">Telephone recepteur<span class="required">*</span></label><input class="medium" type="text" min="9" max="12" name="number" required="required" value=""/></div>
	<div class="element-textarea<?php frmd_add_class("textarea"); ?>" title="Message"><label class="title">Message <span class="required">*</span></label><textarea class="medium" name="textarea" cols="20" rows="5" required="required"></textarea></div>
<div class="submit"><input type="submit" value="Envoyer"/></div></form><script type="text/javascript" src="<?php echo dirname($form_path); ?>/formoid-metro-cyan.js"></script>

<!-- Stop Formoid form-->
<?php endif; ?>

<?php frmd_end_form(); ?>