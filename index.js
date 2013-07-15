	var fs = require("fs");
    var express = require("express");
    var port = 3000;

    // the variable "app" is our server
    app = express();

    // When we ask for a webpage
    app.use(express.static(__dirname + '/public'));

    // When a user ask for the root url
    app.get('/', function(req, res) {
        fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
            res.send(text);
        });
    });

    // Launch server and make him listen on port
    app.listen( port );

    console.log( "Server listening on port : " + port );