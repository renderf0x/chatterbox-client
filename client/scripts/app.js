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

      //console.log(JSON.stringify(data.results));
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to load messages');
    }
  });
}

setInterval(fetchMessages, 3000);

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
};


var roomNames = {
  home: true
};

/* ROOMS *************************************/

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

/* MESSAGES *********************************/

var displayMessages = function(messages){
  $(".messages").empty();
  _.each(messages, function(message){
    displayMessage(message);
    populateRooms(message);
  });
}

var escapeText = function(text){
  return validator.escape(text);
}

var sanityCheck = function(text){
  var regObj = new RegExp(/[\W]/i);
  return !regObj.test(text);
};
//debugger;
console.log
var source   = $(".messageTemplate").html();
var messageTemplate = Handlebars.compile(source);

var displayMessage = function(message){
  if(message.username && sanityCheck(message.text) && sanityCheck(message.username)){
    $(".messages").append(messageTemplate(message));
    //console.log("Message Text: " + message.text);
  }
}

$(document).ready(function(){
  $(".sendPost").click(function(){
  postMessage();
});

  fetchMessages();
});
