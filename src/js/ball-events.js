
function takeBall(evt, ball, player, camera, ballIsUp) {
  if (!ballIsUp) {
	playerPos = player.position;
	playerRot = camera.rotation;

	if (evt.type === 'mousedown' && evt.target.id == 'ball') {
	  interPoint = evt.detail.intersection.point;
	  console.log('You clicked at: ', interPoint);
	  console.log(evt.target.id);
	}

	// Calculate distance between camera and the ball
	var dx = playerPos.x - ball.object3D.position.x; 
	var dy = playerPos.y - ball.object3D.position.y; 
	var dz = playerPos.z - ball.object3D.position.z; 
	var distance = dx*dx+dy*dy+dz*dz;
	//console.log('Distance: ', distance);

	if (distance < 3.5) {
	  console.log('Ball picked up!');
	  attachBall(ball, playerPos, playerRot, null, null);
	  return true;
	}
  } 
}

function attachBall(ball, playerPos, playerRot, time, timeDelta) {
  var ballObj = ball.object3D;

  ball.removeAttribute('dynamic-body');
  ballObj.position.set( 
    playerPos.x - Math.sin(playerRot.y) * 0.4, 
    playerPos.y + Math.sin(playerRot.x)/4 + 1.4, 
    playerPos.z - Math.cos(playerRot.y) * 0.4
  );
  // Math.sin(time*0.0005)*0.1 - posible to add for Y axis for balls floating animation
  ballObj.rotation.set( 
 	playerRot.x, 
	playerRot.y, 
	playerRot.z
  );

  /*console.log('Camer position: ', playerPos );
	console.log('Camer rotation: ', playerRot );
	console.log('Distance: ', distance );
	console.log('Element is: ', ballObject.el.id);
	console.log('Element position: ', ballObject.position , '\n\n\n\n'); */	
}

function throwBall(ball, camera, power, linDamp, angDamp) {
  playerRot = camera.rotation;
  setDynamicBody(ball, linDamp, angDamp);
  ball.body.applyImpulse(
	new CANNON.Vec3(-Math.sin(playerRot.y)*power, (Math.sin(playerRot.x)*power)*3, -Math.cos(playerRot.y)*power), /* impulse */
	new CANNON.Vec3() /* world position */ 
  );
}

function dropBall(ball, camera, linDamp, angDamp) {
    playerRot = camera.rotation;
    setDynamicBody(ball, linDamp, angDamp);
    ball.body.applyImpulse(
      new CANNON.Vec3(-Math.sin(playerRot.y)*1.3, Math.sin(playerRot.x), -Math.cos(playerRot.y)*1.3), /* impulse */
      new CANNON.Vec3() /* world position */ 
    );
}

function resetBall(ball, linDamp, angDamp, setDynamic) {
	ball.object3D.position.set(0, 3, -2);
	setDynamicBody(ball, linDamp, angDamp);
	setTimeout( function() {
      ball.body.applyImpulse(
        new CANNON.Vec3(getRandomNum(), 0, getRandomNum()),
        new CANNON.Vec3()
      );
    }, 50);
}


function setDynamicBody(ball, linDamp, angDamp) {
  ball.setAttribute('dynamic-body', {
    linearDamping: linDamp,
    angularDamping: angDamp,
    mass: 4,
    shape: 'sphere'
  });
}


/* Get random number from -1.5 to 1.5 */
function getRandomNum() {
  var randomImpuls = Math.random() < 0.5 ? - 1 : 1;
  return (Math.random() * (1.5 - 1) + 1) * randomImpuls;
}

var ballSounds = ["src/sounds/ball1.mp3", "src/sounds/ball2.mp3", "src/sounds/ball3.mp3", "src/sounds/ball4.mp3", "src/sounds/ball5.mp3", "src/sounds/ball6.mp3", "src/sounds/ball7.mp3", "src/sounds/ball8.mp3"]
function bounceSound(velocity) {
	var audio = new Audio(ballSounds[Math.floor(Math.random() * ballSounds.length)]);
	audio.volume = 0.05;
	if (velocity.x > 10 || velocity.x < -10 || velocity.y > 10 || velocity.y < -10) {
		audio.volume = 1;
	} else if (velocity.x > 9 || velocity.x < -9 || velocity.y > 9 || velocity.y < -9) {
  		audio.volume = 0.95;
	} else if (velocity.x > 8 || velocity.x < -8 || velocity.y > 8 || velocity.y < -8) {
		audio.volume = 0.9;
	} else if (velocity.x > 7 || velocity.x < -7 || velocity.y > 7 || velocity.y < -7) {
		audio.volume = 0.85;
	} else if (velocity.x > 6 || velocity.x < -6 || velocity.y > 6 || velocity.y < -6) {
		audio.volume = 0.8;
	} else if (velocity.x > 5 || velocity.x < -5 || velocity.y > 5 || velocity.y < -5) {
		audio.volume = 0.6;
	} else if (velocity.x > 4 || velocity.x < -4 || velocity.y > 4 || velocity.y < -4) {
  		audio.volume = 0.45;
	} else if (velocity.x > 3 || velocity.x < -3 || velocity.y > 3 || velocity.y < -3) {
  		audio.volume = 0.35;
	} else if (velocity.x > 2.5 || velocity.x < -2.5 || velocity.y > 2.5 || velocity.y < -2.5) {
  		audio.volume = 0.25;
	} else if (velocity.x > 2 || velocity.x < -2 || velocity.y > 2 || velocity.y < -2) {
  		audio.volume = 0.2;
	} else if (velocity.x > 1.5 || velocity.x < -1.5 || velocity.y > 1.5 || velocity.y < -1.5 || velocity.z > 1.5 || velocity.z < -1.5) {
		audio.volume = 0.15;
	} else if (velocity.x > 1 || velocity.x < -1 || velocity.y > 1 || velocity.y < -1 || velocity.z > 1 || velocity.z < -1) {
		audio.volume = 0.1;
	}
	audio.play();
}