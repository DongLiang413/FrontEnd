<?php
session_start();
session_destroy(); // Destroying All Sessions
header("location: login.php"); // Redirecting To Home Page

?>
