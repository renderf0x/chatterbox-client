$.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'GET',
  //data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    displayMessages(data.results);
    displayRooms();
    //console.log(JSON.stringify(data));
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to load messages');
  }
});

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
    console.log('success!');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to load messages');
    }
  });
};


var roomNames = {};

/* ROOMS *************************************/

var populateRooms = function(message){
  if(message.roomname && roomNames[message.roomname] === undefined){
    roomNames[message.roomname] = message.roomname;
  }
}

var displayRooms = function(){
  for (key in roomNames){
    $('.rooms').append('<li role="presentation" class="roomName"><a href="#">' + roomNames[key] + '</a></div>');
  }
}

/* MESSAGES *********************************/

var displayMessages = function(messages){
  _.each(messages, function(message){
    displayMessage(message);
    populateRooms(message);
  });
}

var escapeText = function(text){
  return validator.escape(text);
}

var displayMessage = function(message){
  //if(message.username){
    $(".messages").append('<div class="message">'+escapeText(message.username) + " : " + escapeText(message.text) + '</div>' );
  //}
}

$(document).ready(function(){
  $(".sendPost").click(function(){
  console.log('foo');
  postMessage()});
})
