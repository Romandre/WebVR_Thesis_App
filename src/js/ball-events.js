/**
  *
  * TODO: 
  * 1) Make basket ring so it can let ball go through;
  * 2) Count baskets;
  * 3) Power increase indicator;
  * 4) Improve scene and environment appearance;
  * 5) Change fieldы markup lines texture;
  * 5) Add sound effects  
  *
  */

function pickUpBall(ball, cameraPos, cameraRot, interPoint, time, timeDelta) {
	var ballObject = ball.object3D;

	ball.removeAttribute('dynamic-body');
  	ballObject.position.set( 
  		cameraPos.x - Math.sin(cameraRot.y) * 0.4, 
  		cameraPos.y + Math.sin(cameraRot.x)/4 - 0.25 + Math.sin(time*0.002)*0.01, 
  		cameraPos.z - Math.cos(cameraRot.y) * 0.4
  	);
  	ballObject.rotation.set( 
  		cameraRot.x, 
  		cameraRot.y, 
  		cameraRot.z
  	);

    /***
  	console.log('Camer position: ', cameraPos );
  	console.log('Camer rotation: ', cameraRot );
  	console.log('Distance: ', distance );
  	console.log('Element is: ', ballObject.el.id);
  	console.log('Element position: ', ballObject.position , '\n\n\n\n'); 
  	***/	
}

function throwBall(ball, cameraPos, cameraRot, power) {
  ball.body.applyImpulse(
    /* impulse */        new CANNON.Vec3(-Math.sin(cameraRot.y)*power, (Math.sin(cameraRot.x)*power)*2, -Math.cos(cameraRot.y)*power),
    /* world position */ new CANNON.Vec3()
  );
}


    
  
