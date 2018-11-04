/**
  *
  * TODO: 
  * 1) Implement throwing function 
  * 2) Animate camera to imitate players breath
  * 3) Add sound effects 
  */

  //*******************************//
 //** Register camera component **//
//*******************************//
AFRAME.registerComponent('#camera', {
	init: function (oldData) {
		el = this.el.object3D;
	    el.visible = this.data;
  	},
  	tock: function(time, timeDelta, evt) {
  		el = this.el.object3D;
  		el.rotation.set( 
	  		el.rotation.x, 
	  		el.rotation.y + Math.sin(time*0.002)*0.01, 
	  		el.rotation.z
	  	);
  	}
});


var keepBallAttached = false;

function attachBallToCamera(ballElement, cameraPos, cameraRot, interPoint, time, timeDelta) {
	var ballObject = ballElement.object3D;

	// Calculate distance between camera and the ball
  	var dx = cameraPos.x - ballObject.position.x; 
  	var dy = cameraPos.y - ballObject.position.y; 
  	var dz = cameraPos.z - ballObject.position.z; 
  	var distance = dx*dx+dy*dy+dz*dz;

  	if (distance < 6) {
  		ballElement.removeAttribute('dynamic-body');
	  	ballObject.position.set( 
	  		cameraPos.x - Math.sin(cameraRot.y) * 0.5, 
	  		cameraPos.y + Math.sin(cameraRot.x)/4 - 0.2 + Math.sin(time*0.002)*0.01, 
	  		cameraPos.z - Math.cos(cameraRot.y) * 0.5
	  	);
	  	ballObject.rotation.set( 
	  		cameraRot.x - Math.PI, 
	  		cameraRot.y/3, 
	  		cameraRot.z
	  	);
    }

    /**
     * Logs with important info:
     * 
  	console.log('Camer position: ', cameraPos );
  	console.log('Camer rotation: ', cameraRot );
  	console.log('Distance: ', distance );
  	console.log('I was clicked at: ', interPoint);
  	console.log('Element is: ', ballObject.el.id);
  	console.log('Element position: ', ballObject.position , '\n\n\n\n'); 
  	**/	
}

    
  //*****************************//
 //** Register ball component **//
//*****************************//
AFRAME.registerComponent('ball-events', {
	init: function () {
	  	el = this.el;
	  	el.object3D.position.set(0, 2.150, -1.76);
	  	  
	  	 /** Pick up the ball event **/
	    el.addEventListener('mousedown', function (evt) {		 
		  	var camera = document.querySelector('#camera').object3D;
		  	var cameraPos = camera.position;
		  	var cameraRot = camera.rotation;
		  	var interPoint = evt.detail.intersection.point;
		  	attachBallToCamera(el, cameraPos, cameraRot, interPoint, null, null);	
			keepBallAttached = true;
	    });
	    
		 /** Drop the ball event **/
    	window.addEventListener("keyup", (e) => {
    		/* If space is tapped */
        	if (e.keyCode == 32 ) {
          		el.setAttribute('dynamic-body', '');
          		keepBallAttached = false;
        	}
      	});
	},

	/** Update ball on each tick or frame of the scene’s render loop **/
	tock: function(time, timeDelta, evt) {
		if (keepBallAttached == true) {
			var camera = document.querySelector('#camera').object3D;
		  	var cameraPos = camera.position;
		  	var cameraRot = camera.rotation;
		  	attachBallToCamera(el, cameraPos, cameraRot, evt, time, timeDelta);	
	  	}
	}

});
