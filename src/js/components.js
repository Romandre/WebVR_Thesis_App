/****************************\
|* Register scene component *|
\****************************/
AFRAME.registerComponent('#field', {
  init: function (oldData) {
    el = this.el.object3D;
    el.visible = this.data;
  }
});


/*****************************\
|* Register camera component *|
\*****************************/
AFRAME.registerComponent('#player', {
  init: function (oldData) {
    player = this.el.object3D;
    el.visible = this.data;
  }
});


/*****************************\
|* Register camera component *|
\*****************************/
AFRAME.registerComponent('#camera', {
	init: function (oldData) {
		camera = this.el.object3D;
    el.visible = this.data;
	}
});


/***************************\
|* Register ball component *|
\***************************/
var ballIsUp = false;
var keepBallAttached = false;
var countKeyHold = 0;
var fired = false;

/* Ball resistance to movement */
var linDamp = 0.1;

/* Ball resistance to rotation */
var angDamp = 0.4;

AFRAME.registerComponent('ball-events', {
  init: function () {
    var player, camera, playerPos, playerRot, interPoint, time;

    /* Init ball */
    ball = this.el;
    ball.object3D.position.set(0, 3, -1.76);
    setTimeout( function() {
      ball.body.applyImpulse(
        new CANNON.Vec3(getRandomNum(), 0, getRandomNum()),
        new CANNON.Vec3()
      );
    }, 100);


    /*** Ball actions registration ***/
    player = document.querySelector('#player').object3D,
    camera = document.querySelector('#camera').object3D;

    /* Pick up the ball on X PS4 controller button press */
    window.addEventListener('gamepadbuttondown', function (evt) {
      if(evt.detail.index == 0 && takeBallHandler(evt, ball, player, camera)) {
        keepBallAttached = true;
        ballIsUp = true;
      }
    });
    /* Pick up the ball on mouse click */
    window.addEventListener('mousedown', function (evt) {  
      if(takeBallHandler(evt, ball, player, camera)) {
        keepBallAttached = true;
        ballIsUp = true;
      }
    });

      
    /** Start count power on key or button hold **/
    function countPower(type) {
      if (!fired) {
        fired = true;
        time = new Date().getTime() / 100;
        startPowerbar();
      }
    }

    window.addEventListener('gamepadbuttondown', function (evt) {
      /* on ⬜ button press */
      if (evt.detail.index == 2 && ballIsUp) {
        countPower('gamepad'); 
      }
    });

    window.addEventListener("keydown", (e) => {
     /* on space bar keydown */
      if (e.keyCode == 32 && ballIsUp) {
        countPower('mouse');
      }
    });

    
    /** Throw/drop/reset the ball events **/
    function resetVars(state) {
      keepBallAttached = false;
      ballIsUp = false;
      fired = false;
    }

    function throwEvent(type) {
      playerPos = player.position;
      playerRot = camera.rotation;
      stopPowerbar();
      resetVars('onThrow');
      
      var power = (new Date().getTime() / 100 - time) * 1.35;
      //console.log(power);

      if (power > 22) {
        power = 22;
      }
      
      throwBall(ball, playerPos, playerRot, power, linDamp, angDamp);
    }

    window.addEventListener('gamepadbuttonup', function (evt) {
      /* Throw if ⬜ button released */
      if(evt.detail.index == 2 && ballIsUp) {
        throwEvent();
      }

      /* Drop if ⭕ button is pressed */
      if (evt.detail.index == 1 && ballIsUp) {
        stopPowerbar();
        resetVars();  
        setDynamicBody(ball, linDamp, angDamp);
      }

      /* Reset the ball to original position if △ button is pressed */
      if (evt.detail.index == 3) {
        stopPowerbar();
        resetVars();
        ball.removeAttribute('dynamic-body');
        ball.object3D.position.set(0, 3, -1.76);
        setDynamicBody(ball, linDamp, angDamp);
        ball.body.applyImpulse(
          new CANNON.Vec3(getRandomNum(), 0, getRandomNum()),
          new CANNON.Vec3()
        );
      }
    });

    window.addEventListener("keyup", (e) => {
      /* Throw if space bar is released */
      if (e.keyCode == 32 && ballIsUp) {
        throwEvent();
      } 

      /* Drop if "E" key is tapped */
      if (e.keyCode == 69 && ballIsUp) {
        stopPowerbar();
        resetVars();  
        setDynamicBody(ball, linDamp, angDamp);
      }

      /* Reset the ball to original position if "R" key is tapped */
      if (e.keyCode == 82) {
        stopPowerbar();
        resetVars();
        ball.removeAttribute('dynamic-body');
        ball.object3D.position.set(0, 3, -1.76);
        setDynamicBody(ball, linDamp, angDamp);
        ball.body.applyImpulse(
          new CANNON.Vec3(getRandomNum(), 0, getRandomNum()),
          new CANNON.Vec3()
        );
      }
    });
  },

  /*** Update ball on each tick or frame of the scene’s render loop ***/
  tock: function(time, timeDelta, evt) {
    if (keepBallAttached == true) {
      var camera = document.querySelector('#camera').object3D,
          player = document.querySelector('#player').object3D,
          playerPos = player.position,
          playerRot = camera.rotation;
      attachBall(ball, playerPos, playerRot, time, timeDelta);  
    }
  }
});


function getRandomNum() {
  var randomImpuls = Math.random() < 0.5 ? - 1 : 1;
  return (Math.random() * (1.5 - 1) + 1) * randomImpuls;
}


/** Testing assets and loading detection 

AFRAME.registerComponent('#loader', {
  init: function (oldData) {
      el = this.el;
      el.visible = this.data;

      el.addEventListener('loaded', function () {
        console.log("OK LOADED");
      });
    }
});

AFRAME.registerComponent('log', {
  schema: {type: 'string'},
  init: function () {
    var stringToLog = this.data;
    console.log(stringToLog);
  }
});

**/