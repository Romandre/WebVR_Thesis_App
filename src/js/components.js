var ballIsUp = false;
var keepBallAttached = false;

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
AFRAME.registerComponent('#camera', {
	init: function (oldData) {
		el = this.el.object3D;
	    el.visible = this.data;
  	}
});


 /**************************\
|* Register ball component *|
 \**************************/
AFRAME.registerComponent('ball-events', {
  init: function () {
    ball = this.el;
    ball.object3D.position.set(0, 0.01, -1.76);

    var camera, cameraPos, cameraRot;
    camera = document.querySelector('#camera').object3D;

    /** Pick up the ball event **/
    ball.addEventListener('mousedown', function (evt) {  
      if (!ballIsUp) {
        cameraPos = camera.position;
        cameraRot = camera.rotation;
        interPoint = evt.detail.intersection.point;
        console.log('You clicked at: ', interPoint);

        // Calculate distance between camera and the ball
        var dx = cameraPos.x - ball.object3D.position.x; 
        var dy = cameraPos.y - ball.object3D.position.y; 
        var dz = cameraPos.z - ball.object3D.position.z; 
        var distance = dx*dx+dy*dy+dz*dz;

        if (distance < 4) {
          pickUpBall(ball, cameraPos, cameraRot, null, null); 
          keepBallAttached = true;
          ballIsUp = true;
        }
      }  
    });
      
    /** Throw the ball event **/
    var countKeyHold = 0;
    window.addEventListener("keydown", (e) => {
      if (e.keyCode == 32 && ballIsUp) {
        ++countKeyHold;
        console.log("Consecutive keyDown events: " + countKeyHold*1.8);
      }
    });
    window.addEventListener("keyup", (e) => {
      /* If space is tapped */
      if (e.keyCode == 32 && ballIsUp) {
        keepBallAttached = false;
        ball.setAttribute('dynamic-body', '');

        if (countKeyHold >= 28) {
          countKeyHold = 28;
        }
        var power = countKeyHold*1.8;
        countKeyHold = 0;
        throwBall(ball, cameraPos, cameraRot, power);

        ballIsUp = false;
      }
    });

    /** Drop the ball event **/
    window.addEventListener("keyup", (e) => {
      /* If "e" key is tapped */
      if (e.keyCode == 69 && ballIsUp) {
        keepBallAttached = false;
        ball.setAttribute('dynamic-body', '');
        cameraPos = camera.position;
        cameraRot = camera.rotation;
        ballIsUp = false;
      }
    });
  },

  /** Update ball on each tick or frame of the scene’s render loop **/
  tock: function(time, timeDelta, evt) {
    if (keepBallAttached == true) {
      var camera = document.querySelector('#camera').object3D;
      var cameraPos = camera.position;
      var cameraRot = camera.rotation;
      pickUpBall(ball, cameraPos, cameraRot, time, timeDelta);  
    }
  }
});