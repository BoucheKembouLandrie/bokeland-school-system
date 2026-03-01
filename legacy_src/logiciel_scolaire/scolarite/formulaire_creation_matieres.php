<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>GESTION SCOLARITE</title>
      <?php include "php/head_prefecture.php"; ?>
</head>

<body>
    <div id="wrapper">
       <?php include "php/menu_prefecture.php"; ?>  
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper" >
            <div id="page-inner">
                <div class="row">
                    <div class="col-md-12">
                     <h2><h2><?php echo $prefecture; //variable comportant le nom de la section ?> </h2>   </h2>   
                        <h5>Bienvenue M. Jhon Deo. </h5>
                    </div>
                </div>              
                 <!-- /. ROW  -->
                  <hr />
                <div class="row">
        <form action="" method="get" >
<div class="col-md-4" class="form-group">
   
      <select class="selectpicker form-control" >
        <option>SIXIEME I</option>
        <option>SIXIEME II</option>
        <option>TERMINALE C</option>
      </select>
</div>
  


<div  class="col-md-5 col-md-offset-1" class="form-group">
     
<input type="text" class="form-control" maxlength="64" placeholder="Search" />

</div>

<div class="col-xs-pull-1" class="form-group">
     
<input type="submit" name="search" value="Recherche" class="btn btn-info" />

</div>
</form>
</div>
       <!-- barre  -->
                <hr />                
                 <!-- /. ROW  -->
                <div class="row" >
                    <div class="col-md-3 col-sm-12 col-xs-12">
  <div class="panel panel-primary text-center no-boder bg-color-green">
                        <div class="panel-body">
                            <i class="fa fa-comments-o fa-5x"></i>
                            <h4>Liste des classes </h4>
                             <?php for ($i=1; $i<=5; $i++){ ?><h5><a href="#" style="color:#000">SIXIEME I</a></h5><?php } ?>
                        </div>
                        <div class="panel-footer back-footer-green">
                             <i class="fa fa-rocket fa-5x"></i>
                            Lorem ipsum dolor sit amet sit sit, consectetur adipiscing elitsit sit gthn ipsum dolor sit amet ipsum dolor sit amet
                            
                        </div>
                    </div>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
               
                    <div class="panel panel-default">
                        <div class="panel-heading">
                           Liste des élèves de la classe de ???????????????
                        </div>
                        <div class="panel-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Noms & Prénoms</th>
                                            <th>Sex</th>
                                            <th >Classe</th>
                                             <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <?php for ($i=1; $i<=30; $i++){ ?>
                                        <tr>
                                            <td><?php echo $i; ?></td>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                            <td><a href="#">Profil</a></td>
                                        </tr>
                                      <?php } ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    </div>
                </div>
                 <!-- /. ROW  -->
                        
                 <!-- /. ROW  -->           
    </div>
             <!-- /. PAGE INNER  -->
            </div>
         <!-- /. PAGE WRAPPER  -->
        </div>
     <!-- /. WRAPPER  -->
    <!-- SCRIPTS -AT THE BOTOM TO REDUCE THE LOAD TIME-->
    <!-- JQUERY SCRIPTS -->
    <script src="contenu/js/jquery-1.10.2.js"></script>
      <!-- BOOTSTRAP SCRIPTS -->
    <script src="contenu/js/bootstrap.min.js"></script>
    <!-- METISMENU SCRIPTS -->
    <script src="contenu/js/jquery.metisMenu.js"></script>
     <!-- MORRIS CHART SCRIPTS -->
     <script src="contenu/js/morris/raphael-2.1.0.min.js"></script>
    <script src="contenu/js/morris/morris.js"></script>
      <!-- CUSTOM SCRIPTS -->
    <script src="contenu/js/custom.js"></script>
    
   
</body>
</html>
