'use strict';

var idName;

function buildDom(html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  return div.children[0];
}

function main() {

  var splashMain;
  var gameOverMain;

  var game; // instance of Game

  // -- splash

  function buildSplash() {

    splashMain = buildDom(`
      <main>
        <h1>Eternal Enemies</h1>
        <div>
        <label>Username:</label>
        <input type="text" placeholder="who do you hate most?">
        </div>
        <button>Start</button>
      </main>
    `);
    
    document.body.appendChild(splashMain);

    var input = document.querySelector('input');

    input.addEventListener('keyup', function () {
      idName = username(input);
    })

    function username (item) {
      return item.value;
    };
    
    var button = splashMain.querySelector('button');
    button.addEventListener('click', startGame);
    
  }

  function destroySplash() {
    splashMain.remove();
  }

  
  // -- game

  function startGame() {
    destroySplash();
    destroyGameOver();

    game = new Game();
    game.start();
    game.onOver(function () {
      gameOver(game.score, game.username);
    });
  }

  function destroyGame() {
    game.destroy();
  }

  // -- game over 


  function gameOver(score, username) {
    destroyGame();
    buildGameOver(score, username);
  }

  function buildGameOver(score, username) {

    gameOverMain = buildDom(`
      <main>
        <h1>Game over</h1>
        <p><span></span></p>
        <button>Restart</button>
      </main>
    `);

    var button = gameOverMain.querySelector('button');
    button.addEventListener('click', startGame);    
    
    var span = gameOverMain.querySelector('span');
    span.innerText = username + 'Your score is: ' + score + '!!';

    document.body.appendChild(gameOverMain);
  }

  function destroyGameOver() {
    if (gameOverMain) {
      gameOverMain.remove();
    }
  }

  // -- initialize

  buildSplash();
}

window.addEventListener('load', main);