(function() {

  window.mit = window.mit || {};

  // We're having lots of forks to
  // make gameplay a little harder
  // and incorporate ggo's required concepts.

  // But we'll also try to incorporate
  // 'branching' by adding some branches
  // at random spots. So let the forks
  // come, but sometimes there wont be forks,
  // but a single branch (from top to bottom).
  //
  // The branches are gonna have a little hole
  // in between or some other random position
  // through which pappu will need to pass.
  //
  // If it collides at some part other than
  // the hole, he'll decease.

  function Branch() {
    this.x = 0;
    this.y = 0;

    this.draw = function(ctx) {

    };
  }

  var branches = [];

  /*
  This method will generate a random x/y
  position for the forks to start at.

  Based on the `fork.edge` we can draw
  the fork easily on the canvas edges.
  */
  var getRandomBranchPos = function() {
    // We have access to `branches` here
    var pos = {};

    if (branches[branches.length-1]) {
      pos.x = branches[branches.length-1].x;
      pos.x += 250;

      pos.y = branches[branches.length-1].y;
    }
    else {
      pos.x = 1*200;
      pos.y = 200;
    }

    return pos;
  };

  var drawBranches = function(ctx, count) {

    if (branches.length < count) {

      for (var i = 0; i < count - branches.length; i++) {
        var branch = new Branch();

        var pos = getRandomBranchPos();

        branch.x = pos.x;
        branch.y = pos.y;

        branches.push(branch);
      }
    }

    // console.log(branches);

    // Loop over branches and draw each of them
    branches.forEach(function(branch, index) {
      if (branch.x < 0) {
        branches.splice(index, 1);
      }
      branch.x -= 3;

      ctx.beginPath();
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 5;
      ctx.moveTo(branch.x, branch.y);

      ctx.lineTo(branch.x, 0);

      ctx.stroke();
      ctx.closePath();
    });
  };

  window.mit.branches = {
    drawBranches: drawBranches
  };

}());
