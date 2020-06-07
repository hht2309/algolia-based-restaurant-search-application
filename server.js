var express = require('express');
var app = express();
var path = require('path');
var https = require('https'); 
var fs = require('fs'); 

// ssl certificate load
var key = fs.readFileSync('server.key');
var cert = fs.readFileSync( 'server.crt' );
var options = {
    key: key,
    cert: cert
}

// Point static path to dist
app.use (function (req, res, next) {
  if (req.secure) {
          // request was via https, so do no special handling
          next();
  } else {
          // request was via http, so redirect to https
          res.redirect('https://' + req.headers.host + req.url);
  }
});

app.use(express.static(path.join(__dirname, 'dist/angularApp/'))); 

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/dist/angularApp/index.html'));
// });


// Create https-server
https.createServer(options, app).listen(443);

// Redirect from http port 80 to https
var http = require('http');
http.createServer(app).listen(80); 

console.log("Server started at localhost"); 