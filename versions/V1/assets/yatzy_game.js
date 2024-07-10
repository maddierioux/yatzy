
//Below ensures that we wait for the DOM content to be fully loaded 
document.addEventListener('DOMContentLoaded', () => {
    const diceContainer = document.getElementById('dice-container');
    const rollDiceButton = document.getElementById('roll-dice');
    const scoreTypeSelect = document.getElementById('score-type');
    const yatzyEngine = new YatzyEngine();
    const diceElements = [];
    let currentTurn = 1;
    const maxTurns = 13; // Total number of scoring categories
    const scores = {};


    //Creates the dice (moved the code here)
    function initializeDice() {
        for (let i = 0; i < 5; i++) {
            const dieElement = document.createElement('img');
            dieElement.classList.add('dice');
            dieElement.addEventListener('click', () => {
                yatzyEngine.toggleHold(i);
                dieElement.classList.toggle('selected');
            });
            diceElements.push(dieElement);
            diceContainer.appendChild(dieElement);
        }
    }
    // Update potential scores display
    function updatePotentialScores() {
        const scoreItems = document.querySelectorAll('.score-item');
        scoreItems.forEach(item => {
            const scoreType = item.getAttribute('data-score');
            if (!scores[scoreType]) { // Only update potential scores for unselected categories
                const potentialScore = yatzyEngine.calculateScore(scoreType);
                item.querySelector('span').textContent = potentialScore;
            }
        });
    }

    function reset_score() {
        for (let key in scores) {
            scores[key] = null;
        }
        scores.totalScore = 0;
        document.getElementById('total-score').textContent = scores.totalScore;
    }

    //renders the dice images based on their current values
    function renderDice() {
        yatzyEngine.getDiceImages().forEach((image, index) => { //Loop through all the images 
            diceElements[index].src = image; //Make it such that dice element has the image given 
        });
        updatePotentialScores();
    }

    // Update the scorecard display
    function updateScorecard() {
        for (let key in scores) {
            const scoreSpan = document.getElementById(`score-${key}`);
            if (scoreSpan) {
                scoreSpan.textContent = scores[key];
            }
        }
        const totalScore = Object.values(scores).reduce((acc, score) => acc + (score || 0), 0); // sums up all the scores
        document.getElementById('total-score').textContent = totalScore;
    }


    function endTurn() {
        const selectedScoreType = scoreTypeSelect.value;
        if (!scores[selectedScoreType]) {
            scores[selectedScoreType] = yatzyEngine.calculateScore(selectedScoreType);
            updateScorecard();
            yatzyEngine.toggleAll();
            diceElements.forEach(dieElement => {
                dieElement.classList.remove('selected');
            });
            rollsLeft = 3; //To counteract the fact that we are initally rolling for them 
            yatzyEngine.resetRolls();
            yatzyEngine.rollDice();
            renderDice();
            currentTurn++;
            if (currentTurn > maxTurns) {
                alert('Game over! Final score: ' + document.getElementById('total-score').textContent);
                reset_score()
                return;
            }
        } else {
            alert('This score type has already been used. Please select another.');
        }
    }

    rollDiceButton.addEventListener('click', () => {
        if (yatzyEngine.rollsLeft === 0) {
            alert('No rolls left. Select a score box.');
        }
        else{
            yatzyEngine.rollDice();
            renderDice(); //Makes the dice as they should be 
        }   
    });

    document.getElementById('next-turn').addEventListener('click', endTurn);

    initializeDice();
    renderDice();
});

