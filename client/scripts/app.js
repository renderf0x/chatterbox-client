var fetchMessages = function(){
  var params = '';
  if(!roomNames['home']){
    params = 'where={"roomname":"peter"}';
  }

  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: 'order=-createdAt;limit=20' + params,
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
  'roomname': 'peterRoom'
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

var displayRooms = function(){
  $('.rooms').empty();
  for (key in roomNames){
    $('.rooms').append('<li role="presentation" class="roomName" id="' + key + '"><a href="#">' + key + '</a></div>');
  }
  $('.roomName').click(function(){
    console.log('meow');
    setActiveRoom($(this).text());
  });
}

var setActiveRoom = function(room){
  $('li.active').toggleClass('active');
  for (key in roomNames){
    if(key === room){
      // console.log("setting " + key + "to true");
      roomNames[key] = true;
    }else{
      // console.log("setting " + key + "to false");
      roomNames[key] = false;
    }
  }
  $('#'+room).toggleClass('active');
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

var displayMessage = function(message){
  if(message.username && sanityCheck(message.text) && sanityCheck(message.username)){
    $(".messages").append('<div class="message">'+escapeText(message.username) + " : " + escapeText(message.text) + '-' + message.roomname + '</div>' );
    //console.log("Message Text: " + message.text);
  }
}

$(document).ready(function(){
  $(".sendPost").click(function(){
  postMessage();
});

  fetchMessages();
});
