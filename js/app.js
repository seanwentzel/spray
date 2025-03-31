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
        rulesDisplay: document.getElementById('rules-display'),
        rulesContainer: document.getElementById('rules-container'),
        evolveBtn: document.getElementById('evolve-btn'),
        resetBtn: document.getElementById('reset-btn'),
        newPuzzleBtn: document.getElementById('new-puzzle-btn'),
        revealRulesBtn: document.getElementById('reveal-rules-btn')
    };
    
    // Initialize game
    Game.init(domElements);
    
    // Add event listener for the "Evolve" button
    domElements.evolveBtn.addEventListener('click', Game.evolvePattern);
});