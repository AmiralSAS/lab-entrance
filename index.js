
/* Modules */
var colors                              = require("colors");
var prototypejs                         = require('prototype');
Object.extend(global, prototypejs);     // to facilitate use of prototype
var http                                = require("http");
var url                                 = require("url");
var fs                                  = require("fs");
var express                             = require("express");
app                                     = express();
var server                              = http.createServer(app);
var io                                  = require('socket.io').listen(server);

/* Configuration */
// For server
var port                                = process.env.PORT || 80;
// For socket.io
var users                               = {};
var messages                            = [];
var history                             = 10;

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

console.log( "      Server listening on port : ".blue.bold + port );


// Here we play with sockets
io.sockets.on('connection', function(socket){

    var me = false;
    console.log('      New user'.blue.bold);
    
    for (var k in users){
        socket.emit('newusr', users[k]);
    }
    for (var k in messages){
        socket.emit('newmsg', messages[k]);
    }

    socket.emit("confirm_connection", {text : "It is working ! Click on me !"});

    
    /* We get a message */
    socket.on('newmsg', function(message){
        message.user                    = me;
        date                            = new Date();
        message.h                       = date.getHours();
        message.m                       = date.getMinutes();
        // mise en forme de la date pour rajouter les 0 esthétique qui manquent
        if (message.h <10){
            message.h = "0" + message.h;}
        if (message.m <10){
            message.m = "0" + message.m;}
        
        messages.push(message);
        
        if(messages.length > history){
            messages.shift();
        }
        
        console.log('      A message has been send'.bold.blue);
        io.sockets.emit('newmsg', message);
    });

    
    /* User connect */
    socket.on('login', function(user){
        me = user;
        socket.emit("logged");
        users[me.id] = me;
        io.sockets.emit('newusr', me);
        console.log('      User connected');
    });
    
    /* User leave */
    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
        io.sockets.emit('disusr', me);
        delete users[me.id];
        console.log('      User disconnected');
    });
});