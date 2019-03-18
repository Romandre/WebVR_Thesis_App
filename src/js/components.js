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
		camera = this.el;
    el.visible = this.data;    
	}
});


/***************************\
|* Register ball component *|
\***************************/
var ballIsUp = false,
    keepBallAttached = false,
    countKeyHold = 0,
    fired = false,
    /* Ball resistance to movement */
    linDamp = 0.07,
    /* Ball resistance to rotation */
    angDamp = 0.28,
    /* Enable/disable statistics */
    stats = false,
    /* Basket counting */
    score = 0,
    canCount = true,
    scoreIncr = false,
    /* Gamepad controls */
    cross = 0,
    circle = 1,
    square = 2,
    triangle = 3,
    share = 8;

// Mobile chrome last versions has different gamepad buttons layout, so I use that var to detect that case  
var windowWidth = document.documentElement.clientWidth,
    isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
if (windowWidth < 992 && isChrome) {
  cross = 2;
  circle = 0;
  square = 3;
  triangle = 4;
  share = 10;
}


AFRAME.registerComponent('ball', {
  init: function () {
    var player, camera, interPoint, time;

    /* Init ball */
    ball = this.el;
    resetBall(ball, linDamp, angDamp);

    ball.addEventListener('collide', function (e) {
      bounceSound(e.detail.body.id, e.detail.target.velocity);
      //console.log('Ball has collided with body #' + e.detail.body.id + ' being ' + e.detail.body.el.id);
      //console.log('Ball velocity on collision: ' + e.detail.target.velocity);
    });

     /*********************************************************/
    /*************** Ball actions registration ***************/
    player = document.querySelector('#player').object3D;
    camera = document.querySelector('#camera').object3D;

    /* Pick up the ball on X PS4 controller button press */
    window.addEventListener('gamepadbuttondown', function (evt) {
      if(evt.detail.index == cross && takeBall(evt, ball, player, camera, ballIsUp)) {
        keepBallAttached = true;
        ballIsUp = true;
      }
    });
    /* Pick up the ball on mouse click */
    window.addEventListener('mousedown', function (evt) {  
      if(takeBall(evt, ball, player, camera, ballIsUp)) {
        keepBallAttached = true;
        ballIsUp = true;
      }
    });

     /*********************************************/    
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
      if (evt.detail.index == square && ballIsUp) {
        countPower('gamepad'); 
      }
    });

    window.addEventListener("keydown", (e) => {
     /* on space bar keydown */
      if (e.keyCode == 32 && ballIsUp) {
        countPower('mouse');
      }
    });

     /**************************************/
    /** Throw/drop/reset the ball events **/
    function resetVars(state) {
      keepBallAttached = false;
      ballIsUp = false;
      fired = false;
    }

    function throwEvent(type) {
      var power = (new Date().getTime() / 100 - time) * 1.35;
      //console.log(power);
      stopPowerbar();
      resetVars('onThrow');
      if (power > 22) {
        power = 22;
      }
      throwBall(ball, camera, power, linDamp, angDamp);
    }

    window.addEventListener('gamepadbuttonup', function (evt) {
      /** Throw if ⬜ button released **/
      if(evt.detail.index == square && ballIsUp) {
        throwEvent();
      }

      /** Drop if ⭕ button is pressed **/
      if (evt.detail.index == circle && ballIsUp) {
        stopPowerbar();
        resetVars();  
        dropBall(ball, camera, linDamp, angDamp);
      }

      /** Reset the ball to original position if △ button is pressed **/
      if (evt.detail.index == triangle) {
        stopPowerbar();
        resetVars();
        ball.removeAttribute('dynamic-body');
        resetBall(ball, linDamp, angDamp, true);
      }

       /** Show scene statistics on Share button press **/
      if (evt.detail.index == share) {
        if (!stats) {
          document.querySelector('#field').setAttribute('stats', '');
          stats = true;
        } else {
          document.querySelector('#field').removeAttribute('stats');
          stats = false;
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      /** Throw if space bar is released **/
      if (e.keyCode == 32 && ballIsUp) {
        throwEvent();
      } 

      /** Drop if "E" key is tapped **/
      if (e.keyCode == 69 && ballIsUp) {
        stopPowerbar();
        resetVars(); 
        dropBall(ball, camera, linDamp, angDamp);
      }

      /** Reset the ball to original position if "R" key is tapped **/
      if (e.keyCode == 82) {
        stopPowerbar();
        resetVars();
        ball.removeAttribute('dynamic-body');
        resetBall(ball, linDamp, angDamp, true);
      }

      /** Show scene statistics by "Q" key press **/
      if (e.keyCode == 81) {
        if (!stats) {
          document.querySelector('#field').setAttribute('stats', '');
          stats = true;
        } else {
          document.querySelector('#field').removeAttribute('stats');
          stats = false;
        }
      }
    });
  },

   /**************************************************************************/
  /****** Update ball on each tick or frame of the scene’s render loop ******/
  tick: function(time, timeDelta, evt) {
    if (keepBallAttached == true) {
      var camera = document.querySelector('#camera').object3D,
          player = document.querySelector('#player').object3D;
      attachBall(ball, player.position, camera.rotation, time, timeDelta);  
    }

    ballBB = new THREE.Box3().setFromObject(this.el.object3D);
    basket = new THREE.Box3().setFromObject(document.querySelector('#basket').object3D);
    ballDetect = new THREE.Box3().setFromObject(document.querySelector('#scoreDetect').object3D);
    var ballOnBasket = ballBB.intersectsBox(basket);
    var ballWentThrough = ballBB.intersectsBox(ballDetect);
    if (ballOnBasket) {
      scoreIncr = true;
      setTimeout(function() {
        scoreIncr = false;
      }, 1500);
    }
    if (ballWentThrough && scoreIncr && canCount) {
      ++score;
      if (score < 10) {
        score = '0' + score;
      }
      document.querySelector('#scoreBoard').setAttribute('value', score);
      scoreIncr = false;
    } else if (ballWentThrough && !scoreIncr) {
      canCount = false;
      setTimeout(function() {
        canCount = true;
      }, 1500);
    }
  }
});


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