class Game {
  constructor(rows, cols) {
    this.lastScore = 0;
    this.totalScore = 0;
    this.rows = rows;
    this.cols = cols;
    this.snake = new Snake(direction.SOUTH, this.randomPoint());
    this.apple = this.randomPoint();
    this.gameOver = false;
    this.movesSinceLastScore = 0;
    this.moves = 0;
    this.applesCollected = 0;
    this.setDistances();
  }

  randomPoint() {
    return [
      Math.floor(Math.random() * Math.floor(this.rows)),
      Math.floor(Math.random() * Math.floor(this.cols))
    ];
  }

  setDistances() {
    this.dtoApple = this.distance(this.snake.body[0], this.apple);
    this.dtoTop = this.distance([0, this.snake.body[0][1]], [0, 0]);
    this.dtoBottom = this.distance([20, this.snake.body[0][1]], [20, 20]);
    this.dtoLeft = this.distance([0, this.snake.body[0][0]], [0, 0]);
    this.dtoRight = this.distance([20, this.snake.body[0][0]], [20, 20]);
    this.degreesToApple = this.calcDegressToApple();
  }
 
  calcDegressToApple() {
    var angle =
      (Math.atan2(
        this.apple[1] - this.snake.body[0][1],
        this.apple[0] - this.snake.body[0][0]
      ) *
        180) /
        Math.PI +
      180;
    return this.directionToAngle(this.snake.movingDirection, angle);
  }

  directionToAngle(snakeDirection, angle) {
    switch (snakeDirection) {
      case 0:
        return angle < 90 ? angle + 270 : angle - 90;
      case 1:
        return angle > 270 ? angle - 270 : angle + 90;
      case 2:
        return angle < 180 ? 180 + angle : angle - 180;
      case 3:
        return angle;
    }
  }

  distance(location, destination) {
    return Math.sqrt(
      Math.pow(destination[0] - location[0], 2) +
        Math.pow(destination[1] - location[1], 2) * 1.0
    );
  }

  move(direction) {
    this.moves++;
    this.movesSinceLastScore++;
    this.snake.move(direction);
    this.checkEdge();
    // this.checkBody();
    this.checkApple();
    this.setDistances();
  }

  checkEdge() {
    if (
      (this.snake.body[0][0] < 0) |
      (this.snake.body[0][0] > this.rows - 1) |
      (this.snake.body[0][1] < 0) |
      (this.snake.body[0][1] > this.cols - 1)
    ) {
      this.gameOver = true;
    }
  }

  checkBody() {
    for (let i = 1; i < this.snake.body.length - 1; i++) {
      if (
        this.snake.body[0][0] == this.snake.body[i][0] &&
        this.snake.body[0][1] == this.snake.body[i][1]
      ) {
        this.gameOver = true;
        return;
      }
    }
  }

  checkApple() {
    if (
      this.snake.body[0][0] == this.apple[0] &&
      this.snake.body[0][1] == this.apple[1]
    ) {
      this.applesCollected += 1;
      this.apple = [
        Math.floor(Math.random() * Math.floor(this.rows - 1)),
        Math.floor(Math.random() * Math.floor(this.cols - 1))
      ];
      this.snake.expand();
      this.totalScore += 1;
      this.movesSinceLastScore = 0;
    }
  }
}
