<!DOCTYPE html>
<?php
error_reporting(E_ALL);
ini_set( 'display_errors','1');
session_start(); // Starting Session
if(isset($_SESSION['login_user'])){
	header("location: favplaces.php");
}
?>
<html>
	<head>
		<meta charset = "utf-8">
		<title>Login</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css">
		<script>

		</script>
	</head>
	<body>
		<div class="login">
			<h1 id = "login"> Login Page </h1>
			<p> Please enter your use name and password. Both are case sensitive </p>
		</div>

	<?php

	$error=''; // Variable To Store Error Message

	if (isset($_POST['submit'])) {  // when name = "submit" is clicked
		if (empty($_POST['login'])||empty($_POST['password'])){
			if (empty($_POST['login'])) {
			//$error = "<p class='err'>Username or Password is invalid</p>";
			echo "<p class='invalid' id='invalid'>User's login name is invalid. Please input something.</p>";
			}
			if (empty($_POST['password'])){
			echo "<p class='invalid' id='invalid'>Password is invalid. Please input something.</p>";
			}
		}
		else{
			// Define $usn as username and $psw as password
			$usl = $_POST['login'];
			$psw = $_POST['password'];

			include_once 'database.php';
			$con = new mysqli($db_servername, $db_username, $db_password, $db_name);

			if($con->connect_error) {
				echo "Failed to connect to MySQL: " . mysqli_connect_error();
				exit();
			} else {

				// To protect MySQL injection for Security purpose
				$usl = trim($usl);
				$psw = stripslashes(sha1(trim($psw))); //convert to sha1

				$acc_name = '';

				$sql_query = 'SELECT acc_id, acc_name, acc_login, acc_password FROM tbl_accounts WHERE acc_login=\''.$usl.'\' AND acc_password=\''.$psw.'\' LIMIT 1;';
        $result = $con->query($sql_query);

				if($result->num_rows == 1) {
				// if($rows == 1) {
					$acc_name = $usl;
					$_SESSION['login_user']=$acc_name; // Initializing Session
					header("location: favplaces.php");
				} else {
					echo "<p class='invalid' id='invalid'>Password is not correct. Please try again.</p>";
				}
				$con -> close(); // Closing connection
			}
		}
	}
	?>

	<br>
		<br><br>
		<div id="content">
		<form action="login.php" name="form" method="post" autocomplete="off">
			<b>Login:</b><br>
			<input type="text" name="login" id="login" class="form-control">
			<br><br>
			<b>Password:</b><br>
			<input type="password" name="password" id="password" class="form-control">
			<br><br>
			<br><br><br>
			<input type="submit" name="submit" value="Submit" class="btn btn-primary btn-block">
		</form>
		<br><br>
		</div>
		<br><br><br><br><br><br>

	</body>

</html>
