
<!DOCTYPE html>
<?php
error_reporting(E_ALL);
ini_set( 'display_errors','1');
session_start();
// if (($_SESSION['isLoggedIn'] == false){
//   	header("location: login.php");
// }

 ?>

<html lang="en">
<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="style.css">
  <title>Favourite Places</title>

</head>
<body>


  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <ul class="nav navbar-nav">
        <li><a href = "favplaces.php">My Favorites</a></li>

        <!-- <form action="logout.php" method="post" class="logout"> -->
        </ul>
        <div>
          <a href = "logout.php" class = "logout">Logout</a>
          <b class="logout" id="logout" >Welcome ! &nbsp;<i><?php echo $_SESSION['login_user']; ?>&nbsp;&nbsp;</i></b>


        </div>

      </div>

  </nav>
  <h1> My Favourite Places </h1>

  <div class="container">
    <table class="table" id="myFavTable">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Address</th>
          <th scope="col">Open / Close</th>
          <th scope="col">Information</th>
          <th scope="col">URL</th>
        </tr>
  <?php
  if(isset($_SESSION['login_user'])){

		$error=''; // Variable To Store Error Message

	  include_once 'database.php';
    $con = new mysqli($db_servername, $db_username, $db_password, $db_name);

		if($con->connect_error) {
      echo "Failed to connect to MySQL: " . mysqli_connect_error();
  		exit();
		}
		else {
      if (empty($_POST)){
          $query = "SELECT * FROM tbl_places";
      }
      else{
        $id = trim($_POST['id']);
        $name = trim($_POST['name']);

        if ($id == "" && $name != ""){
          $query = "SELECT * FROM tbl_places WHERE place_name LIKE '%$name%' ";
        }
        else if ($id != "" && $name == ""){
          $query = "SELECT * FROM tbl_places WHERE place_id = '{$id}' ";
        }
        else if ($id == "" && $name == ""){
          $query = "SELECT * FROM tbl_places";
        }
        else if ($id != "" && $name != ""){
           $query = "SELECT * FROM tbl_places WHERE place_id = '{$id}' AND place_name LIKE '%$name%' ";
        }

      }


      $result = $con -> query($query);

  			while($row = $result -> fetch_assoc()){
  				echo "<tr>";
  				echo '<td>&nbsp;&nbsp;'.$row['place_id'].'</td>';
  				echo '<td>&nbsp;&nbsp;'.$row['place_name'].'</td>';
  				echo '<td>&nbsp;&nbsp;'.$row['addr_line1'].', '.$row['addr_line2'].'</td>';
  				echo '<td>&nbsp;&nbsp;'.$row['open_time'].' / '.$row['close_time'].'</td>';
  				echo '<td>&nbsp;&nbsp;'.$row['add_info'].'</td>';
  				echo '<td>&nbsp;&nbsp;'.$row['add_info_url'].'</td>';
  				echo '</tr>';
  			}

		}

	}
	else{
		header("location: login.php");
	}

  ?>

</thead>
<tbody>
</tbody>
</table>
</div>


<br><br>
<div id="content">
<form name="form" method="post" >
  <b>Place ID:</b><br>
  <input type="text" name="id" id="id" class="form-control">
  <br><br>
  <b>Place Name:</b><br>
  <input type="text" name="name" id="name" class="form-control">
  <br><br>
  <br><br><br>
  <input type="submit" name="filter" value="Filter" class="btn btn-primary btn-block">
</form>
<br><br>
</div>
<br><br><br><br><br><br>

</body>

</html>
