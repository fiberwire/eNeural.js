require('jasmine');
let NeatNet = require('../../src/genetics/neat-net');
let Genome = require('../../src/genetics/genome');
let testOptions = require('../../src/options/test.json');

let rx = require('rx');
let synaptic = require('synaptic');
let Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
let math = require('mathjs');


describe('NeatNet', () => {
    let genome;
    let net;

    beforeEach(() => {
        genome = new Genome(testOptions);
        net = new NeatNet(genome);
    });

    describe('.inputLayer', () => {
        let layer;

        beforeEach(() => {
            layer = net.inputLayer;
        });

        it('Should produce a synaptic.Layer object', () => {
            expect(typeof layer).toEqual(typeof new Layer(1));
        });

        it(`Should produce a layer with ${testOptions.inputSize} neurons`, () => {
            expect(layer.neurons().length).toEqual(testOptions.inputSize);
        });
    });

    describe('.hiddenLayers', () => {
        let layers;

        beforeEach(() => {
            layers = net.hiddenLayers;
        });

        it(`Should produce an array of synaptic.Layers`, () => {
            layers.forEach(layer => {
                expect(typeof layer).toEqual(typeof new Layer(1));
            });
        });

        it(`Should produce an array of layers of length between ${testOptions.minHiddenLayers} and ${testOptions.maxHiddenLayers}`, () => {
            expect(layers.length).not.toBeLessThan(testOptions.minHiddenLayers);
            expect(layers.length).not.toBeGreaterThan(testOptions.maxHiddenLayers);
        })
    });

    describe('.outputLayer', () => {
        let layer;

        beforeEach(() => {
            layer = net.inputLayer;
        });

        it(`Should produce a synaptic.Layer object`, () => {
            expect(typeof layer).toEqual(typeof new Layer(1))
        });

        it(`Should produce a layer with ${testOptions.outputSize} neurons`, () => {
            expect(layer.neurons().length).toEqual(testOptions.outputSize);
        });

    });

    describe('.createNetwork()', () => {
        let network;

        beforeEach(() => {
            network = net.createNetwork();
        });

        it(`Should produce a synaptic.Network`, () => {
            expect(typeof net).toEqual(typeof new Network())
        });

        it(`Should produce a network with the correct number of neurons in the input and output layers`, () => {
            expect(network.layers.input.neurons().length).toEqual(testOptions.inputSize);
            expect(network.layers.output.neurons().length).toEqual(testOptions.outputSize);
        });

        it(`Should produce a network with the correct number of hidden layers`, () => {
            expect(network.layers.hidden.length).not.toBeLessThan(testOptions.minHiddenLayers);
            expect(network.layers.hidden.length).not.toBeGreaterThan(testOptions.maxHiddenLayers);
        });

        it(`Should produce a network with the correct number of neurons per hidden layer`, () => {
           network.layers.hidden.forEach(layer => {
               expect(layer.neurons().length).not.toBeLessThan(testOptions.minHiddenNeurons);
               expect(layer.neurons().length).not.toBeGreaterThan(testOptions.maxHiddenNeurons);
           }) ;
        });
    });

    describe('.lerp()', () => {

        it(`Should produce 0.5`, () => {
            expect(net.lerp(0, 1, 0.5)).toEqual(0.5);
        });
    });

});
