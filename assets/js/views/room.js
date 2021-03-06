﻿App.RoomView = Ember.View.extend({
  templateName: 'room',
  classNames: ['room-wrapper'],
  sidebar: false,
  showSidebar: function() {
    window.App.Controller.room.stopAnimation();
    if (this.sidebar === false) {
      $('#scrollbar_fix').css('width', '310px');
      $('#social_sidebar_container').animate({
        right: '0px'
      }, {
        duration: 250,
        queue: false
      });
      $('#hangupButton').animate({
        marginRight: '300px'
      }, {
        duration: 250,
        queue: false
      });
      $('#show_sidebar').removeClass('sidebar_close').addClass('sidebar_open');
      $('#show_sidebar_shadow').hide();

      $('#show_sidebar').mouseover(function() {
        $('#show_sidebar').css('opacity', '1')
      });
      $('#show_sidebar').mouseout(function() {
        $('#show_sidebar').css('opacity', '0.3')
      });
      this.sidebar = true;
    } else {
      $('#social_sidebar_container').animate({
        right: '-300px'
      }, {
        duration: 250,
        queue: false
      });
      $('#hangupButton').animate({
        marginRight: '0px'
      }, {
        duration: 250,
        queue: false
      });
      $('#scrollbar_fix').animate({
        width: '45px'
      }, {
        duration: 250,
        queue: false
      });
      $('#show_sidebar').removeClass('sidebar_open').addClass('sidebar_close');
      $('#show_sidebar_shadow').show();

      $('#show_sidebar').mouseout(function() {
        $('#show_sidebar').css('opacity', '1')
      });
      this.sidebar = false;
    }
  },
  openHelp: function() {
    $('#help').fadeIn('fast');
  },
  closeHelp: function() {
    $('#help').fadeOut('fast');
  },
  didInsertElement: function() {
    if (Users.getLocalUser().name === "Phovec-Benutzer" || Users.getLocalUser().name === undefined) {
      $('#nameArea').show();
      $('#nameArea input').focus();
    }

    window.App.Controller.room.addRemoteUsers();

    document.addEventListener("keydown", function(event) {
      if (event.which === 27 && $('#help').is(":visible")) {
        $('#help').fadeOut('fast');
      }
    }, false);
  },
  toggleFullscreen: function() {
    var documentElement = document.getElementsByTagName("body")[0];
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {// current working methods
      if (documentElement.requestFullscreen) {
        documentElement.requestFullscreen();
      } else if (documentElement.mozRequestFullScreen) {
        documentElement.mozRequestFullScreen();
      } else if (documentElement.webkitRequestFullscreen) {
        documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      document.getElementById("buttonFullscreen").style.backgroundImage = "url('assets/img/fullscreen_exit.png')";
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
      document.getElementById("buttonFullscreen").style.backgroundImage = "url('assets/img/fullscreen_start.png')";
    }
  },
  toggleSpeechOrder: function() {

    if (App.Controller.room.isSpeechRecognizerStarted) {

      $('#speechButton').css('background', 'url(assets/img/micro_recorder_off.png)').css('background-repeat', 'no-repeat').css('background-size', '45%').css('background-position', '15px 13px');
      $('.userNumber').hide();
      App.Controller.room.speechRecognizer.stop();

    } else {

      $('#speechButton').css('background', 'url(assets/img/micro_recorder_on.png)').css('background-repeat', 'no-repeat').css('background-size', '45%').css('background-position', '15px 13px');
      $('.userNumber').show();

      if (!this.isSpeechRecognizerInitalized) {
        App.Controller.room.initializeSpeechRecognizer();
      }

      App.Controller.room.handleGeneralSpeechOrders();
    }
  },
  keyUp: function(event) {
    if (event.target === document.querySelector("#nameArea #startName")) {
      var element = document.querySelector("#nameArea #startButtonImage");
      if (document.querySelector("#nameArea #startName").value.length >= 3) {
        element.onmouseover = function() {
          this.style.opacity = 0.8;
        };
        element.onmouseout = function() {
          this.style.opacity = 1;
        };
        element.onclick = function() {
          var name = document.querySelector("#nameArea #startName").value;
          var localUser = Users.getLocalUser();
          localUser.name = name;

          if (Users.initLocalUser === false) {
            Users.initLocalUser = true;
            SignalingChannel.send({
              subject: "init:user",
              userHash: localUser.id,
              roomHash: localUser.roomHash,
              put: {
                name: localUser.name,
              }
            });
          } else if (Users.initLocalUser === true) {// user wants to rename their name
            App.Controller.room.sendParticipantEditMsg();
          }

          document.querySelector(".user.local .userName").innerText = name;
          document.getElementById("nameArea").style.display = "none";
        };
        element.style.backgroundPositionX = "-352px";
      } else {
        element.onmouseover = null;
        element.onmouseout = null;
        element.onclick = null;
        element.style.backgroundPositionX = "0px";
      }
    }
  },
  keyDown: function(event) {
    if (event.target === document.getElementById("startName")) {
      if (document.getElementById("startName").value.length >= 15) {
        document.getElementById("startName").value = App.shortenString(document.getElementById("name").value, 15);
      }

      if (event.which === 13) {
        document.getElementById("startButtonImage").click();
      }
    }
  }
});
