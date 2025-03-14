/**
 * Main application entry point
 * Initializes the game and sets up event listeners
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const domElements = {
        inputCellsContainer: document.getElementById('input-cells'),
        targetCellsContainer: document.getElementById('target-cells'),
        evolutionContainer: document.getElementById('evolution-container'),
        evolutionCellsContainer: document.getElementById('evolution-cells'),
        feedbackElement: document.getElementById('feedback'),
        levelElement: document.getElementById('level'),
        difficultySelect: document.getElementById('difficulty'),
        rulesDisplay: document.getElementById('rules-display'),
        rulesContainer: document.getElementById('rules-container'),
        evolveBtn: document.getElementById('evolve-btn'),
        resetBtn: document.getElementById('reset-btn'),
        newPuzzleBtn: document.getElementById('new-puzzle-btn'),
        revealRulesBtn: document.getElementById('reveal-rules-btn')
    };
    
    // Initialize game
    Game.init(domElements);
    
    // Add event listeners
    domElements.evolveBtn.addEventListener('click', Game.evolvePattern);
    
    domElements.resetBtn.addEventListener('click', Game.resetGame);
    
    domElements.newPuzzleBtn.addEventListener('click', function() {
        Game.resetGame();
        Game.generatePuzzle();
    });
    
    domElements.revealRulesBtn.addEventListener('click', Game.toggleRulesDisplay);
    
    domElements.difficultySelect.addEventListener('change', function() {
        Game.updateDifficulty();
        Game.resetLevel();
    });
});