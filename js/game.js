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
        levels: [
            {
                cellCount: 15,
                generationCount: 3,
                ruleSet: { "111": 0, "110": 1, "101": 1, "100": 0, "011": 1, "010": 0, "001": 0, "000": 1 },
                inputPattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
            },
            {
                cellCount: 21,
                generationCount: 4,
                ruleSet: { "111": 1, "110": 0, "101": 0, "100": 1, "011": 0, "010": 1, "001": 1, "000": 0 },
                inputPattern: [1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1]
            }
            // Add more levels as needed
        ]
    };
    
    // DOM elements
    let elements = {};
    
    /**
     * Initialize game elements and state
     * @param {object} domElements - References to DOM elements
     */
    function init(domElements) {
        elements = domElements;
        loadLevel(state.currentLevel);
    }
    
    /**
     * Load a specific level
     * @param {number} level - The level to load
     */
    function loadLevel(level) {
        const levelData = state.levels[level - 1];
        if (!levelData) {
            console.error("Level data not found for level:", level);
            return;
        }
        
        state.cellCount = levelData.cellCount;
        state.generationCount = levelData.generationCount;
        state.currentRuleSet = levelData.ruleSet;
        state.inputPattern = [...levelData.inputPattern];
        
        // Compute the target pattern dynamically
        state.targetPattern = Rules.evolvePattern(
            state.inputPattern,
            state.currentRuleSet,
            state.generationCount
        ).pop();
        
        resetGame();
        displayTargetPattern();
        displayRules();
    }
    
    /**
     * Reset the game state
     */
    function resetGame() {
        state.inputPattern = new Array(state.cellCount).fill(0); // Start with a blank input pattern
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
        
        for (let gen = state.evolutionHistory.length - 1; gen >= 1; gen--) {
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
            loadLevel(state.currentLevel);
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
        loadLevel(state.currentLevel);
    }
    
    // Public API
    return {
        init,
        resetGame,
        evolvePattern,
        toggleRulesDisplay,
        resetLevel,
        loadLevel
    };
})();