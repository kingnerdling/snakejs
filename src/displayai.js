let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

let img_apple = document.getElementById("img_apple");
let img_snakehead = document.getElementById("img_snakehead");
let img_snakeheadai = document.getElementById("img_snakeheadai");
let img_snakebody = document.getElementById("img_snakebody");
let game = new Game(20, 20);
let agent = new Agent(game);
let squareSize = 30;
let paused = false;
let lastFrameTimeMs = 0;
let maxFPS = 5;
let trainingMode = true;
let lastSave = new Date();

function newGame() {
  game = new Game(20, 20);
  agent.game = game;
}

function pause() {
  paused = paused == true ? false : true;
}

function draw() {
  if (canvas.getContext) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (paused) {
      ctx.font = "30px Arial";
      ctx.fillText("Paused", 30, 30);
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
  document.getElementById("maxScore").innerHTML =
    "max score: " + agent.maxScore;
  document.getElementById("score").innerHTML = "score: " + game.totalScore;
  document.getElementById("snake").innerHTML =
    "snake head: " + game.snake.body[0];
  document.getElementById("apple").innerHTML = "apple: " + game.apple;
  document.getElementById("dtoApple").innerHTML = "dtoApple: " + game.dtoApple;
  document.getElementById("direction").innerHTML =
    "direction: " + game.snake.movingDirection;
  document.getElementById("degreesToApple").innerHTML =
    "degreesToApple: " + game.degreesToApple;
  document.getElementById("accuracy").innerHTML = "accuracy: " + agent.accuracy;
  document.getElementById("randomRate").innerHTML =
    "randomRate: " + agent.randomRate;
  document.getElementById(
    "dtos"
  ).innerHTML = `front: ${game.dtoFront} left: ${game.dtoLeft} right: ${game.dtoRight}`;
  document.getElementById("training").innerHTML = "training: " + trainingMode;
  document.getElementById("lastSave").innerHTML = "lastSave: " + lastSave;
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
  if (agent.randomMove) {
    drawImage(
      img_snakeheadai,
      squareSize * game.snake.body[0][0],
      squareSize * game.snake.body[0][1],
      angle
    );
  } else {
    drawImage(
      img_snakehead,
      squareSize * game.snake.body[0][0],
      squareSize * game.snake.body[0][1],
      angle
    );
  }
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

async function update() {
  if (!paused) {
    if (trainingMode == true) {
      if (game.movesSinceLastScore > 500) {
        newGame();
      }
    }
    if (agent.game.gameOver) {
      newGame();
    }
    agent.move();
    if (trainingMode == true) {
      await agent.train().then();
    }
  }
}

async function saveModel() {
  await agent.neuralNetwork.save("localstorage://my-model-1");
  lastSave = new Date();
}

async function loadModel() {
  model = await agent.neuralNetwork.loadModel("localstorage://my-model-1");
  agent.neuralNetwork.model = model;
}

window.onkeydown = keyDownHandler;
function keyDownHandler(e) {
  e = e || window.event;

  if (e.keyCode == "38") {
    game.snake.movingDirection = direction.NORTH;
  } else if (e.keyCode == "40") {
    game.snake.movingDirection = direction.SOUTH;
  } else if (e.keyCode == "37") {
    game.snake.movingDirection = direction.WEST;
  } else if (e.keyCode == "39") {
    game.snake.movingDirection = direction.EAST;
  } else if (e.keyCode == "80") {
    pause();
  } else if (e.keyCode == "107") {
    maxFPS++;
  } else if (e.keyCode == "109") {
    maxFPS--;
  } else if (e.keyCode == "32") {
    newGame();
  } else if (e.keyCode == "84") {
    trainingMode = trainingMode == true ? false : true;
  } else if (e.keyCode == "83") {
    saveModel();
  } else if (e.keyCode == "76") {
    loadModel();
  } else if (e.keyCode == "187") {
    agent.randomRate += 0.1;
  } else if (e.keyCode == "189") {
    agent.randomRate -= 0.1;
  }
}

window.requestAnimationFrame(loop);
async function loop(timestamp) {
  if (timestamp < lastFrameTimeMs + 1000 / maxFPS) {
    window.requestAnimationFrame(loop);
    return;
  }

  lastFrameTimeMs = timestamp;

  await update();
  draw();
  window.requestAnimationFrame(loop);
}
