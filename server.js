require.paths.unshift(__dirname + '/npm/policyfile');
require.paths.unshift(__dirname + '/npm/socket_node/lib');
require.paths.unshift(__dirname + '/npm/socket_node_client/lib');

var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , sys = require('sys')
  , number_of_rooms = 10
  , rooms = {};

var io = require('socket.io').listen(8080);

for(var i = 0; i < number_of_rooms; i++) {
  rooms[i] = 0; //new room_module.Room();
}

function get_list_of_rooms() {
  var list_of_rooms = {type: 'list_of_rooms', number_of_rooms: number_of_rooms, rooms: []}
  for(var i = 0; i < number_of_rooms; i++) {
    list_of_rooms['rooms'].push({number_of_connected_players: rooms[i] })
  }
  return list_of_rooms;
}

io.sockets.on('connection', function (socket) {
  socket.emit('list_of_rooms', get_list_of_rooms());  
  
  socket.on('disconnect', function () {
    console.log('socket leaved - ' + socket.room_id)
    rooms[socket.room_id] -= 1;
    socket.leave('room#'+socket.room_id);
  });
  
  socket.on('sync', function(msg) {
    console.log('msg.room_id - ' + msg.room_id);
    io.sockets.in('room#'+msg.room_id).volatile.emit('sync', msg);
    //io.sockets.in('room#'+msg.room_id).emit('sync', msg);
  });
  
  socket.on('connect', function(msg) {
    console.log(msg.room_id);
    socket.join('room#' + msg.room_id);
    socket.room_id = msg.room_id;
    rooms[msg.room_id] += 1;
    // check whether this connected user was not connected to the other room on the same server


    if(rooms[msg.room_id] == 1) {
      //selected_room.first_player_connect();
      socket.json.emit('player_connected', {player_id: 1});
    } else if(rooms[msg.room_id] == 2){
      //selected_room.second_player_connect();

      // when second player has connected, 1st player could had moved up or down his default position, so show him right cordinates in buffer variable
      socket.json.emit('player_connected', {player_id: 2 }); // buffer: buffer 

      //client.broadcast({ type: 'round_could_be_started', room_id: message.room_id});
      io.sockets.in('room#'+msg.room_id).emit('round_could_be_started');
    }
    
    /*for(var i = 0; i < number_of_rooms; i++) {
      rooms[i].debug_session_ids();
    }*/
    
    var list_of_rooms = get_list_of_rooms();
    //client.send(list_of_rooms);
    //client.broadcast(list_of_rooms);
    socket.broadcast.json.emit(list_of_rooms);
  })
});
