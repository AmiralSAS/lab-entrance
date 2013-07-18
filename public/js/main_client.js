jQuery(function ($){
    console.log('jQuery est reconnu');
    // Mode strict
    // 'use strict';
    var socket      = io.connect();
    var msgtpl      = $('#msgtpl').html();
    var lastmsg     = false;
    
    $('#msgtpl').remove();

    socket.on("confirm_connection", function(data){
        $("#receiver").text(data.text);
        $("#cacheAll").fadeOut();
    });
    
    $('#loginform').submit(function(event){
        event.preventDefault();
        socket.emit('login', {
            username : $('#username').val()
        });
    });
    socket.on("logged", function(){
        $('#login').fadeOut();
        $('#message').focus();
    });

    /* Send message to server */
    $('#form').submit(function(event){
        event.preventDefault();
        if($('#message').val() != ''){
            socket.emit('newmsg', {message: $('#message').val()})
            $('#message').val('');
            $('#message').focus();
        }
    });
    
    /* add a message */
    socket.on('newmsg', function(message){
        if(lastmsg != message.user.id){
            $('#message').append("<div class='sep'></div>");
            lastmsg = message.user.id;
        }
        $('#messages').append('<div class="message">' + Mustache.render(msgtpl, message) + "</div>");
        $('#chat_output').animate({scrollTop : $('#messages').prop('scrollHeight') }, 50);
    });

    
    /***********************
    * Manage connected users
    ***********************/
    /* Connection of a client */
    socket.on('newusr', function(user){
        $("#users").append('<p id="' + user.username + '">' + user.username + '</p>');
    });
    
    /* Deconnection of a client */
    socket.on('disusr', function(user){
        $('#' + user.username).remove();
    });

});