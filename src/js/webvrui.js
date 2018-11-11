
var renderer = new THREE.WebGLRenderer();

var options = {}
var enterVR = new webvrui.EnterVRButton(renderer.domElement, options);
document.body.appendChild(enterVR.domElement);

var extendDeep = AFRAME.utils.extendDeep;