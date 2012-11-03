(function() {
  // rAF
  window.requestAnimationFrame = function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(f) {
        window.setTimeout(f,1e3/60);
      }
  }();


  window.mit = window.mit || {};

  var config = mit.config = {
    fork_count: 6
  };

  var ui = mit.ui = {
    body: $('body')
  };

  /*
  Basic Canvas Inits
  */

  var canvas = document.querySelector('#mindd_it');
  var ctx = canvas.getContext('2d');

  var W = canvas.width = ui.body.width();
  var H = canvas.height = ui.body.height();

  // Gravity
  var gravity = mit.gravity = 0.2;

  // Velocity x,y
  var vx = 0;
  var vy = 0;

  // You can console.log velocities in drawing methods
  // and from there decide what to set as the cap.
  var v_cap = 4;

  // Accelaration x,y
  var ax = 0;
  var ay = 0;


  // Key Events
  window.addEventListener('keydown', function(e) {

    switch (e.keyCode) {
      // Left
      case 37:
        ax = -0.1;
        break;

      // Right
      case 39:
        ax = 0.1;
        break;

      // Up
      case 38:
        ay = -0.4;
        break;

      // Down
      case 40:
        ay = 0.1;
        break;
    }

  }, false);

  window.addEventListener('keyup', function(e) {
    ax = 0;
    ay = 0;
  });


  // There will be only 1 Pappu
  var pappu = {
    x: 50,
    y: 10,
    w: 50,
    h: 50,

    draw: function(ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    },

    hasReachedBoundary: function(canvas_width, canvas_height) {
      var W = canvas_width;
      var H = canvas_height;

      // Crossed Sides ?
      // `c` stands for crossed

      var ctop = (this.y < 0);
      var cbtm = (this.y > H);
      var cleft = (this.x < 0);
      var crgt = (this.x > W);

      // return true if crossed any sides
      if (ctop || cbtm || cleft || crgt) {
        return true;
      }

      return false;
    }
  };


  (function renderGame() {
    window.requestAnimationFrame(renderGame);

    ctx.clearRect(0, 0, W, H);

    // Draw Forks
    window.forks.createRandomForks(ctx, 6);

    // Game over on reaching any boundary
    if (pappu.hasReachedBoundary(W, H)) {
      return;
    }

    // Acceleration + Gravity
    //ay = ay + gravity;

    // Velocity
    if (
      (vy < v_cap && ay+gravity > 0) ||
      (vy > -v_cap && ay+gravity < 0)
      ) {

      vy += ay;
      vy += gravity;
    }

    // console.log(vy, ay)

    pappu.x += vx;
    pappu.y += vy;

    pappu.draw(ctx);

  }());

}());
