let canvas = document.getElementById("matrix");
canvas.width = 600;
canvas.height = 600;
let game = new Game(20, 20);
let squareSize = 30;
let snakeDirection = direction.EAST;

function draw() {
  if (canvas.getContext) {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    for (
      let bodySection = 0;
      bodySection < game.snake.body.length;
      bodySection++
    ) {
      if (bodySection == 0) {
        ctx.fillStyle = "green";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect(
        squareSize * game.snake.body[bodySection][0],
        squareSize * game.snake.body[bodySection][1],
        squareSize,
        squareSize
      );
    }

    ctx.fillStyle = "red";
    ctx.fillRect(
      squareSize * game.apple[0],
      squareSize * game.apple[1],
      squareSize,
      squareSize
    );

  }

  document.getElementById("score").innerHTML = "score: " + game.score;
  document.getElementById("snake").innerHTML =
    "snake head: " + game.snake.body[0];
  document.getElementById("apple").innerHTML = "apple: " + game.apple;
}
var lastFrameTimeMs = 0, // The last time the loop was run
  maxFPS = 2; // The maximum FPS we want to allow

function loop(timestamp) {
  if (timestamp < lastFrameTimeMs + 1000 / maxFPS) {
    window.requestAnimationFrame(loop);
    return;
  }
  lastFrameTimeMs = timestamp;
  update();
  draw();
  window.requestAnimationFrame(loop);
}

function update() {
  game.move(snakeDirection);
}
window.onkeydown = keyDownHandler;
function keyDownHandler(e) {
  e = e || window.event;

  if (e.keyCode == "38") {
    snakeDirection = direction.NORTH;
  } else if (e.keyCode == "40") {
    snakeDirection = direction.SOUTH;
  } else if (e.keyCode == "37") {
    snakeDirection = direction.WEST;
  } else if (e.keyCode == "39") {
    snakeDirection = direction.EAST;
  }
}
window.requestAnimationFrame(loop);
