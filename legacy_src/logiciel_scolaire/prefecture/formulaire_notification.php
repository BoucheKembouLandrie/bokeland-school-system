<?php 
$el=mysqli_query($mysqli, "select *from eleve order by nom_eleve asc");
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script language="javascript">

	function sms(){
	var expedi = $("#expediteur").val();
	var mess = $("#message").val();
	var telep = $("#telephone").val().toString();
	
	 var tel = telep.slice(0,3);
	 var bar = 237;
	 	if(tel!=237){
			var number = bar + telep;
		}else{
			number = telep;	
		}
	}
    </script>
</head>
<body class="blurBg-true" style="background-color:#d3d9eb">



<!-- Start Formoid form-->
<link rel="stylesheet" href="bon_files/formoid1/formoid-metro-cyan.css" type="text/css" />
<script type="text/javascript" src="bon_files/formoid1/jquery.min.js"></script>
<form class="formoid-metro-cyan" style="background-color:#ffffff;font-size:14px;font-family:'Open Sans','Helvetica Neue','Helvetica',Arial,Verdana,sans-serif;color:#666666;max-width:480px;min-width:150px" method="post"><div class="title"><h2>Notifications</h2></div>
	<div class="element-input" title="Expediteur"><label class="title">Expediteur<span class="required"><div style="color:red;">*</div></span></label><input class="large" type="text" name="expediteur" id="expediteur" required/></div>
	<div class="element-multiple" title="Telephone recepteur"><label class="title">Telephone recepteur<span class="required"><div style="color:red;">*</div></span></label><div class="large">
    <select data-no-selected="Nothing selected" name="telephone" id="telephone" multiple="multiple" required="required">
<?php while($re=mysqli_fetch_array($el)){ ?>
		<option value="<?php echo $re['contact_parent_eleve']; ?>"><?php echo $re['contact_parent_eleve']." (".$re['nom_eleve']." ".$re['prenom_eleve'].")"; ?></option>
        <?php } ?> 
        </select></div></div>

	<div class="element-textarea" title="Message"><label class="title">Message <span class="required"><div style="color:red;">*</div></span></label><textarea class="medium" name="message" id="message" cols="20" rows="5" required></textarea></div>
<div class="submit"><input type="submit" value="Envoyer" onClick="sms(this.value);"/></div></form><p class="frmd"><a href="http://formoid.com/v29.php">online forms</a> Formoid.com 2.9</p><script type="text/javascript" src="bon_files/formoid1/formoid-metro-cyan.js"></script>
<!-- Stop Formoid form-->



</body>
</html>