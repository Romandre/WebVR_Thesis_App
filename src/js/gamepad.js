
window.addEventListener("gamepadconnected", function(e) {
  var gp = navigator.getGamepads()[e.gamepad.index];
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
  gp.index, gp.id,
  gp.buttons.length, gp.axes.length);

  if (gp.mapping == "standard") {
    console.log("Controller has standard mapping");
  } else {
    console.log("Controller does not have standard mapping");
  }
});

var gamepads = {};

window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);

function gamepadHandler(event, connecting) {
  var gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connecting) {
    gamepads[gamepad.index] = gamepad;
    console.log(gamepads[gamepad.index]);
  } else {
    delete gamepads[gamepad.index];
  }
}


/** Testing gamepad button press events **/
window.addEventListener("gamepadbuttondown", function(evt) { controllerButtonEvent(evt, true); } );
window.addEventListener("gamepadbuttonup", function(evt) { controllerButtonEvent(evt, false); } );

var gamepadActive = false,
    dualshock4Buttons = new Array();
 
dualshock4Buttons[0]  = 'cross',
dualshock4Buttons[1]  = 'circle',
dualshock4Buttons[2]  = 'square',
dualshock4Buttons[3]  = 'triangle',
dualshock4Buttons[4]   = 'L1',
dualshock4Buttons[5]   = 'R1',
dualshock4Buttons[6]   = 'L2',
dualshock4Buttons[7]   = 'R2',
dualshock4Buttons[8]   = 'share',
dualshock4Buttons[9]   = 'options',
dualshock4Buttons[10]  = 'L3',
dualshock4Buttons[11]  = 'R3',
dualshock4Buttons[12]   = 'up',
dualshock4Buttons[13]   = 'down'
dualshock4Buttons[14]   = 'left',
dualshock4Buttons[15]   = 'right',
dualshock4Buttons[16]  = 'R2',
dualshock4Buttons[16]  = 'PS';
dualshock4Buttons[17]  = 'touch bar'

function controllerButtonEvent(evt, pressed)
{
  var gamepad = event.gamepad;

  if (pressed) {
    console.log(dualshock4Buttons[evt.detail.index] + ' was pressed');
  } else {
    console.log(dualshock4Buttons[evt.detail.index] + ' was released');
  }
}