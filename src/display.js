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

    if (game.gameOver) {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 15);
    }

    if (paused) {
      ctx.font = "30px Arial";
      ctx.fillText("Paused", 30, 30);
    }

    drawSnake();

    document.getElementById("score").innerHTML = "score: " + game.totalScore;
    document.getElementById("snake").innerHTML =
      "snake head: " + game.snake.body[0];
    document.getElementById("apple").innerHTML = "apple: " + game.apple;
  }
}

function drawSnake() {
  var angle = directionToAngle(snakeDirection);
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

  //apple
  ctx.drawImage(
    img_apple,
    game.apple[0] * squareSize,
    game.apple[1] * squareSize
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
    case "north":
      return 0;

    case "east":
      return 90;
    case "south":
      return 180;
    case "west":
      return 270;
  }
}

function update() {
  if (!paused) {
    game.move(snakeDirection);
  }
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
