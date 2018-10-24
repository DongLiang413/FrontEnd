<?php
      if (file_exists('dbconfig.xml')){
            $xml = simplexml_load_file('dbconfig.xml');

            $db_servername = $xml->host;
            $db_port = $xml->port;
            $db_name = $xml->database;
            $db_username = $xml->user;
            $db_password = $xml->password;
      }
      else{
            exit('Could not load the file ...');
      }

?>
