let rx = require('rx');
let synaptic = require('synaptic');
let Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
let math = require('mathjs');

class NeatNet {

    constructor(genome) {
        this.genome = genome;
        this.options = genome.options;
        this.nucleotides = genome.nucleotides;

        this.net = this.createNetwork();
    }

    createNetwork() {

        let input = this.inputLayer;
        let hidden = this.hiddenLayers;
        let output = this.outputLayer;

        this.connectLayers(input, hidden, output);

        let net = new Network({
            input: input,
            hidden: hidden,
            output: output
        });

        return net;
    }

    mutate(){
        this.genome = this.genome.mutate();
        this.net = this.createNetwork();
    }

    get weight() {
        let weight = this.lerp(
            this.options.minWeight,
            this.options.maxWeight,
            this.nucleotides.shift()
        );
        return weight;
    }

    //create and return input layer
    get inputLayer() {
        //create layer
        let input = new Layer(this.options.inputSize);

        //set biases for neurons
        input.neurons().forEach(n => {
            n.bias = this.weight;
        });

        return input;
    }

    //create and return hidden layers as an array of layers
    get hiddenLayers() {

        let layers = [];

        //determine how many layers there should be
        let numLayers = math.round(
            this.lerp(
                this.options.minHiddenLayers,
                this.options.maxHiddenLayers,
                this.nucleotides.shift()
            )
        );

        for (let i = 0; i < numLayers; i++) { //for each layer

            //determine how many neurons the layer should have
            let numNeurons = math.round(
                this.lerp(
                    this.options.minHiddenNeurons,
                    this.options.maxHiddenNeurons,
                    this.nucleotides.shift()
                )
            );

            //create layer
            let layer = new Layer(numNeurons);

            //set biases of neurons
            layer.neurons().forEach(n => {
                n.bias = this.weight;
            });

            layers.unshift(layer);
        }

        return layers;
    }

    get outputLayer() {
        let output = new Layer(this.options.outputSize);

        output.neurons().forEach(n => {
            n.bias = this.weight;
        });

        return output;
    }

    getWeights(n) {
        let weights = [];
        for (let i = 0; i < n; i++) {
            weights.unshift(this.weight);
        }
        return weights;
    }

    connectLayers(input, hidden, output) {
        this.connectInputToHidden(input, hidden);
        this.connectHidden(hidden);
        this.connectHiddenToOutput(hidden, output);
    }

    connectInputToHidden(input, hidden) {
        input.project(
            hidden[0],
            Layer.connectionType.ALL_TO_ALL,
            this.getWeights(input.neurons().length * hidden[0].neurons().length)
        );
    }

    connectHidden(hidden) {
        for (let i = 0; i < hidden.length - 1; i++) {
            hidden[i].project(
                hidden[i + 1],
                Layer.connectionType.ALL_TO_ALL,
                this.getWeights(hidden[i].neurons().length * hidden[i + 1].neurons().length)
            );
        }
    }

    connectHiddenToOutput(hidden, output) {
        hidden[hidden.length - 1].project(
            output,
            Layer.connectionType.ALL_TO_ALL,
            this.getWeights(hidden[hidden.length - 1].neurons().length * output.neurons().length)
        );
    }

    lerp(min, max, t) {
        let value = (min * (1.0 - t)) + (max * t);
        return value;
    }

}

module.exports = NeatNet;