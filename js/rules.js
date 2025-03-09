/**
 * Rules module for the Cellular Automata Puzzle game
 * Handles rule generation and pattern evolution
 */
const Rules = (function() {
    // Rule presets by difficulty
    const RULE_OPTIONS = {
        easy: [30, 90, 110],
        medium: [54, 73, 22],
        hard: [45, 105, 150]
    };

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
     * Generates a random ruleset based on difficulty
     * @param {string} difficulty - The difficulty level (easy, medium, hard)
     * @return {object} A randomly selected ruleset
     */
    function generateRuleSet(difficulty) {
        const options = RULE_OPTIONS[difficulty] || RULE_OPTIONS.easy;
        const ruleNumber = options[Math.floor(Math.random() * options.length)];
        return numberToRuleSet(ruleNumber);
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

    /**
     * Generates a random pattern of a given length
     * @param {number} length - The length of the pattern
     * @return {Array} A random binary pattern
     */
    function generateRandomPattern(length) {
        const pattern = new Array(length).fill(0);
        const activeCells = Math.floor(length / 3);
        
        for (let i = 0; i < activeCells; i++) {
            const randomIndex = Math.floor(Math.random() * length);
            pattern[randomIndex] = 1;
        }
        
        return pattern;
    }

    // Public API
    return {
        numberToRuleSet,
        generateRuleSet,
        evolveGeneration,
        evolvePattern,
        generateRandomPattern
    };
})();