/*
var geometry = new THREE.SphereGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry, material );
document.querySelector('a-scene').object3D.add( sphere );

object.position.copy( camera.position );
object.rotation.copy( camera.rotation );
object.updateMatrix();
object.translateZ( - 10 );

var boxEl = document.querySelector('a-sphere');
	boxEl.addEventListener('mouseenter', function () {
	boxEl.setAttribute('scale', {x: 2, y: 2, z: 2});
});
*/


var cameraPosition;
var worldPos = new THREE.Vector3();

AFRAME.registerComponent('#camera', {
	init: function (oldData) {
		cameraPosition = this.el.object3D.position;
	    this.el.object3D.visible = this.data;
  	}
});

/*** TODO: 
	1) Set proper position to a ball after dropping it;
	2) Fix 'pick up ball' function for proper picking up. 
***/

    
  //**************************************//
 //** Component to listen for a click. **//
//**************************************//
AFRAME.registerComponent('ball-events', {
	init: function () {
	  	el = this.el;
	  	el.object3D.position.set(0, 2.150, -1.76);


	  	  /**----------------------**/
	  	 /* Pick up the ball event */
	  	/**----------------------**/
	    el.addEventListener('mousedown', function (evt) {
	  		/*this.position.set( cameraPosition );
		  	this.rotation.copy( cameraPosition );
		  	this.updateMatrix();
		  	this.translateZ( - 10 );*/

		  	var camera = document.querySelector('#camera').object3D;
		  	var cameraPos = camera.position;
		  	var cameraRot = camera.rotation;

		  	var dx = cameraPos.x - el.object3D.position.x; 
		  	var dy = cameraPos.y - el.object3D.position.y; 
		  	var dz = cameraPos.z - el.object3D.position.z; 
		  	var distance = dx*dx+dy*dy+dz*dz;
 
		  	if (distance < 6) {
		  		el.removeAttribute('dynamic-body');
			  	el.object3D.position.set( 
			  		cameraPos.x - Math.sin(cameraRot.y) * 0.6, 
			  		cameraPos.y - 1.5, 
			  		cameraPos.z - Math.cos(cameraRot.y) * 0.6
			  	);
			  	el.object3D.rotation.set( 
			  		cameraRot.x, 
			  		cameraRot.y, 
			  		cameraRot.z
			  	);
		    }
		  	//el.setAttribute('position', {x:pos.x, y:pos.y, z:pos.z-1});
		  	//el.setAttribute('dynamic-body', '');

		  	console.log('Camer position: ', cameraPos );
		  	console.log('Camer rotation: ', cameraRot );
		  	console.log('Distance: ', distance );
		  	console.log('I was clicked at: ', evt.detail.intersection.point);
		  	console.log('Element is: ', el.object3D.el.id);
		  	console.log('Element position: ', el.object3D.position , '\n\n\n\n');		  	
	    });


	      /**-------------------**/
		 /* Drop the ball event */
		/**-------------------**/
	    window.addEventListener("keyup", (e) => {
        	if (e.keyCode == 32) {
          		el.setAttribute('dynamic-body', '');
				var newElPos = worldPos.setFromMatrixPosition(el.object3D.matrixWorld);
          		el.object3D.position.set(newElPos);
        	}
      	});
	}
});
