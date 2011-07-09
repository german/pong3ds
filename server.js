require.paths.unshift(__dirname + '/npm/policyfile');
require.paths.unshift(__dirname + '/npm/socket_node/lib');
require.paths.unshift(__dirname + '/npm/socket_node_client/lib');

var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , sys = require('sys')
  //, server
  , room_module = require('./room_module')
  , number_of_rooms = 10
  , rooms = [];

var io = require('socket.io').listen(8080);

for(var i = 0; i < number_of_rooms; i++) {
  rooms[i] = new room_module.Room();
}

function get_list_of_rooms() {
  var list_of_rooms = {type: 'list_of_rooms', number_of_rooms: number_of_rooms, rooms: []}
  for(var i = 0; i < number_of_rooms; i++) {
    list_of_rooms['rooms'].push({number_of_connected_players: rooms[i].get_number_of_connected_players() })
  }
  return list_of_rooms;
}

// number_of_rooms - global integer
// rooms - global array
function find_room_and_disconnect_by_session_id(session_id) {
  var room_id_with_disconnected_player = null;
  for(var i = 0; i < number_of_rooms; i++) {
    var room = rooms[i];
    if(!room.is_empty()) {
      if(room.disconnect(session_id)) {
        room_id_with_disconnected_player = i;
        break;
      }
    }
  }
  return room_id_with_disconnected_player;
}
//var file = new(static.Server)('./public');

//server = http.createServer(function(req, res){
  //// all static files are served with https://github.com/cloudhead/node-static
  ////req.addListener('end', function () {
  ////  file.serve(req, res);
  ////});
//});

//server.listen(8081);

//var io = io.listen(server);

/*io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

redis_client.on("message", function (channel, message) {
  console.log("channel " + channel + ": " + message);
  //io.sockets.emit(channel, { channel: channel, message: message});
  io.sockets.json.send({ channel: channel, message: message});
});*/

io.sockets.on('connection', function (socket) {
  socket.emit('list_of_rooms', get_list_of_rooms());  
  //socket.join('room#');
  //socket.broadcast.to('room#').emit('new fan');
  //io.sockets.in('rammstein fans').emit('new non-fan');
});
