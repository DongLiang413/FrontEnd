// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyParser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-1 algorithm
var sha1 = require('sha1');

// include the mysql module
var mysql = require("mysql");

var path = require('path');

var xml2js = require('xml2js');

var parser = new xml2js.Parser();

var xml_host;
var xml_user;
var xml_pass;
var xml_db;
var xml_port;
var connection;

fs.readFile(__dirname + '/sample_dbconfig.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        xml_host = result.dbconfig.host[0];
        xml_user = result.dbconfig.user[0];
        xml_pass = result.dbconfig.password[0];
        xml_db   = result.dbconfig.database[0];
        xml_port = result.dbconfig.port[0];
        connection = mysql.createConnection({
          host: xml_host,
          user: xml_user,
          password: xml_pass,
          database: xml_db,
          port: xml_port
        });
        console.log('Done');
    });
});

// apply the body-parser middleware to all incoming requests
//app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());    //get whole req

var placename;
var address1;
var address2;
var opentime;
var closetime;
var addinfo;
var addurl;
var isValid;
var checkValidAcc;
var name;

// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));

// // GET method route for the favourites page.
// It serves favourites.html present in client folder
app.get('/favourites',function(req, res) {
  if (!req.session.user){
   console.log('session not started');
   res.redirect('/login');
 }
 else{
	 res.sendFile(path.join(__dirname + '/client/favourites.html'));
 }
});

app.get('/admin',function(req, res) {
  if (!req.session.user){
   console.log('session not started');
   res.redirect('/login');
 }
 else{
   res.sendFile(path.join(__dirname + '/client/admin.html'));
  }
});

app.get('/getAdmin', function(req, res) {
    console.log("getAdmin");
    if (!req.session.user){
     console.log('session not started');
     res.redirect('/login');
    }
    else{
      connection.query('SELECT * FROM tbl_accounts', function(err,rows, fields) {
      	if (err) throw err;
      	if (rows.length == 0){
      		console.log("No entries in accounts table");
        }
       else {
         var arrayVar = [];
         for (var i = 0 ; i < rows.length; i++){
           var JSONObj = {};
           JSONObj.id = rows[i].acc_id;
           JSONObj.name = rows[i].acc_name;
           JSONObj.login = rows[i].acc_login;
           JSONObj.password = rows[i].acc_password;
           arrayVar.push(JSONObj);
           console.log(arrayVar);
         }
         var final = {placeList: arrayVar};
         console.log("array= ", arrayVar);
         var response = {res: final};
         console.log("response: ", response);
         res.send(response);
          }
      });
    }
   });

   app.post('/delete',function(req, res) {
     var  temp = req.body.name;
     if ( temp != req.session.user){
        connection.query('DELETE FROM tbl_accounts WHERE acc_name =?',[req.body.name],  function() {
              checkValidAcc = true;
              res.send(checkValidAcc);
        });
      }
      else{
        checkValidAcc = false;
        res.send(checkValidAcc);
      }
   });

   var saveBool = false;
   app.post('/save',function(req, res) {
     if (req.session.user){
      connection.query('SELECT * FROM tbl_accounts WHERE acc_login =?',[req.body.login], function(err, rows, fields) {
          if (err) throw err;
           console.log(rows);
           console.log(req.session.login);
           if (rows.length == 1){
             console.log(saveBool);
             saveBool = false;
             res.send(saveBool);

           }
          else{
              var value = {
                acc_login: req.body.login,
                acc_name: req.body.name,
                acc_password: req.body.password
              };
              connection.query('INSERT tbl_accounts SET ?', value,  function(err, result) {
                    if (err) throw err;
                    saveBool = true;
                    res.send(saveBool);
              });
          }
   });
  }
 });

