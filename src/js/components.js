var ballIsUp = false;
var keepBallAttached = false;
var countKeyHold = 0;
var fired = false;

/* Ball resistance to movement */
var linDamp = 0.1;

/* Ball resistance to rotation */
var angDamp = 0.4;


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
AFRAME.registerComponent('ball-events', {
  init: function () {
    var player, camera, playerPos, playerRot, interPoint;

    /* Init ball */
    ball = this.el;
    ball.object3D.position.set(0, 3, -1.76);
    setTimeout( function() {
      ball.body.applyImpulse(
        new CANNON.Vec3(getRandomNum(), 0, getRandomNum()),
        new CANNON.Vec3()
      );
    }, 100);


    /** Ball actions registration **/
    player = document.querySelector('#player').object3D,
    camera = document.querySelector('#camera').object3D;

    /* Pick up the ball event on mouse click */
    ball.addEventListener('mousedown', function (evt) {  
      if (!ballIsUp) {
        playerPos = player.position;
        playerRot = camera.rotation;
        interPoint = evt.detail.intersection.point;
        console.log('You clicked at: ', interPoint);
        console.log(evt.target.id);

        // Calculate distance between camera and the ball
        var dx = playerPos.x - ball.object3D.position.x; 
        var dy = playerPos.y - ball.object3D.position.y; 
        var dz = playerPos.z - ball.object3D.position.z; 
        var distance = dx*dx+dy*dy+dz*dz;
        console.log('Distance: ', distance);

        if (distance < 4) {
          console.log('Ball picked up!');
          takeBall(ball, playerPos, playerRot, null, null); 
          keepBallAttached = true;
          ballIsUp = true;
        }
      }  
    });
      
    /* Start count power time on space bar keydown */
    window.addEventListener("keydown", (e) => {
      if (e.keyCode == 32 && ballIsUp) {
        ++countKeyHold;
        //console.log("Consecutive keyDown events: " + countKeyHold*1.3); 
        if(!fired) {
          fired = true;
          startPowerbar();
        }
      }
    });
    
    /** Throw/drop/reset the ball event **/
    window.addEventListener("keyup", (e) => {
      /* Throw if space bar is released */
      if (e.keyCode == 32 && ballIsUp) {
        stopPowerbar();
        keepBallAttached = false;

        if (countKeyHold > 22) {
          countKeyHold = 22;
        }
        var power = countKeyHold*1.3;
        throwBall(ball, playerPos, playerRot, power, linDamp, angDamp);
        
        ballIsUp = false;
        fired = false;
        countKeyHold = 0;       
      } 

      /* Drop if "E" key is tapped */
      if (e.keyCode == 69 && ballIsUp) {
        stopPowerbar();
        keepBallAttached = false;
        ballIsUp = false;
        fired = false;
        countKeyHold = 0;  
        setDynamicBody(ball, linDamp, angDamp);
      }

      /* Reset the ball to original position if "R" key is tapped */
      if (e.keyCode == 82) {
        stopPowerbar();
        keepBallAttached = false;
        ballIsUp = false;
        fired = false;
        countKeyHold = 0;  
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

  /** Update ball on each tick or frame of the scene’s render loop **/
  tock: function(time, timeDelta, evt) {
    if (keepBallAttached == true) {
      var camera = document.querySelector('#camera').object3D,
          player = document.querySelector('#player').object3D,
          playerPos = player.position,
          playerRot = camera.rotation;
      takeBall(ball, playerPos, playerRot, time, timeDelta);  
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