document.addEventListener("DOMContentLoaded", function(event) {
	if (document.documentElement.clientWidth < 992) {
		if (!document.querySelector('#controls').classList.contains("gamepad")) {
			document.querySelector('#controls').classList.add('no-device');
		}
	}
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
    if (ctrls.contains("open")) {
    	ctrls.remove("open");
  	} else {
    	ctrls.add("open");
  	}
}

// Mobile chrome last versions has different gamepad buttons layout, so I use that var to detect that case  
var isMobileChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime),
	options = 9;
if (document.documentElement.clientWidth < 992 && isMobileChrome) {
	alert('Hello from Chrome!');
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
	