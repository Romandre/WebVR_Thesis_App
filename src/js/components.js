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
    ball.object3D.position.set(0, 3, -1.76);
    setTimeout( function() {
      ball.body.applyImpulse(
        new CANNON.Vec3(getRandomNum(), 0, getRandomNum()),
        new CANNON.Vec3()
      );
    }, 100);
    
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
    var fired = false;
    /* If space is tapped */
    window.addEventListener("keydown", (e) => {
      if (e.keyCode == 32 && ballIsUp) {
        ++countKeyHold;
        //console.log("Consecutive keyDown events: " + countKeyHold*1.3); 
        if(!fired) {
          fired = true;
          circle.set(0);
          circle.animate(1);
        }
      }
    });
    /* If space is released */
    window.addEventListener("keyup", (e) => {
      circle.stop();
      setTimeout(function() {
        circle.animate(0);
      }, 200);
      fired = false;

      if (e.keyCode == 32 && ballIsUp) {
        keepBallAttached = false;

        if (countKeyHold > 22) {
          countKeyHold = 22;
        }
        var power = countKeyHold*1.3;
        throwBall(ball, cameraPos, cameraRot, power);
        
        countKeyHold = 0;
        ballIsUp = false;
      } 
    });

    /** Drop the ball event **/
    window.addEventListener("keyup", (e) => {
      /* If "e" key is tapped */
      if (e.keyCode == 69 && ballIsUp) {
        keepBallAttached = false;
        ballIsUp = false;
        ball.setAttribute('dynamic-body', '');
      }
    });

    /** Reset the ball to original position **/
    window.addEventListener("keyup", (e) => {
      /* If "e" key is tapped */
      if (e.keyCode == 82) {
        keepBallAttached = false;
        ballIsUp = false;
        ball.removeAttribute('dynamic-body');
        ball.object3D.position.set(0, 3, -1.76);
        ball.setAttribute('dynamic-body', '');
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
      var camera = document.querySelector('#camera').object3D;
      var cameraPos = camera.position;
      var cameraRot = camera.rotation;
      pickUpBall(ball, cameraPos, cameraRot, time, timeDelta);  
    }
  }
});


function getRandomNum() {
  var negOrPos = Math.random() < 0.5 ? -1 : 1;
  return (Math.random() * (1.5 - 1) + 1) * negOrPos;
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