var updateBool;
 app.post('/update',function(req, res) {
   if (req.session.user){
    connection.query('SELECT * FROM tbl_accounts WHERE acc_name =?',[req.body.name], function(err, rows, fields) {
        if (err) throw err;
        console.log(rows.name);
        console.log(rows);
        console.log("meeeeeeeeeeeeeeeeeeeeee");

         if (rows.length == 1){
           console.log("falseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
           console.log(rows);
           updateBool = false;
           res.send(updateBool);

         }
        else{
            console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

            //connection.query('UPDATE tbl_accounts SET acc_name=?, acc_login =?, acc_password =? WHERE acc_id =?',[req.body.name, req.body.login, req.body.paswword, req.body.id], function(err) {
            connection.query('UPDATE tbl_accounts SET acc_name=?, acc_login =?, acc_password =? WHERE acc_id =?',
            [req.body.acc_name, req.body.acc_login, req.body.acc_password, req.body.acc_id], function (err, result) {
              if (err) throw err;
              updateBool = true;
              console.log(updateBool);
              console.log("11111");
            });
            res.send(true);
       }
  });
  }
});

   app.get('/setName',function(req, res) {
        res.write(name);
        res.end();

   });


// GET method route for the addPlace page.
// It serves addPlace.html present in client folder
app.get('/addPlace',function(req, res) {
   if (!req.session.user){
    console.log('session not started');
    res.redirect('/login');
   }
   else{
      res.sendFile(path.join(__dirname + '/client/addPlace.html'));
   }
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  console.log('login page');
  res.sendFile(path.join(__dirname + '/client/login.html'));
});

// GET method to return the list of favourite places
// The function queries the table tbl_places for the list of places and sends the response back to client
app.get('/getListOfFavPlaces', function(req, res) {
    console.log("getListOfFavPlaces");
    if (!req.session.user){
     console.log('session not started');
     res.redirect('/login');
    }
    else{
      connection.query('SELECT * FROM tbl_places', function(err,rows, fields) {
      	if (err) throw err;
      	if (rows.length == 0){
      		console.log("No entries in books table");
        }
      	else {
          var arrayVar = [];
      		for (var i = 0 ; i < rows.length; i++){
            var JSONObj = {};
            JSONObj.placename = rows[i].place_name;
            JSONObj.addressline1 = rows[i].addr_line1;
            JSONObj.addressline2 = rows[i].addr_line2;
            JSONObj.opentime = rows[i].open_time;
            JSONObj.closetime = rows[i].close_time;
            JSONObj.additionalinfo = rows[i].add_info;
            JSONObj.additionalinfourl = rows[i].add_info_url;
            arrayVar.push(JSONObj);
          }
          var final = {placeList: arrayVar};
          console.log("array= ", arrayVar);
          var response = {res: final};
          console.log("response: ", response);
          res.send(response);
          }
      });
    }
   });

// POST method to insert details of a new place to tbl_places table
app.post('/postPlace', function(req, res) {

  placename = req.body.placename;
  address1 = req.body.addressline1;
  address2 = req.body.addressline2;
  opentime = req.body.opentime;
  closetime = req.body.closetime;
  addinfo = req.body.additionalinfo;
  addurl = req.body.additionalinfourl;

  var rowToBeInserted = {
    place_name: placename,
    addr_line1: address1,
    addr_line2: address2,
    open_time: opentime,
    close_time: closetime,
    add_info: addinfo,
    add_info_url: addurl
  };

  connection.query('INSERT tbl_places SET ?', rowToBeInserted, function(err, result) {  //Parameterized insert
    if(err) throw err;
    console.log("Values inserted");
    res.redirect('/favourites');
  });
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/validateLoginDetails', function(req, res) {

  var username= req.body.user;
  var password = req.body.pass;
  name = username;

  connection.query('SELECT * FROM tbl_accounts WHERE acc_login = ? AND acc_password = ?', [username, sha1(password)],
  function (error, results, fields) {
    if(error) {
        throw error;
    }
    else {
        if(results.length == 0) {
          isValid = false;
          console.log('Validation failed');
          res.redirect('/login');
        }
        else {
          // create session
          req.session.user = results[0].acc_login;
          req.session.name = results[0].acc_name;
          console.log(req.session.name);
          // send a message to client that validation passed
          isValid = true;
          console.log('Validation passed');
          res.redirect('/favourites');
        }
    }
  });
});

app.get('/checkValidOrInvalid', function(req, res) {
    if (isValid == false){
      res.send(isValid);
    }
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  if (!req.session.user){
		res.send('session not started');
  }
  else{
  		req.session.destroy();
      console.log('session complete');
  		res.redirect('/login');
      //res.sendFile(__dirname + '/favourites.html');
  }
});

// middle ware to server static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/client/404.html'));
});
