<?php include "../../php/configurations_etablissement.php"; ?>
<?php include "../../php/fonctions_php.php"; ?>
<?php 

if(isset($_POST['classe']) and !empty($_POST['classe'])  )
{
	 $id=$_POST['classe'];
	$t=mysqlI_query($mysqli, "select *from scolarite where id_scolarite=$id ");
	$s2=mysqli_fetch_array($t);
	$nombre_tranche=$s2['nbr_tranche'];
$id=$s2['id_scolarite'];
	 for($i=1; $i<=$nombre_tranche; $i++){
    
   echo ' <strong style="color:#06C;"><center><u>Tranche N°'.$i.'</u></center></strong>
	<div class="element-input" >
    <label class="title">Montant tranche N°'.$i.' (en FCFA)<span class="required">*</span></label>
    <input class="large" type="number" min="1" required name="montant_tranche'.$i.'" required placeholder="Exemple: 10000"/></div>
    
	<div class="element-input" >
    <label class="title">Date de début paiement <span class="required">*</span></label>
    <input class="large" type="date"  name="date_debut'.$i.'" required placeholder="Exemple: 2017-05-29"/>
	<input type="hidden" name="nombre_tranche" value="'.$nombre_tranche.'" /></div>
    <div class="element-input" >
    <label class="title">Date d\'échéance<span class="required">*</span></label>
    <input class="large" type="date"  name="date_fin'.$i.'" required placeholder="Exemple: 2017-05-29"/></div>
    </br></br>';
    
	
	 } //fermeture de for 
    echo '
	<div class="submit">
    <input type="submit" value="Valider"/></div>';
	
}
if(isset($_POST['desactive_statut_personnel']) and !empty($_POST['desactive_statut_personnel'])  )
{
	 $id_desactive_statut_personnel=$_POST['desactive_statut_personnel'];
	if(mysqli_query($mysqli, "update statut_personnel set acces=0 where id_statut_personnel=$id_desactive_statut_personnel"))
	{echo'<script language="javascript"> document.location.href="index.php";</script>';}
	else
	{echo'<script language="javascript"> alert("une erreur pendant la désactivation !!!");</script>';}
}
if(isset($_POST['active_statut_personnel']) and !empty($_POST['active_statut_personnel'])  )
{
	 $id_active_statut_personnel=$_POST['active_statut_personnel'];
	if(mysqli_query($mysqli, "update statut_personnel set acces=1 where id_statut_personnel=$id_active_statut_personnel"))
	{ echo'<script language="javascript"> document.location.href="index.php";</script>';}
	else
	{echo'<script language="javascript"> alert("une erreur pendant l\'activation !!!");</script>';}
}
?>
