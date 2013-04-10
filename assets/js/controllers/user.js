﻿App.UserController = Ember.ObjectController.extend({
  init: function() {
  },
  onGetMediaSuccess: function(stream) {
    window.dispatchEvent(new CustomEvent("localmedia:available", {
      detail: {
        stream: stream
      }
    }));

    if ( typeof webkitURL !== "undefined") {
      document.getElementById('videoboxes').getElementsByTagName('div')[0].getElementsByTagName('video')[0].src = webkitURL.createObjectURL(stream);
    } else if ( typeof URL != "undefined") {
      document.getElementById('videoboxes').getElementsByTagName('div')[0].getElementsByTagName('video')[0].src = URL.createObjectURL(stream);
    } else {
      document.getElementById('videoboxes').getElementsByTagName('div')[0].getElementsByTagName('video')[0].mozSrcObject = stream;
    }

    document.getElementById('videoboxes').getElementsByTagName('div')[0].getElementsByTagName('video')[0].play();
    /* after user allows camera and mic, we disable the infobox and the black overlayfilter*/
    $('#infoField').fadeOut();
    $('#blackFilter').fadeOut();
  },
  onGetMediaError: function(error) {
    console.log("LocalMedia: ERROR");
    console.log(error);
    
    /* check if user likes to do a textchat or not */
    if(confirm('Nach dem du keinen Zugriff auf Kamera und Mikrofon erlaubst, kannst du nur einen Textchat führen! Ist das OK?')) {
      $('#infoField').fadeOut();
      $('#blackFilter').fadeOut();
    }
    else {
      console.log('************ein redirect muss noch implementiert werden***********');
      alert('Zurück auf die Startseite ...');
    }
  },
  startGetMedia: function() {
    //request audio and video from your own hardware
    navigator.getMedia({
      audio: true,
      video: true
    }, this.onGetMediaSuccess, this.onGetMediaError);
  },
  stopGetMedia: function() {
    //get(0) gets the dom element from the jquery selector
    $("#local-stream").get(0).pause();
    $("#local-stream").attr("src", null);
  },
  sendMail: function(mail_sett){
    if( mail_sett.from && mail_sett.to && mail_sett.subject && mail_sett.text && mail_sett.html )
      SignalingChannel.send({ subject: 'mail', chatroomHash: WebRTC.users[0].roomHash, userHash: WebRTC.users[0].id, mail: { from: mail_sett.from, to: mail_sett.to, subject: mail_sett.subject, text: mail_sett.text, html: mail_sett.html } })
  },
  muteAudio: function() {
    console.log('LocalMedia: Your video should be hidden for you and others');
  },
  hideVideo: function(){
    console.log('LocalMedia: Your audio should be muted for others');
  }
});
