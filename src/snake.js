class Snake {
  constructor(currDirection, position) {
    this.movingDirection = currDirection;
    this.body = [position];
    this.grow = false;
    this.moves = [];
    this.allowedTurns = this.populateAllowedTurns();
  }

  move(turn) {
    this.movingDirection = this.newDirection(this.movingDirection, turn);

    var lastSection = [
      this.body[this.body.length - 1][0],
      this.body[this.body.length - 1][1]
    ];

    for (let index = this.body.length - 1; index > 0; index--) {
      this.body[index][0] = this.body[index - 1][0];
      this.body[index][1] = this.body[index - 1][1];
    }

    var nextPos = this.headNextPosition(this.movingDirection);
    this.body[0] = nextPos;
    if (this.grow) {
      this.body.push(lastSection);
      this.grow = false;
    }
  }

  headNextPosition(direction) {
    switch (direction) {
      case 0:
        return [this.body[0][0], this.body[0][1] - 1];
      case 1:
        return [this.body[0][0], this.body[0][1] + 1];
      case 2:
        return [this.body[0][0] + 1, this.body[0][1]];
      case 3:
        return [this.body[0][0] - 1, this.body[0][1]];
    }
  }

  expand() {
    this.grow = true;
  }

  newDirection(currentDirection, turn) {
    var dir = this.allowedTurns.get(`${currentDirection},${turn}`);
    if (dir != null) {
      return dir;
    }
    return currentDirection;
  }

  populateAllowedTurns() {
    var allowedTurns = new Map();
    //north
    allowedTurns.set("0,0", 0);
    allowedTurns.set("0,1", 3);
    allowedTurns.set("0,2", 2);
    //south
    allowedTurns.set("1,0", 1);
    allowedTurns.set("1,1", 2);
    allowedTurns.set("1,2", 3);
    //east
    allowedTurns.set("2,0", 2);
    allowedTurns.set("2,1", 0);
    allowedTurns.set("2,2", 1);
    //west
    allowedTurns.set("3,0", 3);
    allowedTurns.set("3,1", 1);
    allowedTurns.set("3,2", 0);

    return allowedTurns;
  }
}

const direction = {
  NORTH: 0,
  SOUTH: 1,
  EAST: 2,
  WEST: 3
};
