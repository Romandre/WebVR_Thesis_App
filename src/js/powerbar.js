var windowWidth = document.documentElement.clientWidth,
    userAgent = navigator.userAgent || navigator.vendor || window.opera,
    progressLine = document.querySelector('#progressLine'),
    animation = document.querySelector('#animation'),
    backgroundLine = document.querySelector('#backgroundLine');

/* Powerbar element */
var powerbar = new ProgressBar.Circle('#powerbar', {
  strokeWidth: 10,
  easing: 'easeInOut',
  duration: 1500,
  color: '#E94B3C',
  from: {color: '#E94B3C'},
  to: {color: '#14B414'},
  // Set default step function for animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
  }
});

function startPowerbar() {
  //if (/android/i.test(userAgent) || (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
    var lineWidth = 0;
    animation.emit('throw');
    backgroundLine.setAttribute('visible', '');
    progressLine.setAttribute('visible', '');
  /*} else {
    powerbar.set(0);
    powerbar.animate(1);
  }*/
}

function stopPowerbar() {
  //if (/android/i.test(userAgent) || (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
    animation.emit('stop');
    setTimeout(function() {
      backgroundLine.setAttribute('visible', 'false');
      progressLine.setAttribute('visible', 'false');
    }, 1000);
  /*} else {
    powerbar.stop();
    setTimeout(function() {
      powerbar.animate(0);
    }, 200);
  }*/
}