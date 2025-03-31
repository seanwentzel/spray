/**
 * Rules module for the Cellular Automata Puzzle game
 * Handles rule generation and pattern evolution
 */
const Rules = (function() {
    /**
     * Converts a Wolfram rule number (0-255) to a ruleset object
     * @param {number} ruleNumber - The rule number to convert
     * @return {object} A ruleset mapping neighborhoods to next states
     */
    function numberToRuleSet(ruleNumber) {
        const ruleSet = {};
        for (let i = 0; i < 8; i++) {
            const neighborhood = i.toString(2).padStart(3, '0');
            const nextState = (ruleNumber >> i) & 1;
            ruleSet[neighborhood] = nextState;
        }
        return ruleSet;
    }

    /**
     * Evolves a generation based on the given ruleset
     * @param {Array} currentGen - The current generation state
     * @param {object} ruleSet - The ruleset to apply
     * @return {Array} The next generation state
     */
    function evolveGeneration(currentGen, ruleSet) {
        const nextGen = new Array(currentGen.length).fill(0);
        
        for (let i = 0; i < currentGen.length; i++) {
            const left = i > 0 ? currentGen[i-1] : currentGen[currentGen.length-1];
            const center = currentGen[i];
            const right = i < currentGen.length-1 ? currentGen[i+1] : currentGen[0];
            
            const neighborhood = `${left}${center}${right}`;
            nextGen[i] = ruleSet[neighborhood];
        }
        
        return nextGen;
    }

    /**
     * Evolves a pattern through multiple generations
     * @param {Array} inputPattern - The initial pattern
     * @param {object} ruleSet - The ruleset to apply
     * @param {number} generations - Number of generations to evolve
     * @return {Array} An array of generations, including the input
     */
    function evolvePattern(inputPattern, ruleSet, generations) {
        const history = [inputPattern];
        let currentGen = inputPattern;
        
        for (let gen = 0; gen < generations; gen++) {
            currentGen = evolveGeneration(currentGen, ruleSet);
            history.push([...currentGen]);
        }
        
        return history;
    }

    // Public API
    return {
        numberToRuleSet,
        evolveGeneration,
        evolvePattern
    };
})();