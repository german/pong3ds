var reset_keyboard_bindings = function(){
  jQuery(window).unbind('keydown');
  jQuery(window).unbind('keyup');
  clearInterval(ball_movement_timer);
  clearInterval(bg_timer);
  ball_movement_timer = null;
  bg_timer = null;
}

var set_keyboard_bindings_for = function(shape){ 
  // using here workaround with 38,40 pseudo-ASCII codes (button-up/button-down) to move the shape
  // these buttons generate only onkeydown/onkeyup events (which occur only once) so user should
  // push the button many times in order to constantly move it (one step at a time - really SLOW)
  // the keypressed event (which could handle continiously pressed buttons) doesn't react on special buttons
  // so I'd rather just start a timer with shape.move() function on 'onkeydown' event and clear it on 'onkeyup'
  // (explanation about a mess with keypress/up/down events could be found here: http://unixpapa.com/js/key.html)

  jQuery(window).keydown(function(e) {
    /*if ( e.keyCode == 38 && shape_movement_timer == null) {
      shape_movement_timer = setInterval(function() {
        if(shape.can_move({to: 'top'})) {
          shape.move({to: 'top'});
          redraw_all();
        }
      }, TICK_INTERVAL);
    } else if ( e.keyCode == 40 && shape_movement_timer == null) {
      shape_movement_timer = setInterval(function() {
        if(shape.can_move({to: 'bottom'})) {
          shape.move({to: 'bottom'});
          redraw_all();
        }
      }, TICK_INTERVAL);
    } else 
    */
    if (e.keyCode == 32) { // if spacebar pressed - begin round
      if(current_player_id == player_id_having_the_ball && round_could_be_started) {
        start_round();
        var ball_position = ball.position;
        socket.json.emit('round_started', {room_id: window.room_id, ball_x: ball_position.x, ball_y: ball_position.y, ball_z: ball_position.z});
      }
    }
  });

  /*jQuery(window).keyup(function(e) {
    if ( e.keyCode == 38 && shape_movement_timer != null) {
      clearInterval(shape_movement_timer);
      shape_movement_timer = null;
    } else if ( e.keyCode == 40 && shape_movement_timer != null) {
      clearInterval(shape_movement_timer);
      shape_movement_timer = null;
    }
  });*/
}
