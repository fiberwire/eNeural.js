let rx = require('rx');
let synaptic = require('synaptic');
let Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
Perceptron = Architect.Perceptron;
let math = require('mathjs');
let Genome = require('./genome');

class NeatNet {

    constructor(fitnessFunction, options, genome = null) {

        if (genome === null){
            genome = new Genome(options);
        }
        this.genome = genome;
        this.options = options;
        this.nucleotides = genome.nucleotides;
        this.fitnessFunction = fitnessFunction;

        //this.net = this.createNetwork();
        this.net = this.constructNetwork();
        console.log(this.fitness);
    }

    get fitness() {
        return this.fitnessFunction(this.net);
    }

    constructNetwork() {
        let net = new Perceptron(
            this.options.inputSize,
            this.numHiddenLayers,
            this.options.outputSize
        );

        net = this.mapGenome(net);

        return net;
    }

    mapGenome(net) {
        net = this.mapBiases(net);
        net = this.mapWeights(net);

        return net;
    }

    mapBiases(net) {

        //map biases in input layer
        this.mapLayerBiases(net.layers.input);

        //map biases in hidden layers
        net.layers.hidden.forEach(h => {
           this.mapLayerBiases(h);
        });

        //map biases in output layer
        this.mapLayerBiases(net.layers.output);

        return net;
    }

    mapWeights(net) {

        //map weights in input layer
        this.mapLayerWeights(net.layers.input);

        //map weights in hidden layers
        net.layers.hidden.forEach(h => {
            this.mapLayerWeights(h);
        });

        //map weights in output layer
        this.mapLayerWeights(net.layers.output);

        return net;
    }

    mapLayerWeights(layer) {
        layer.neurons().forEach(neuron => {
            for(let id in neuron.connections.projected){
                let connection = neuron.connections.projected[id];
                connection.weight = this.weight;
            }
        });
    }

    mapLayerBiases(layer){
        layer.neurons().forEach(neuron => neuron.bias = this.weight);
    }

    mutate(maxFitness) {

        let fitnessRatio = this.fitness/maxFitness;
        console.log(`Fitness Ratio: ${fitnessRatio}`);
        //mutate genome
        this.genome = this.genome.mutate(fitnessRatio);

        //refresh nucleotides with nucleotides from new genome
        this.nucleotides = this.genome.nucleotides;

        //reconstruct net
        this.net = this.constructNetwork();
    }

    get weight() {
        let weight = this.lerp(
            this.options.minWeight,
            this.options.maxWeight,
            this.nucleotides.shift()
        );
        return weight;
    }

    get numHiddenLayers() {
        let numLayers = math.round(
            this.lerp(
                this.options.minHiddenLayers,
                this.options.maxHiddenLayers,
                this.nucleotides.shift()
            )
        );

        return numLayers;
    }

    getWeights(n) {
        let weights = [];
        for (let i = 0; i < n; i++) {
            weights.unshift(this.weight);
        }
        return weights;
    }

    lerp(min, max, t) {
        let value = (min * (1.0 - t)) + (max * t);
        return value;
    }

}

module.exports = NeatNet;