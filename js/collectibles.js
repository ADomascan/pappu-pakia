(function() {

  /*
  We'll have some collectibles:

  - Ones that give 50, 100, 500, 1000 points.

  - One to clone pappu that'll kill all
    forks, branches, pakias.

  - One for pappu's invincibility
  */

  mit.Collectible = function() {

    // x/y pos
    this.x;
    this.y;

    // width/height
    this.w;
    this.h;

    // Collectible Type - read above
    this.type;

    // Some collectible types may have subtypes
    // like coins of 50, 100, 500, 1000 and so on ...
    this.sub_type;

    this.getBounds = function() {
      var b = {};

      b.start_x = this.x;
      b.start_y = this.y;
      b.end_x   = this.x + this.w;
      b.end_y   = this.y + this.h;

      return b;
    };


    this.draw = function(ctx) {
      switch (this.type) {

        case 'coin':
          this.drawCoin(ctx);
          break;

        case 'clone':
          this.drawClone(ctx);
          break;

        case 'invincible':
          this.drawInvincible(ctx);
          break;

      }

      return;
    };

    this.drawCoin = function(ctx) {
      // Get coin color based on sub type
      var color = mit.CollectibleUtils.getCoinColor(this.sub_type);

      ctx.beginPath();

      ctx.fillStyle = color;

      ctx.arc(
        this.x,
        this.y,
        this.w/2,
        0,
        2*Math.PI,
        false
      );

      ctx.fill();
      ctx.closePath();
    };

    this.drawClone = function(ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    };

    this.drawInvincible = function(ctx) {
      ctx.fillStyle = 'lightBlue';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    };
  };


  mit.CollectibleUtils = {

    collecs: [],

    count: 2,

    types: ['coin', 'clone', 'invincible'],

    sub_types: {
      coin: [50, 100, 500, 1000]
    },

    init: function() {

    },

    getCoinColor: function(sub_type) {

      switch (sub_type) {
        case 50:
          return 'yellow';

        case 100:
          return 'blue';

        case 500:
          return 'orange';

        case 1000:
          return 'purple';
      }

    },

    getRandomPos: function() {
      var pos = {};

      var last = this.collecs[this.collecs.length - 1];

      if (last) {
        pos.x = last.x + utils.randomNumber(1000, 1500);
      }
      else {
        pos.x = utils.randomNumber(2000, 3000);
        pos.x = utils.randomNumber(500, 1000);
      }

      pos.y = utils.randomNumber(100, mit.H-100);

      // Check Positioning with forks
      var forks = mit.ForkUtils.forks;

      if (forks.length) {
        forks.forEach(function(fork) {
          if (Math.abs(pos.x - fork.x) < 300)
            pos.x = fork.x + 300;
        });
      }

      // Check Positioning with branches
      var branches = mit.BranchUtils.branches;

      if (branches.length) {
        branches.forEach(function(branch) {
          if (Math.abs(pos.x - branch.x) < 300)
            pos.x = branch.x + 300;
        });
      }

      return pos;
    },

    create: function() {
      var count = this.count - this.collecs.length;
      var collec,
          sub_types,
          pos;

      for (var i = 0; i < count; i++) {
        collec = new mit.Collectible();

        pos = this.getRandomPos();

        collec.x = pos.x;
        collec.y = pos.y;

        collec.w = 30;
        collec.h = 30;

        // Type
        collec.type = this.types[utils.randomNumber(0, this.types.length-1)];

        // Choosing Sub types if any
        sub_types = this.sub_types[collec.type];
        if (sub_types)
          collec.sub_type = sub_types[utils.randomNumber(0, sub_types.length-1)];

        this.collecs.push(collec);
      }
    },

    draw: function(ctx) {

      var self = this;

      self.create();

      self.collecs.forEach(function(collec, i) {
        if (collec.x < 0) {
          // Moved off the left edge
          /*var pos = self.getRandomPos();

          collec.x = pos.x;
          collec.y = pos.y;*/
          self.collecs.splice(i,1);
        }

        collec.x -= mit.Backgrounds.ground_bg_move_speed;

        collec.draw(ctx);
      });

      return;
    },

    checkCollision: function() {
      // First collec
      var collec = this.collecs[0],
          // Get Pappu Bounds
          pappu_bounds = mit.Pappu.getBounds(),
          // Get Nearest Collectible Bounds
          collec_bounds = collec.getBounds();

      if (utils.intersect(pappu_bounds, collec_bounds)) {
        // Pappu haz collected!

        // Determine type and perform action accordingly
        switch (collec.type) {

          case 'coin':
            mit.score += collec.sub_type;
            break;

          case 'clone':

          case 'invincible':
            mit.Pappu.invincible = 1;
            setTimeout(mit.Pappu.undoInvincible, 5000);
            break;
        }

        // Nuke the collectible
        this.collecs.shift();
      }

      return;
    }

  };

  mit.CollectibleUtils.init();

}());
