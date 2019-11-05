class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes, model) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
    this.model = model == null ? this.createModel() : model;
    this.canTrain = true;
  }

  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      return modelCopy;
    });
  }

  predict(inputs) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs = ys.dataSync();
      // console.log(outputs);
      return outputs;
    });
  }

  async train(x, y) {
    var xs = tf.tensor2d(x);
    var ys = tf.tensor2d(y);
    if (this.canTrain == true) {
      this.canTrain = false;
      await this.model
        .fit(xs, ys, { epochs: 5, batchSize: 32, onBatchEnd: onBatchEnd() })
        .then(info => {
          this.canTrain = true;
        });
    }
  }

  createModel() {
    var model = tf.sequential();

    model.add(
      tf.layers.dense({
        inputShape: [this.input_nodes],
        units: this.hidden_nodes,
        activation: "relu"
      })
    );

    model.add(
      tf.layers.dense({
        units: this.hidden_nodes / 2,
        activation: "relu"
      })
    );

    model.add(
      tf.layers.dense({
        units: this.output_nodes,
       })
    );

    model.compile({
      optimizer: "adam",
      loss: "meanSquaredError",
      metrics: ["mse"]
    });

    return model;
  }

  async save(path) {
    return await this.model.save(path);
  }

  async loadModel(path) {
    var model = await tf.loadLayersModel(path);
    model.compile({
      optimizer: "adam",
      loss: "meanSquaredError",
      metrics: ["mse"]
    });

    return model;
  }
}

function onBatchEnd(batch, logs) {
  this.canTrain = true;
}
