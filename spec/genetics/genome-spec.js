require('jasmine');
let Genome = require('../../src/genetics/genome');
let options = require('../../src/options/test.json');

describe('genome', () => {

    let genome;

    beforeEach(() => {
        genome = new Genome(options);
    });

    describe('.randomSequence()', () => {

        it('Should produce a sequence of length 10', () => {
            expect(genome.sequence.length).toEqual(10);
        });

        it('Should generate numbers between 0 and 1', () => {
            for (let i of genome.sequence) {
                expect(i).not.toBeLessThan(genome.options.minValue);
                expect(i).not.toBeGreaterThan(genome.options.maxValue);
            }
        });

    });

    describe('.nucleotides', () => {


        it('Should produce an array of numbers', () => {
            expect(genome.nucleotides.length)
                .toEqual(genome.sequence.length / genome.options.nucleotideLength);
        });

        it('Should produce an array of numbers between 0 and 1', () => {
            for (let i of genome.nucleotides) {
                expect(i).not.toBeLessThan(genome.options.minValue);
                expect(i).not.toBeGreaterThan(genome.options.maxValue);
            }
        });
    });

    describe('.mutate', () => {

        it('Should produce a genome', () => {
            expect(typeof genome.mutate()).toEqual(typeof genome)
        });

        it('Should produce a genome with a mutated sequence', () => {
            let mutated = genome.mutate();
            let same = true;

            for (let i = 0; i < genome.sequence.length; i++) {
                if (mutated.sequence[i] !== genome.sequence[i]) {
                    same = false;
                }
            }

            expect(same).toEqual(false);
        });

        it('Should produce a genome with a sequence that has the same length as the original', () => {
            expect(genome.mutate().sequence.length).toEqual(genome.sequence.length);
        })
    });
});
