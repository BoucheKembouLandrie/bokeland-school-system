
<form class="formoid-solid-blue" style="background-color:#ebecff;font-size:16px;font-family:'Roboto',Arial,Helvetica,sans-serif;color:#34495E;max-width:900px;min-width:150px" method="post" enctype="multipart/form-data">

<div ><h2 style="color:#000;">Inscription d'élèves</h2></div>
	
    <div class="element-select" id="div_classe" k>
    <div class="item-cont"><div class="large"><span><select name="annee_scolaire" id="classe" required="required">
    <option value="" selected="selected">-------- Sélectionnez l'année scolaire--------</option>
		 while($t10=mysql_fetch_array($s20)){ 
         echo'
    <option value="'.$t10['nom_annee_scolaire'].'">'.$t10['nom_annee_scolaire']; 
        

        </select>
        <div class="element-select" id="div_classe" k>
    <div class="item-cont"><div class="large"><span><select name="montant_inscription"  id="classe" required="required">
    <option value="" selected="selected">-------- Sélectionnez le montant d'inscription--------</option>
		<?php  while($t10=mysqli_fetch_array($s30)){ ?> 
    <option value="<?php echo $t10['montant_inscription']; ?>">
		<?php  echo $t10['montant_inscription']; ?> FCFA
        
<?php }?>       
        </select>

	<div class="element-name"><label class="title">
    <span class="required">Noms/prénoms</span></label>
   
    <span class="nameLast" id="div_nom" >
    <input placeholder="Saisir le nom ici" type="text" size="8" name="nom" value="<?php if(isset($_POST['nom'])) {echo $_POST['nom'];}?>" value="<?php  echo @$_POST['nom']; ?>" id="nom" required="required"/><span class="icon-place"></span></span>
    
    <span class="nameFirst" id="div_prenom">
    <input placeholder="Saisir le prénom ici" type="text" size="14" name="prenom" value="<?php if(isset($_POST['prenom'])) {echo $_POST['prenom'];}?>" id="prenom" value="<?php  echo @$_POST['prenom']; ?>" required="required"/><span class="icon-place">
    </span></span></div>
    
	<div class="element-date" id="div_date_naissance">
    <label class="title"><span >Date de naissance</span></label>
    <div class="item-cont"><input class="large" type="date" id="date_naissance" name="date_naissance" value="<?php if(isset($_POST['date_naissance'])) {echo $_POST['date_naissance'];}?>" required="required" value="<?php  echo @$_POST['date_naissance']; ?>" placeholder="Exemple: 2017-05-31 "/><span class="icon-place"></span></div></div>
    
 
	<div class="element-select" id="div_lieu_naissance"><label class="title"><span class="required">Lieu naissance</span></label><div class="item-cont"><div class="large"><span><select name="lieu_naissance" value="<?php if(isset($_POST['lieu_naissance'])) {echo $_POST['lieu_naissance'];}?>" required="required" >
    <option value="" selected="selected">-------- Sélectionnez une ville --------</option>
		<?php  include "php/select_ville_du_cameroun.html"; ?>
        </select><i></i><span class="icon-place"></span></span></div></div></div>
     
     <div class="element-radio" id="div_sexe" >
    <div class="column column1"><label><input type="radio" name="sexe" value="<?php if(isset($_POST['sexe'])) {echo $_POST['sexe'];}?>" value="Homme" required="required" onChange="afficher_div('div_photo');" /><span>Homme <input type="radio" name="sexe" value="<?php if(isset($_POST['sexe'])) {echo $_POST['sexe'];}?>" value="Femme" required="required" onChange="afficher_div('div_photo');"/><span>Femme</span></label>
    </div><span class="clearfix"></span>
</div>
	
    <div  id="div_photo">
    <label class="title"><span class="required">Photo de l'élève</span></label>
    <div class="item-cont"><input  onChange="afficher_div('div_classe');" class="large" type="file" name="logo" value="<?php if(isset($_POST['logo'])) {echo $_POST['logo'];}?>" required="required"/><span class="icon-place"></span></div></div>
        
	<div class="element-select" id="div_classe" k><label class="title"><span class="required">Classe</span></label><div class="item-cont"><div class="large"><span><select name="classe" value="<?php if(isset($_POST['classe'])) {echo $_POST['classe'];}?>" id="classe" required="required">
    <option value="" selected="selected">-------- Sélectionnez une salle de classe --------</option>
		<?php  while($t10=mysqli_fetch_array($s10)){ ?> 
    <option value="<?php echo $t10['id_classe']; ?>">
		<?php  echo $t10['nom_unique_classe']; ?>
        
<?php }?>       
        </select>
        <div class="element-radio" id="div_redouble" ><label class="title"><span class="required">Redouble la classe?</span></label>
    <div class="column column1"><label><input type="radio" name="redouble" value="oui" required="required"  /><span> Oui <input type="radio" name="redouble" value="non" required="required" /><span> Non </span></label>
    </div><span class="clearfix"></span>
</div>
        <i></i><span class="icon-place"></span></span></div></div></div>
  <div id="t"></div>
	<div class="element-phone" id="div_contact">
    <label class="title">Contact du parent</label>
    <div class="item-cont"><input class="large" required="required" type="text" value="<?php  echo @$_POST['nom']; ?>"  maxlength="24" name="contact" value="<?php if(isset($_POST['contact'])) {echo $_POST['contact'];}?>" placeholder="Exemple: 698843185 " /><span class="icon-place"></span></div></div>
     

<div class="submit" id="div_enregistrer"  ><input type="submit" id="div_enregistrer" value="Enrégistrer"/></div>
</form>
