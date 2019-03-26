var isVrModeEnabled = false;

document.addEventListener("DOMContentLoaded", function(event) {
	if (document.documentElement.clientWidth < 992) {
		if (!document.querySelector('#controls').classList.contains("gamepad")) {
			document.querySelector('#controls').classList.add('no-device');
		}
	}
	document.querySelector('a-scene').addEventListener('enter-vr', function () {
	   isVrModeEnabled = true;
	});
});

document.onreadystatechange = function () {
  if(document.readyState === "complete"){
    var scene = document.querySelector('a-scene');
	var loader = document.querySelector('#loader');
	var controls = document.querySelector('#controls');
	loader.style.display = 'none';
    controls.classList.add('open');
  }
}

function toggleControls() {
	var ctrls = document.getElementById("controls").classList;
	var vrctrls = document.getElementById("vrcontrols");
	if (!isVrModeEnabled) {
		if (ctrls.contains("open")) {
			ctrls.remove("open");
	  	} else {
	    	ctrls.add("open");
	  	}
	} else {
		if (vrctrls.getAttribute('visible') == false) {
	  		vrctrls.setAttribute('visible', 'true');
	  	} else {
	  		vrctrls.setAttribute('visible', 'false');
	  	}
	}
  	 
}

// Mobile chrome last versions has different gamepad buttons layout, so I use that var to detect that case  
var options = 9;
if (document.documentElement.clientWidth < 992 && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) ) {
  	options = 11;
}

window.addEventListener('gamepadbuttondown', function (evt) {
	/* On "options" button press */
	if (evt.detail.index == options) {
		toggleControls();
	}
});

window.addEventListener("keydown", (e) => {
	/* On "C" key press */
	if (e.keyCode == 67) {
		toggleControls();
	}
});
	