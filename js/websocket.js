﻿var setUpWebSocket = function(){

  clientWebSocket = new WebSocket('ws://37.200.99.34:9005');

  clientWebSocket.onopen = function(){
    clientWebSocket.send(JSON.stringify({ init: true, url: location.href })); // inform server whether you are host or guest of chatroom
  };

  clientWebSocket.onmessage = function(e){ // this event method gets called when nodeJS-server sent message to client
    
    var message = JSON.parse(e.data);
    
    if(message.init){ // a new client has create chatroom or is invited by someone
    
      chatroomHash = message.chatroom;
      userID = message.userID;
      
      if(message.numberOfGuests){ // not 0 then there are other guests
        App.router.startpageController.createNumberOfWebSockets(message.numberOfGuests);
      }
      else{ // I'm the first and so the host
        
        var chatroomUrl = '/chatroom/' + chatroomHash;
        App.router.startpageController.redirectClientToChatroom(chatroomUrl);
        
        webRTCSockets.push( new webkitRTCPeerConnection({ "iceServers": [{ "url": "stun:provserver.televolution.net" },{ "url": "stun:stun1.voiceeclipse.net" }] }) );
        
        
      }
    }
    
    
    
  };

};