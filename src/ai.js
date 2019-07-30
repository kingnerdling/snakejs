function run() {
  var generation = 0;
  var game = new Game(20, 20);
  var agents = createAgents(game, 1);
  var evolution = new Evolution();
  var maxScore = 0;
  var maxApplesCollected = 0;
  while (true) {
    console.debug(`gen: ${generation}`);
    agents.forEach(agent => {
      agent.play();

      if (agent.agentScore > maxScore) {
        maxScore = agent.agentScore;
        maxApplesCollected = agent.applesCollected;
      }
      console.debug(
        `mv: ${agent.moves} as: ${agent.agentScore} ac: ${
          agent.applesCollected
        } ms: ${maxScore} ma: ${maxApplesCollected}`
      );
      agent.train();
    });
    generation++;

    // agents = evolution.nextGeneration(agents, 0.3);
    agents.forEach(agent => {
      agent.game = new Game(20, 20);
      agent.agentScore = 0;
    });
  }
}

function createAgents(game, count) {
  var agents = [];
  for (let i = 0; i < count; i++) {
    agents.push(new Agent(game));
  }
  return agents;
}

run();
