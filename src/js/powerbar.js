var windowWidth = document.documentElement.clientWidth,
    userAgent = navigator.userAgent || navigator.vendor || window.opera,
    progressLine = document.querySelector('#progressLine'),
    timerId = 0;

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
  if (/android/i.test(userAgent) || (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
    var lineWidth = 0;
    timerId = setInterval(function() {
      progressLine.setAttribute('geometry', 'primitive: box; depth:0.0015;height:0.001;width:'+ (++lineWidth)/500 );
    }, 10);
    setTimeout(function() {
      clearInterval(timerId);
    }, 1500);
  } else {
    powerbar.set(0);
    powerbar.animate(1);
  }
}

function stopPowerbar() {
  if (/android/i.test(userAgent) || (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
    clearTimeout(timerId);
    setTimeout(function() {
      progressLine.setAttribute('geometry', 'primitive: box; depth:0.0015;height:0.001;width:0.00001');
    }, 1000);
  } else {
    powerbar.stop();
    setTimeout(function() {
      powerbar.animate(0);
    }, 200);
  }
}