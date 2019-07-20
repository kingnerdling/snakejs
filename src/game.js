class Game {
  constructor(rows, cols) {
    this.lastScore = 0;
    this.totalScore = 0;
    this.rows = rows;
    this.cols = cols;
    this.snake = new Snake(direction.EAST, [5, 4]);
    this.apple = [
      Math.floor(Math.random() * Math.floor(this.rows)),
      Math.floor(Math.random() * Math.floor(this.cols))
    ];
    this.gameOver = false;
  }

  move(direction) {
    this.snake.move(direction);
    this.checkEdge();
    this.checkBody();
    this.checkApple();
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
      this.apple = [
        Math.floor(Math.random() * Math.floor(this.rows - 1)),
        Math.floor(Math.random() * Math.floor(this.cols - 1))
      ];
      this.snake.expand();
      this.totalScore += 1;
    }
  }
}
