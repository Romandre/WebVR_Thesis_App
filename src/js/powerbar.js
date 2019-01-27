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
  powerbar.set(0);
  powerbar.animate(1);
}

function stopPowerbar() {
  powerbar.stop();
  setTimeout(function() {
    powerbar.animate(0);
  }, 200);
}