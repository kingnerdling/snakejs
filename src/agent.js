class Agent {
  constructor(game, model) {
    this.game = game;
    this.memory = [];
    this.applesCollected = 0;
    this.agentScore = 0;
    this.moves = 0;
    this.neuralNetwork = new NeuralNetwork(2, 16, 3, model);
    this.randomRate = 0.6;
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
    var moveScore = 0;
    var inputs = this.generateInputs();
    var selectedTurn = this.selectTurn(inputs, this.randomRate);
    this.game.move(selectedTurn);

    if (this.game.movesSinceLastScore > 200) {
      this.game.gameOver = true;
      return;
    }

    if (this.game.gameOver == false) {
      if (this.game.applesCollected > this.applesCollected) {
        this.applesCollected++;
        moveScore = 100;
      } else if (this.game.dtoApple < dtoApple) {
        moveScore = 1;
      } else {
        moveScore = 0;
      }

      this.agentScore += moveScore;
      dtoApple = this.game.dtoApple;
      if (moveScore > 0) {
        if (this.memory.find(o => o.name == inputs.join("|")) == null) {
          this.memory.push({
            name: inputs.join("|"),
            inputs: inputs,
            label: selectedTurn,
            score: moveScore
          });
        } else {
          console.log("already in memory");
        }
      }
      if (this.memory.length > 105) {
        this.memory = this.memory.splice(0, 100);
      }
    }
  }

  async train() {
    if (this.memory.length > 100) {
      let randomSample = this.memory
        .sort(() => 0.5 - Math.random())
        .slice(0, 100);
      var inputs = randomSample.map(x => x.inputs);
      var labels = randomSample.map(x => x.label);
      await this.neuralNetwork.train(inputs, labels);
    }
  }

  selectTurn(inputs, rate) {
    var outputs = this.neuralNetwork.predict(inputs);
    var maxIndex = this.max_index(outputs);
    var maxOutput = outputs[maxIndex];
    this.accuracy = maxOutput;
    if (maxOutput < rate) {
      return this.getRandomInt(0, 2);
    }
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

  generateInputs(turn) {
    return [
      this.game.degreesToApple / 360,
      this.game.snake.movingDirection / 4
    ];
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
