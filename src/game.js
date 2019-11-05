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
    this.degreesToApple = this.calcDegressToApple();
    this.setDistancesAround(this.snake.movingDirection);
  }

  setDistancesAround(direction) {
    var distances = this.DistanceInDirections();
    switch (direction) {
      case 0: //north
        this.dtoFront = distances.north;
        this.dtoLeft = distances.west;
        this.dtoRight = distances.east;
        break;
      case 1: //south
        this.dtoFront = distances.south;
        this.dtoLeft = distances.east;
        this.dtoRight = distances.west;
        break;
      case 2: //east
        this.dtoFront = distances.east;
        this.dtoLeft = distances.north;
        this.dtoRight = distances.south;
        break;
      case 3: //west
        this.dtoFront = distances.west;
        this.dtoLeft = distances.south;
        this.dtoRight = distances.north;
        break;
    }
  }

  DistanceInDirections() {
    var head = this.snake.body[0];
    var obsticles = [];

    Array.prototype.push.apply(
      obsticles,
      this.snake.body.slice(1, this.snake.body.length - 1)
    );
    obsticles.push(
      [head[0], -1],
      [head[0], this.cols],
      [-1, head[1]],
      [this.rows, head[1]]
    );

    var north =
      head[1] -
      Math.max(
        ...obsticles
          .filter(x => x[0] == head[0] && x[1] <= head[1])
          .map(x => x[1])
      );

    var south =
      Math.min(
        ...obsticles
          .filter(x => x[0] == head[0] && x[1] >= head[1])
          .map(x => x[1])
      ) - head[1];
    var west =
      head[0] -
      Math.max(
        ...obsticles
          .filter(x => x[1] == head[1] && x[0] <= head[0])
          .map(x => x[0])
      );
    var east =
      Math.min(
        ...obsticles
          .filter(x => x[1] == head[1] && x[0] >= head[0])
          .map(x => x[0])
      ) - head[0];
    return { north: north, south: south, east: east, west: west };
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
    if (this.checkEdge(this.snake.body[0][0], this.snake.body[0][1])) {
      this.gameOver = true;
    }
    if (this.checkBody(this.snake.body[0][0], this.snake.body[0][1])) {
      this.gameOver = true;
    }
    if (this.checkApple(this.snake.body[0][0], this.snake.body[0][1])) {
      this.applesCollected += 1;
      this.apple = [
        Math.floor(Math.random() * Math.floor(this.rows - 1)),
        Math.floor(Math.random() * Math.floor(this.cols - 1))
      ];
      this.snake.expand();
      this.totalScore += 1;
      this.movesSinceLastScore = 0;
    }
    if (!this.gameOver) {
      this.setDistances();
    }
  }

  checkEdge(x, y) {
    if ((x < 0) | (x > this.rows - 1) | (y < 0) | (y > this.cols - 1)) {
      return true;
    }
  }

  checkBody(x, y) {
    for (let i = 1; i < this.snake.body.length - 1; i++) {
      if (x == this.snake.body[i][0] && y == this.snake.body[i][1]) {
        return true;
      }
    }
  }

  checkApple(x, y) {
    if (x == this.apple[0] && y == this.apple[1]) {
      return true;
    }
  }
}
