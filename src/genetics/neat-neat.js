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
    }

    //create and return input layer
    get inputLayer() {
        //create layer
        let input = new Layer(this.options.inputSize);

        //set biases for neurons
        input.neurons().forEach(n => {
            n.bias = this.nucleotides.shift();
            return n;
        });

        return input;
    }

    //create and return hidden layers as an array of layers
    get hiddenLayers() {

        let layers = [];

        //determine how many layers there should be
        let numLayers = this.lerpToInt(
            this.options.minHiddenLayers,
            this.options.maxHiddenLayers,
            this.nucleotides.shift()
        );

        for (let i = 0; i < numLayers; i++) { //for each layer

            //determine how many neurons the layer should have
            let numNeurons = this.lerpToInt(
                this.options.minHiddenNeurons,
                this.options.maxHiddenNeurons,
                this.nucleotides.shift()
            );

            //create layer
            let layer = new Layer(numNeurons);

            //set biases of neurons
            layer.neurons().forEach(n => {
               n.bias = this.nucleotides.shift();
               return n;
            });

            layers.unshift(layer);
        }

        return layers;
    }

    lerp(min, max, t) {
        return (min * (1.0 - t)) + (max * t);
    }

    lerpToInt(min, max, t) {
        return math.round((min * (1.0 - t)) + (max * t));
    }

}

module.exports = NeatNet;