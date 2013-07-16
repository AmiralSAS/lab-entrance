jQuery(function ($){
    console.log('jQuery est reconnu');
    // Mode strict
    // 'use strict';

    
    /* Code socket */
    var socket                              = io.connect();
    
    socket.on("confirm_connection", function(data){
        $("#receiver").text(data.text);
    });
    
    $('body').on('click', '#receiver', function(event){
        socket.emit("clickOnP");
    });
    socket.on("confirm_clickOnP", function(data){
        $("#receiver").text(data.text);
    });

});