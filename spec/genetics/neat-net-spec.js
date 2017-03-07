require('jasmine');
let NeatNet = require('../../src/genetics/neat-neat');
let Genome = require('../../src/genetics/genome');

describe('NeatNet', () => {
    let genome;
    let net;

    beforeEach(() => {
        genome = new Genome();

        net = new NeatNet(genome);
    });


});
