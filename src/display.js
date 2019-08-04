let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

var img_apple = document.getElementById("img_apple");
var img_snakehead = document.getElementById("img_snakehead");
var img_snakebody = document.getElementById("img_snakebody");
let game = new Game(20, 20);
let squareSize = 30;
let snakeDirection = direction.EAST;
let paused = false;
let lastFrameTimeMs = 0;
let maxFPS = 5;

function newGame() {
  game = new Game(20, 20);
}

function pause() {
  paused = paused == true ? false : true;
}

function draw() {
  if (canvas.getContext) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (paused) {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText("Paused", 30, 30);
    }

    if (game.gameOver == true) {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText("GameOver", 30, 30);
    }

    drawSnake();
    setElements();
    //apple
    ctx.drawImage(
      img_apple,
      game.apple[0] * squareSize,
      game.apple[1] * squareSize
    );
  }
}

function setElements() {
  document.getElementById("score").innerHTML = "score: " + game.totalScore;
  document.getElementById("snake").innerHTML =
    "snake head: " + game.snake.body[0];
  document.getElementById("apple").innerHTML = "apple: " + game.apple;
  document.getElementById("dtoApple").innerHTML = "dtoApple: " + game.dtoApple;
  document.getElementById("direction").innerHTML =
    "direction: " + game.snake.movingDirection;
  document.getElementById("degreesToApple").innerHTML =
    "degreesToApple: " + game.degreesToApple;
  document.getElementById("dtos").innerHTML = `front: ${game.dtoFront} left: ${
    game.dtoLeft
  } right: ${game.dtoRight}`;
}

function drawSnake() {
  var angle = directionToAngle(game.snake.movingDirection);
  //body
  for (let i = game.snake.body.length - 1; i > 0; i--) {
    drawImage(
      img_snakebody,
      squareSize * game.snake.body[i][0],
      squareSize * game.snake.body[i][1],
      angle
    );
  }

  //head
  drawImage(
    img_snakehead,
    squareSize * game.snake.body[0][0],
    squareSize * game.snake.body[0][1],
    angle
  );
}

function drawImage(image, x, y, angle) {
  ctx.save();
  ctx.translate(x + squareSize / 2, y + squareSize / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.translate(-x - squareSize / 2, -y - squareSize / 2);
  ctx.drawImage(image, x, y, squareSize, squareSize);
  ctx.restore();
}

function directionToAngle(snakeDirection) {
  switch (snakeDirection) {
    case 0:
      return 0;
    case 1:
      return 180;
    case 2:
      return 90;
    case 3:
      return 270;
  }
}

function directionToAngle(snakeDirection) {
  switch (snakeDirection) {
    case 0:
      return 0;
    case 1:
      return 180;
    case 2:
      return 90;
    case 3:
      return 270;
  }
}

function update() {
  if (!paused) {
    game.move(snakeDirection);
    snakeDirection = 0;
  }
}

window.onkeydown = keyDownHandler;
function keyDownHandler(e) {
  e = e || window.event;

  if (e.keyCode == "38") {
    // snakeDirection = direction.NORTH;
  } else if (e.keyCode == "40") {
    //snakeDirection = direction.SOUTH;
  } else if (e.keyCode == "37") {
    snakeDirection = 1;
  } else if (e.keyCode == "39") {
    snakeDirection = 2;
  } else if (e.keyCode == "80") {
    pause();
  } else if (e.keyCode == "107") {
    maxFPS++;
  } else if (e.keyCode == "109") {
    maxFPS--;
  } else if (e.keyCode == "32") {
    newGame();
  }
}

window.requestAnimationFrame(loop);
function loop(timestamp) {
  if (timestamp < lastFrameTimeMs + 1000 / maxFPS) {
    window.requestAnimationFrame(loop);
    return;
  }

  lastFrameTimeMs = timestamp;

  draw();
  if (!game.gameOver) {
    update();
  }
  window.requestAnimationFrame(loop);
}
