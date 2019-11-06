class Agent {
  constructor(game, model) {
    this.game = game;
    this.memory = [];q
    this.applesCollected = 0;
    this.agentScore = 0;
    this.moves = 0;
    this.neuralNetwork = new NeuralNetwork(1, 16, 3, model);
    this.randomRate = 0.6;
    this.randomMove = false;
    this.maxScore = 0;
  }

  play() {
    this.applesCollected = 0;
    this.agentScore = 0;
    this.moves = 0;

    while (!this.game.gameOver) {
      this.move();
    }
  }

  move() {
    this.moves++;
    var dtoApple = this.game.dtoApple;

    var inputs = this.generateInputs();
    var movesScores = this.movesScore();
    this.AddToMemory(inputs, movesScores);

    var selectedTurn = this.selectTurn(inputs, this.randomRate, movesScores);
    var moveScore = this.AvoidedBody(selectedTurn);
    this.game.move(selectedTurn);

    if (this.game.movesSinceLastScore > 100) {
      this.game.gameOver = true;
      return;
    }

    if (this.game.gameOver) {
      if (this.applesCollected > this.maxScore) {
        this.maxScore = this.applesCollected;
      }
      return;
    }

    if (this.game.applesCollected > this.applesCollected) {
      this.applesCollected++;
      moveScore = +500;
    } else if (this.game.dtoApple < dtoApple) {
      moveScore = +1;
    }

    this.agentScore += moveScore;
    dtoApple = this.game.dtoApple;
  }

  movesScore() {
    var scores = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      var movingDirection = this.game.snake.newDirection(
        this.game.snake.movingDirection,
        i
      );
      var headPos = this.game.snake.headNextPosition(movingDirection);
      if (this.game.checkEdge(headPos[0], headPos[1])) {
        scores[i] = -100;
      }
      if (this.game.checkBody(headPos[0], headPos[1])) {
        scores[i] = -100;
      }
      if (this.game.checkApple(headPos[0], headPos[1])) {
        scores[i] += 99;
      }
      if (this.game.distance(headPos, this.game.apple) < this.game.dtoApple) {
        scores[i] += 10;
      }
      // scores[i] += this.AvoidedBody(i);
    }

    return scores;
  }

  AddToMemory(inputs, label, score) {
    if (this.memory.find(o => o.name == inputs.join("|")) == null) {
      this.memory.push({
        inputs: inputs,
        label: label
      });
    } else {
      console.log("already in memory");
    }
  }

  AvoidedBody(selectedTurn) {
    var score = 0;
    if (this.game.dtoFront < 2 && selectedTurn != 0) {
      score += 2;
    }
    switch (selectedTurn) {
      case 0:
        if (
          this.game.dtoFront > 1 &&
          (this.game.dtoLeft < 2) & (this.game.dtoRight < 2)
        ) {
          score += 100;
        }
        break;
      case 1:
        if (
          this.game.dtoLeft > 1 &&
          (this.game.dtoFront < 2) & (this.game.dtoRight < 2)
        ) {
          score += 100;
        }
        break;
      case 2:
        if (
          this.game.dtoRight > 1 &&
          (this.game.dtoLeft < 2) & (this.game.dtoFront < 2)
        ) {
          score += 100;
        }
        break;
    }
    return score;
  }

  async train() {
    var memLength = 1000;
    if (this.memory.length > memLength) {
      let randomSample = this.memory
        .sort(() => 0.5 - Math.random())
        .slice(0, memLength);

      this.memory.splice(0, memLength);

      var inputs = randomSample.map(x => x.inputs);
      var labels = randomSample.map(x => x.label);
      await this.neuralNetwork.train(inputs, labels);
    }
  }

  selectTurn(inputs, rate, moveScores) {
    var outputs = this.neuralNetwork.predict(inputs);
    var maxIndex = this.max_index(outputs);
    var maxOutput = outputs[maxIndex];
    this.accuracy = maxOutput;
    if (Math.random() < rate) {
      this.randomMove = true;
      return this.max_index(moveScores);
    }
    this.randomMove = false;
    return maxIndex;
  }

  max_index(elements) {
    var i = 1;
    var mi = 0;
    while (i < elements.length) {
      if (!(elements[i] < elements[mi])) mi = i;
      i += 1;
    }
    return mi;
  }

  generateInputs() {
    return this.game.toArray();
  }

  fitness() {
    var fit = this.applesCollected / this.moves;
    return this.agentScore;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
