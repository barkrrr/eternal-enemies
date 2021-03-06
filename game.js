'use strict';

function Game() {
  var self = this;

  self.gameIsOver = false;
  self.score = 0;
  self.pause = false;
  self.username = idName;
}

Game.prototype.start = function () {
  var self = this;

  self.gameMain = buildDom(`
    <main class="game container">
      <header>
        <div class="lives">
          <span class="label">Lives:</span>
          <span class="value"></span>
        </div>
        <div>
          <p></p>
        </div>
        <div class="score">
          <span class="label">Score:</span>
          <span class="value"></span>
        </div>
      </header>
      <div class="canvas">
        <canvas></canvas>
      </div>
    </main>
  `);

  self.canvasParentElement = self.gameMain.querySelector('.canvas');
  self.canvasElement = self.gameMain.querySelector('canvas');

  self.livesElement = self.gameMain.querySelector('.lives .value');
  self.scoreElement = self.gameMain.querySelector('.score .value');

  document.body.appendChild(self.gameMain);

  self.width = self.canvasParentElement.offsetWidth;
  self.height = self.canvasParentElement.offsetHeight;

  self.canvasElement.setAttribute('width', self.width);
  self.canvasElement.setAttribute('height', self.height);

  self.player = new Player(self.canvasElement, 5);

  self.handleKeyDown = function (event) {
    if (event.key === 'ArrowUp') {
      self.player.setDirection(-1);
    } else if (event.key === 'ArrowDown') {
      self.player.setDirection(1)
    }
  };

  document.body.addEventListener('keydown', self.handleKeyDown);

  self.enemies = [];
  self.circles = [];
  self.lives = [];

  self.startLoop();

  self.gameIsOver = false;

};
 
Game.prototype.startLoop = function () {
  var self = this;

  var ctx = self.canvasElement.getContext('2d');

  document.body.addEventListener('keyup', function(){
    if (event.key === ' ') {
      self.pause = !self.pause;
      if (!self.pause) {
          loop();
      }
    }
  });
     
    function loop () {

      // create more enemies now and then
      if (Math.random() > 0.95) {
        var y = self.canvasElement.height * Math.random();
        self.enemies.push(new Enemy(self.canvasElement, y, 5));
      }

      if (Math.random() > 0.99) {
        var y = self.canvasElement.height * Math.random();
        self.circles.push(new Circle(self.canvasElement, y, 5));
      }

      if (Math.random() > 0.995) {
        var y = self.canvasElement.height * Math.random();
        self.lives.push(new Live(self.canvasElement, y, 8));
      }
      
      // update player position
      self.player.update();

      self.enemies.forEach(function(item) {
        item.update();
      });

      self.circles.forEach(function(item) {
        item.update()
      });

      self.lives.forEach(function(item) {
        item.update();
      });

      // run through the array of enemies
      // if x < 0 filter enemies out from array
      self.enemies = self.enemies.filter(function(item) {
        return item.isInScreen();
      })

      self.checkIfEnemiesCollidedPlayer();
      self.checkIfCirclesCollidedPlayer();
      self.checkIfLivesCollidedPlayer();

      self.livesElement.innerText = self.player.lives;
      self.scoreElement.innerText = self.score;

      ctx.clearRect(0, 0, self.width, self.height);

      // Draw
      self.enemies.forEach(function (item) {
        item.draw();
      });

      self.circles.forEach(function(item) {
        item.draw()
      });

      self.lives.forEach(function(item) {
        item.draw()
      });

      self.player.draw();

      if(!self.gameIsOver && !self.isPause) { 
      window.requestAnimationFrame(loop);
      }
    }

    window.requestAnimationFrame(loop);
};

Game.prototype.checkIfEnemiesCollidedPlayer = function () {
  var self = this;

  self.enemies.forEach(function (item, index) {
    if (self.player.collidesWithEnemy(item)) {
      self.player.collided();
      self.enemies.splice(index, 1);

      if(!self.player.lives) {
        self.gameOver();
      }  
    }
  });
}

Game.prototype.checkIfCirclesCollidedPlayer = function () {
  var self = this;
  self.circles.forEach( function(item, index) {
    if (self.player.collidesWithEnemy(item)) {
      self.score ++;
      self.circles.splice(index, 1);
    }
  });
};

Game.prototype.checkIfLivesCollidedPlayer = function () {
  var self = this;
  self.lives.forEach( function(item, index) {
    if(self.player.collidesWithEnemy(item)) {
      self.player.collidedLive();
      self.lives.splice(index, 1);
    }
  });
};

Game.prototype.onOver = function (callback) {
  var self = this;

  self.onGameOverCallback = callback;
};

Game.prototype.gameOver = function () {
  var self = this;

  self.gameIsOver = true;
  self.onGameOverCallback();
};


Game.prototype.destroy = function () {
  var self = this;
  
  self.gameMain.remove();
};
