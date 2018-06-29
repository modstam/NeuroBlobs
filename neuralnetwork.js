function sigmoid(n) {
    return 1 / (1 + (Math.exp(-n)))
}

function dsigmoid_true(n) {
    return sigmoid(n) * (1 - sigmoid(n));
}

function randomize(n) {
    return (Math.random() * 2) - 1;
}

var linAlg = new linearAlgebra(),
    Vector = linAlg.Vector,
    Matrix = linAlg.Matrix;

class NeuralNetwork {
    constructor(layers, mutation_rate) {
        if (!(layers instanceof Array)) {
            console.log("input should be an array with length representing number " +
                "of layers and each value the number of neurons in the layer");
        } else {
            this.layers = layers;
            this.weights = new Array(this.layers.length);
            this.biases = new Array(this.layers.length);
            this.w_deltas = new Array(this.layers.length);
            this.b_deltas = new Array(this.layers.length);
            this.activations = new Array(this.layers.length);
            this.unActivatedValues = new Array(this.layers.length);
            this.mutation_rate = mutation_rate;

            //create random weights and biases for connections between each layer (i, i + 1)
            for (var i = 1; i < this.layers.length; i++) {
                this.weights[i] = Matrix.zero(this.layers[i], this.layers[i - 1]).eleMap(randomize);
                this.biases[i] = Matrix.zero(this.layers[i], 1).eleMap(randomize);
                this.w_deltas[i] = Matrix.zero(this.layers[i], this.layers[i - 1]);
                this.b_deltas[i] = Matrix.zero(this.layers[i], 1);
            }
        }
    }

    feedForward(inputs) {
        this.activations[0] = Matrix.reshapeFrom(inputs, inputs.length, 1);
        for (var i = 1; i < this.layers.length; i++) {
            var prevActivation = this.activations[i - 1];
            this.unActivatedValues[i] = this.weights[i].dot(prevActivation);
            this.unActivatedValues[i] = this.unActivatedValues[i].plus(this.biases[i]);
            this.activations[i] = this.unActivatedValues[i].eleMap(sigmoid);
        }
        return this.activations[this.activations.length - 1];
    }

    backPropagate(outputs, targets, learningRate) {
        var numL = this.layers.length;
        var input_targets = Matrix.reshapeFrom(targets, targets.length, 1);

        var sigmoid_prime = this.unActivatedValues[numL - 1].eleMap(dsigmoid_true);
        var l_error = outputs.minus(input_targets).mul(sigmoid_prime);
        this.b_deltas[numL - 1] = l_error;
        this.w_deltas[numL - 1] = l_error.dot(this.activations[numL - 2].trans());

        for (var i = numL - 2; i > 0; i--) {
            sigmoid_prime = this.unActivatedValues[i].eleMap(dsigmoid_true);
            var l_error = this.weights[i + 1].trans().dot(l_error).mul(sigmoid_prime);
            this.b_deltas[i] = l_error;
            this.w_deltas[i] = l_error.dot(this.activations[i - 1].trans());
        }

        //update all weights, biases with deltas
        for (var i = 1; i < numL; i++) {
            var w_update = this.w_deltas[i].mulEach(learningRate);
            var b_update = this.b_deltas[i].mulEach(learningRate);

            this.weights[i] = this.weights[i].minus(w_update);
            this.biases[i] = this.biases[i].minus(b_update);
        }
    }

    train(inputs, targets, learningRate) {
        var result = this.feedForward(inputs);
        this.backPropagate(result, targets, learningRate);
    }

    clone() {
        var nn = new NeuralNetwork(this.layers);
        for (var i = 1; i < this.layers.length; i++) {
            nn.weights[i] = this.weights[i].clone();
            nn.biases[i] = this.biases[i].clone();
        }
        return nn;
    }

    mutate() {
        for (var i = 1; i < this.weights.length; i++) {
            this.weights[i].eleMap(mutation);
            this.biases[i].eleMap(mutation);
        }
    }

    mutation(n) {
        var prob = Math.random();
        if (prob <= mutation_rate) {
            return n += (Math.random() * 1) - 0.5;
        }
        return n;
    }

}