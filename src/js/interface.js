document.addEventListener("DOMContentLoaded", function(event) {
	if (document.documentElement.clientWidth < 992) {
		if (!document.querySelector('#controls').classList.contains("gamepad")) {
			document.querySelector('#controls').classList.add('no-device');
		}
	}
	
    var scene = document.querySelector('a-scene');
    var loader = document.querySelector('#loader');
    var controls = document.querySelector('#controls');
    scene.addEventListener('loaded', function (e) {
        loader.style.display = 'none';
        controls.classList.add('open');
        console.log('Menu opened');
    });
});

function toggleControls() {
var ctrls = document.getElementById("controls").classList;
    ctrls.remove("open");
}

window.addEventListener('gamepadbuttondown', function (evt) {
	/* On "options" button press */
	if (evt.detail.index == 9) {
		var ctrls = document.getElementById("controls").classList;
		if (ctrls.contains("open")) {
	    	ctrls.remove("open");
	  	} else {
	    	ctrls.add("open");
	  	}
	}
});

window.addEventListener("keydown", (e) => {
	/* On "C" key press */
	if (e.keyCode == 67) {
		var ctrls = document.getElementById("controls").classList;
		if (ctrls.contains("open")) {
	    	ctrls.remove("open");
	  	} else {
	    	ctrls.add("open");
	  	}
	}
});
	