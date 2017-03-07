let Genome = require('./genetics/genome');
let NeatNet = require('./genetics/neat-neat');
let options = require('./options/test.json');

let gen = new Genome(options);

let net = new NeatNet(gen);