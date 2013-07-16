
/* Modules */
var colors                              = require("colors");
var prototypejs                         = require('prototype');
Object.extend(global, prototypejs); // to facilitate use of prototype
var http                                = require("http");
var url                                 = require("url");
var fs                                  = require("fs");
var express                             = require("express");
app                                     = express();
var server                              = http.createServer(app);
var io                                  = require('socket.io').listen(server);

/* Configuration */
var port                                = 3000;

/* Create server */
server.listen( port );

// When we ask for a webpage
app.use(express.static(__dirname + '/public'));
// When root url is called
app.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

// Here we play with sockets
io.sockets.on('connection', function(socket){
    var data                            = {};
    data.text                           = "It is working ! Click on me !";
    console.log( "      Client connected".blue.bold );
    socket.emit("confirm_connection", data);

    socket.on("clickOnP", function(){
        var data                        = {};
        data.text                       = "You clicked, it changed !";
        socket.emit("confirm_clickOnP", data);
    })
});

console.log( "      Server listening on port : ".blue.bold + port );