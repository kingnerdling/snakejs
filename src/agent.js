class Agent {
  constructor(game, model) {
    this.game = game;
    this.memory = [];
    this.applesCollected = 0;
    this.agentScore = 0;
    this.moves = 0;
    this.neuralNetwork = new NeuralNetwork(5, 16, 3, model);
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

    var inputs = this.generateInputs();
    var selectedTurn = this.selectTurn(inputs, this.randomRate);
    var moveScore = this.AvoidedBody(selectedTurn);
    this.game.move(selectedTurn);

    if (this.game.movesSinceLastScore > 200) {
      this.game.gameOver = true;
      return;
    }

    if (this.game.gameOver == false) {
      if (this.game.applesCollected > this.applesCollected) {
        this.applesCollected++;
        moveScore = +500;
      } else if (this.game.dtoApple < dtoApple) {
        moveScore = +1;
      }

      this.agentScore += moveScore;
      dtoApple = this.game.dtoApple;
      if (moveScore > 0) {
        this.AddToMemory(inputs, selectedTurn, moveScore);
      }
    }
  }

  AddToMemory(inputs, label, score) {
    if (this.memory.find(o => o.name == inputs.join("|")) == null) {
      for (let i = 0; i < score; i++) {
        this.memory.push({
          name: inputs.join("|"),
          inputs: inputs,
          label: label,
          score: score
        });
      }
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
    if (this.memory.length > 1000) {
      let randomSample = this.memory
        .sort(() => 0.5 - Math.random())
        .slice(0, 1000);

      this.memory.splice(0, 1000);

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
    if (Math.random() < rate) {
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
      this.game.snake.movingDirection / 4,
      this.game.dtoFront / 25,
      this.game.dtoLeft / 25,
      this.game.dtoRight / 25
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
