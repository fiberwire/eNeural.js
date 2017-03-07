let chance = new (require('chance'))();

class Genome {

    constructor(options, sequence = []) {
        if (sequence === null || sequence.length === 0) {
            sequence = this.randomSequence(options.sequenceLength);
        }

        this.sequence = sequence;
        this.options = options;
    }

    get nucleotides() {
        var nuc = []

        for (let i = 0; i < this.sequence.length / this.options.nucleotideLength; i++) {
            nuc.unshift(
                this.sequence
                    .slice(i * this.options.nucleotideLength, this.sequence.length) //skip values that are already buffered
                    .slice(0, this.options.nucleotideLength)
                    .reduce((average, i) => {
                        return (average + i) / 2;
                    })
            );
        }

        return nuc;
    }


    randomSequence(sequenceLength) {
        let seq = [];

        for (let i = 0; i < sequenceLength; i++) {
            seq.unshift(chance.floating({min: -1, max: 1}));
        }

        return seq;
    }

    mutate() {
        let mutatedSeq = [];

        for (let i = 0; i < this.sequence.length; i++) {
            if (chance.floating({min: 0, max: 1}) <= this.options.mutateChance) {
                mutatedSeq.unshift(chance.floating({min: 0, max: 1}));
            }
            else {
                mutatedSeq.unshift(this.sequence[i]);
            }
        }

        return new Genome(this.options, mutatedSeq);
    }
}

module.exports = Genome;