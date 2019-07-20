class Snake {
  constructor(direction, position) {
    this.movingDirection = direction;
    this.body = [position];
    this.grow = false;
  }

  move(direction) {
    this.movingDirection = direction;

    var lastSection = [this.body[this.body.length - 1][0],this.body[this.body.length - 1][1]];
    for (let index = this.body.length - 1; index > 0; index--) {
      this.body[index][0] = this.body[index - 1][0];
      this.body[index][1] = this.body[index - 1][1];
    }

    switch (this.movingDirection) {
      case "north":
        this.body[0][1] = this.body[0][1] - 1;
        break;
      case "east":
        this.body[0][0] = this.body[0][0] + 1;
        break;
      case "south":
        this.body[0][1] = this.body[0][1] + 1;
        break;
      case "west":
        this.body[0][0] = this.body[0][0] - 1;
        break;
    }
    if (this.grow) {
      this.body.push(lastSection);
      this.grow = false;
    }
  }

  expand() {
    this.grow = true;
  }

}

const direction = {
  NORTH: "north",
  SOUTH: "south",
  EAST: "east",
  WEST: "west"
};
