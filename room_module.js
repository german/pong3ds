// in order to make more people play the game simultaneously they should be divided into "rooms"
// for pong game the number of people in the "room" == 2

exports.Room = function() {
  var first_player_connected = false
  , second_player_connected = false
  , round_started = false /* we should maintain this*/
  , player_id_having_the_ball = 1 /* */
  , number_of_connected_players = 0
  , session_ids = {player1: null, player2: null}
  ;

  this.debug_session_ids = function() {
    if(console.log) {
      console.log('player1 - ' + session_ids['player1'] + '; player2 - ' + session_ids['player2'])
    }
  }

  this.is_first_player_connected = function() {
    return first_player_connected;
  }

  this.first_player_connect = function(session_id) {
    first_player_connected = true;
    number_of_connected_players++;
    session_ids['player1'] = session_id;
  }

  this.first_player_disconnect = function() {
    first_player_connected = false;
    session_ids['player1'] = null;
  }

  this.second_player_connect = function(session_id) {
    second_player_connected = true;
    number_of_connected_players++;
    session_ids['player2'] = session_id;
  }

  this.second_player_disconnect = function() {
    second_player_connected = false;
    session_ids['player2'] = null;
  }

  this.disconnect = function(session_id) {
    if(session_ids['player1'] == session_id) {
      this.first_player_disconnect();
      number_of_connected_players--;
      return true;
    } else if(session_ids['player2'] == session_id) {
      this.second_player_disconnect();
      number_of_connected_players--;
      return true;
    }
    return false;
  }

  this.is_empty = function() {
    return !first_player_connected;
  }

  this.is_full = function() {
    return second_player_connected;
  }

  this.get_number_of_connected_players = function() {
    return number_of_connected_players;
  }

  this.is_round_started = function() {
    return round_started;
  }

  this.set_round_started = function(value) {
    round_started = value;
  }
}
