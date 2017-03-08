let Genome = require('./genetics/genome');
let NeatNet = require('./genetics/neat-net');
let options = require('./options/test.json');
let math = require('mathjs');

let xor = (neat) => {
    let input = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
    ]

    let expected = [
        [0],
        [1],
        [1],
        [0]
    ]

    let output = []

    for( let i = 0; i < input.length; i++){
        output.unshift(neat.net.activate(input[i]));
    }

    return 1 - math.mean(math.abs(math.subtract(expected, output)));
}

//let gen = new Genome(options);

let neats = []

for( let i = 0; i < 1; i++){
    neats.unshift(new NeatNet(new Genome(options), xor));
}

let getMaxFitness = (population) => {
    var fitnesses = population.map(neat => neat.fitness);
    return math.max(fitnesses);
}

console.log(`Max fitness: ${getMaxFitness(neats)}`);

while(getMaxFitness(neats) < .75){
    neats.forEach(neat => {
        neat.mutate();
        console.log(neat.fitness);
    });
}
