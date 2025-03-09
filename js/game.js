/**
 * Game module for the Cellular Automata Puzzle game
 * Handles game state and UI updates
 */
const Game = (function() {
    // Game state
    let state = {
        cellCount: 15,
        generationCount: 3,
        currentRuleSet: null,
        inputPattern: [],
        targetPattern: [],
        evolutionHistory: [],
        currentLevel: 1,
        difficulty: "easy"
    };
    
    // DOM elements
    let elements = {};
    
    /**
     * Initialize game elements and state
     * @param {object} domElements - References to DOM elements
     */
    function init(domElements) {
        elements = domElements;
        updateDifficulty();
        resetGame();
        generatePuzzle();
    }
    
    /**
     * Update difficulty settings
     */
    function updateDifficulty() {
        state.difficulty = elements.difficultySelect.value;
        
        switch(state.difficulty) {
            case "easy":
                state.cellCount = 15;
                state.generationCount = 3;
                break;
            case "medium":
                state.cellCount = 21;
                state.generationCount = 4;
                break;
            case "hard":
                state.cellCount = 31;
                state.generationCount = 5;
                break;
        }
    }
    
    /**
     * Reset the game state
     */
    function resetGame() {
        state.inputPattern = new Array(state.cellCount).fill(0);
        state.evolutionHistory = [];
        elements.evolutionContainer.style.display = 'none';
        elements.feedbackElement.textContent = '';
        elements.feedbackElement.className = 'feedback';
        
        // Clear input cells
        elements.inputCellsContainer.innerHTML = '';
        for (let i = 0; i < state.cellCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => toggleCell(cell));
            elements.inputCellsContainer.appendChild(cell);
        }
    }
    
    /**
     * Generate a new puzzle
     */
    function generatePuzzle() {
        // Generate random rule set based on difficulty
        state.currentRuleSet = Rules.generateRuleSet(state.difficulty);
        
        // Generate random input pattern
        const randomInput = Rules.generateRandomPattern(state.cellCount);
        
        // Evolve the random input to get a target
        const history = Rules.evolvePattern(randomInput, state.currentRuleSet, state.generationCount);
        state.targetPattern = history[history.length - 1];
        
        // Display target pattern
        displayTargetPattern();
        
        // Display rules (hidden initially)
        displayRules();
    }
    
    /**
     * Display the target pattern
     */
    function displayTargetPattern() {
        elements.targetCellsContainer.innerHTML = '';
        for (let i = 0; i < state.cellCount; i++) {
            const cell = document.createElement('div');
            cell.className = state.targetPattern[i] === 1 ? 'cell active' : 'cell';
            elements.targetCellsContainer.appendChild(cell);
        }
    }
    
    /**
     * Display the ruleset (for reveal)
     */
    function displayRules() {
        elements.rulesContainer.innerHTML = '';
        
        for (const [neighborhood, result] of Object.entries(state.currentRuleSet)) {
            const ruleElement = document.createElement('div');
            ruleElement.className = 'rule';
            
            const ruleCellsDiv = document.createElement('div');
            ruleCellsDiv.className = 'rule-cells';
            
            // Convert binary string to array of cells
            for (let i = 0; i < neighborhood.length; i++) {
                const cell = document.createElement('div');
                cell.className = neighborhood[i] === '1' ? 'rule-cell active' : 'rule-cell';
                ruleCellsDiv.appendChild(cell);
            }
            
            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'arrow';
            arrowSpan.textContent = '→';
            
            const resultCell = document.createElement('div');
            resultCell.className = result === 1 ? 'result-cell active' : 'result-cell';
            
            ruleElement.appendChild(ruleCellsDiv);
            ruleElement.appendChild(arrowSpan);
            ruleElement.appendChild(resultCell);
            
            elements.rulesContainer.appendChild(ruleElement);
        }
    }
    
    /**
     * Toggle a cell's state
     * @param {HTMLElement} cell - The cell element to toggle
     */
    function toggleCell(cell) {
        const index = parseInt(cell.dataset.index);
        state.inputPattern[index] = state.inputPattern[index] === 0 ? 1 : 0;
        cell.classList.toggle('active');
        
        // Hide evolution if input changes
        elements.evolutionContainer.style.display = 'none';
        elements.feedbackElement.textContent = '';
        elements.feedbackElement.className = 'feedback';
    }
    
    /**
     * Evolve the current pattern according to the rules
     */
    function evolvePattern() {
        state.evolutionHistory = Rules.evolvePattern(
            state.inputPattern, 
            state.currentRuleSet, 
            state.generationCount
        );
        
        displayEvolution();
        checkSolution();
    }
    
    /**
     * Display the evolution of the pattern
     */
    function displayEvolution() {
        elements.evolutionContainer.style.display = 'block';
        elements.evolutionCellsContainer.innerHTML = '';
        
        for (let gen = 0; gen < state.evolutionHistory.length; gen++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'cell-row';
            
            for (let i = 0; i < state.cellCount; i++) {
                const cell = document.createElement('div');
                cell.className = state.evolutionHistory[gen][i] === 1 ? 'cell active' : 'cell';
                rowDiv.appendChild(cell);
            }
            
            elements.evolutionCellsContainer.appendChild(rowDiv);
        }
    }
    
    /**
     * Check if the solution matches the target
     */
    function checkSolution() {
        const finalGen = state.evolutionHistory[state.evolutionHistory.length - 1];
        let matches = true;
        
        for (let i = 0; i < state.cellCount; i++) {
            if (finalGen[i] !== state.targetPattern[i]) {
                matches = false;
                break;
            }
        }
        
        if (matches) {
            elements.feedbackElement.textContent = "Success! You found a pattern that produces the target.";
            elements.feedbackElement.className = 'feedback success';
            state.currentLevel++;
            elements.levelElement.textContent = state.currentLevel;
        } else {
            elements.feedbackElement.textContent = "Not quite. Try a different pattern.";
            elements.feedbackElement.className = 'feedback failure';
        }
    }
    
    /**
     * Toggle rule display visibility
     */
    function toggleRulesDisplay() {
        elements.rulesDisplay.style.display = 
            elements.rulesDisplay.style.display === 'none' ? 'block' : 'none';
    }
    
    /**
     * Reset level counter and generate new puzzle
     */
    function resetLevel() {
        state.currentLevel = 1;
        elements.levelElement.textContent = state.currentLevel;
        resetGame();
        generatePuzzle();
    }
    
    // Public API
    return {
        init,
        updateDifficulty,
        resetGame,
        generatePuzzle,
        evolvePattern,
        toggleRulesDisplay,
        resetLevel
    };
})();