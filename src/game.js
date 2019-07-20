class Game {
  constructor(rows, cols) {
    this.lastScore = 0;
    this.totalScore = 0;
    this.rows = rows;
    this.cols = cols;
    this.board = new Board(rows, cols);
    this.snake = new Snake(direction.EAST, [5, 4]);
    this.apple = [
      Math.floor(Math.random() * Math.floor(this.rows)),
      Math.floor(Math.random() * Math.floor(this.cols))
    ];
  }

  move(direction) {
    this.snake.move(direction);
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
