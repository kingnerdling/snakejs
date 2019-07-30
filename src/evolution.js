class Evolution {
  nextGeneration(agents, rate) {
    var topAgentGeneration = this.topAgent(agents);
    if (
      this.topAgentEver == null ||
      topAgentGeneration.fitness() > this.topAgentEver.fitness()
    ) {
      this.topAgentEver = topAgentGeneration;
    }

    var nextGenAgents = [];
    var game = new Game(20, 20);
    for (let i = 0; i < agents.length - 1; i++) {
      nextGenAgents.push(
        new Agent(game, topAgentGeneration.neuralNetwork.copy())
      );
    }

    this.evolve(nextGenAgents, rate);
    nextGenAgents.push(this.topAgentEver);
    return nextGenAgents;
  }

  topAgent(agents) {
    var topAgents = agents.sort(function(a, b) {
      return b.fitness() - a.fitness();
    });

    return topAgents[0];
  }

  evolve(agents, rate) {
    agents.forEach(agent => {
      this.mutate(agent.neuralNetwork.model, rate);
    });
  }

  randomNumber(min, max) {
    var r = Math.random() * (max - min) + min;

    return r;
  }

  mutate(model, rate) {
    tf.tidy(() => {
      const weights = model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j++) {
          if (Math.random() > rate) {
            let w = values[j];
            values[j] =  this.randomNumber(-1, 1);
          }
        }
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      model.setWeights(mutatedWeights);
    });
  }
}
