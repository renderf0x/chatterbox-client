/* GLOBALS *************************************/
/* rooms and friends */
var roomNames = {
  home: true
};

var friends = {};

/* main Handlebars templates - compiled below*/
var messageTemplate;
var friendTemplate;
var friendMessageTemplate;

/* setup click and event handlers, and compile templates*/
/* in document.ready so it will wait for page load*/
$(document).ready(function(){

  /*post buttom*/
  $(".sendPost").click(function(){
  postMessage();
  });

  /*send on enter*/
  $('input').keypress(function (e) {
      if (e.which == '13') {
        postMessage();
      }
  });

  /*create room [+] button*/
  $('.createRoom').click(function(){
    createRoom();
  })

  /*initial call to fetch messages*/
  fetchMessages();

  /*handlebars template compilation*/
  var source   = $(".messageTemplate").html();
  messageTemplate = Handlebars.compile(source);

  var friendMessageSrc = $(".friendMessageTemplate").html();
  friendMessageTemplate = Handlebars.compile(friendMessageSrc);

  var friendsSource = $("#friendTemplate").html();
  friendTemplate = Handlebars.compile(friendsSource);

  /* set recurring fetch time*/
  setInterval(fetchMessages, 3000);

});



/* FRIENDS ***********************************/
/* adds to global object friends, where name is key and*/
/* initial state is false*/

var addFriend = function(name){
  friends[name] = true;
  displayFriendsList();
}

var displayFriendsList = function(){
  $('.friendslist').empty();
  var friendsArray = Object.keys(friends);
  $('.friendslist').append(friendTemplate(friendsArray));
}

var setUserLinks = function(){
  $('.userLink').click(function(){
      var name = $(this).text();
      console.log('FRIENDDDDD: ' + $(this).text());
      addFriend(name);
    })
}


/* ROOMS *************************************/
/* adds to global object roomNames, where name is key and*/
/* initial state is false*/

var populateRooms = function(message){
  if(message.roomname && roomNames[message.roomname] === undefined && sanityCheck(message.roomname)){
    roomNames[message.roomname] = false;
    // console.log(JSON.stringify(roomNames));
  }
}
//$('.active').roomname === key
var displayRooms = function(){
  var activeRoom = $('.active').attr('id')
  console.log('ACTIVE ROOM: ' + activeRoom);
  $('.rooms').empty();
  for (key in roomNames){
    $('.rooms').append('<li role="presentation" class="roomName" id="' + key + '"><a href="#">' + key + '</a></div>');
    if(key === activeRoom){
      $('#' + activeRoom).addClass('active');
    }
  }

  $('.roomName').click(function(){
    //console.log('meow');
    setActiveRoom($(this).text());
    fetchMessages();
  });
}

var setActiveRoom = function(room){
  //$('li.active').removeClass('active');
  if(room === undefined){

  }
  for (key in roomNames){
    if(key === room){
      //console.log("setting " + key + "to true");
      roomNames[key] = true;
      var id = '#'+room;
      $(id).addClass('active');
    }else{
      //console.log("setting " + key + "to false");
      roomNames[key] = false;
      var id = '#'+key;
      console.log($(id));
      $(id).removeClass('active');
    }
  }
  //$('#'+room).addClass('active');
}

var createRoom = function(){
  var newRoom = prompt("Please choose a room name");
  roomNames[newRoom] = false;
  displayRooms();
  setActiveRoom(newRoom);
}

/* MESSAGES *********************************/

var fetchMessages = function(){
  var params = '';
  console.log(JSON.stringify(roomNames));
  if(!roomNames['home']){
    for(key in roomNames){
      if(roomNames[key]){
        params = 'where={"roomname":"'+key+'"}';
      }
    }
  }
  console.log(params);
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: 'order=-createdAt;limit=20;' + params,
    contentType: 'application/json',
    success: function (data) {
      displayMessages(data.results);
      displayRooms();
      setUserLinks();

      //console.log(JSON.stringify(data.results));
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to load messages');
    }
  });
}

var displayMessages = function(messages){
  $(".messages").empty();
  _.each(messages, function(message){
    displayMessage(message);
    populateRooms(message);
  });
}

var displayMessage = function(message){
  if(message.username && sanityCheck(message.text) && sanityCheck(message.username)){
    //console.log("Username string: " + message.username + ", friend:" + friends[message.username]);
    if(friends[message.username] !== undefined){
      //console.log("calling friend-specific template");
      $(".messages").append(friendMessageTemplate(message));
    }else{
      $(".messages").append(messageTemplate(message));
    //console.log("Message Text: " + message.text);
    }
  }
}

var postMessage = function(){
  var postContent = $("input").val();
  var message = {
  'username': 'peter',
  'text': postContent,
  'roomname': $('li.active').text()
  };


  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('success!')
    fetchMessages();
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to load messages');
    }
  });

  $('input').val("");
};
/* MESSAGE HELPERS **************************/

var escapeText = function(text){
  return validator.escape(text);
}

var sanityCheck = function(text){
  var regObj = new RegExp(/[\w\s]/i);
  return regObj.test(text);
};

