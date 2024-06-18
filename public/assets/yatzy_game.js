
//Below ensures that we wait for the DOM content to be fully loaded 
document.addEventListener('DOMContentLoaded', () => {
    const diceContainer = document.getElementById('dice-container');
    const rollDiceButton = document.getElementById('roll-dice');
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

    function reset_score(){
        this.score = {
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            onePair: null,
            twoPairs: null,
            threeOfAKind: null,
            fourOfAKind: null,
            fullHouse: null,
            smallStraight: null,
            largeStraight: null,
            yahtzee: null,
            chance: null,
            totalScore: 0,
            bonus: 0
        }
    }
    //renders the dice images based on their current values
    function renderDice() {
        yatzyEngine.getDiceImages().forEach((image, index) => { //Loop through all the images 
            diceElements[index].src = image; //Make it such that dice element has the image given 
        });
    }

    // Update the scorecard display
    function updateScorecard() {
        for (let key in scores) {
            const scoreSpan = document.getElementById(`score-${key}`);
            if (scoreSpan) {
                scoreSpan.textContent = scores[key];
            }
        }
        const totalScore = Object.values(scores).reduce((acc, score) => acc + score, 0);
        document.getElementById('total-score').textContent = totalScore;
    }


    function endTurn() {
        const selectedScoreType = scoreTypeSelect.value;
        if (!scores[selectedScoreType]) {
            scores[selectedScoreType] = yatzyEngine.calculateScore(selectedScoreType);
            yatzyEngine.updateOverallScore(selectedScoreType);
            updateScorecard();
            rollsLeft = 3;
            yatzyEngine.resetRolls();
            currentTurn++;
            if (currentTurn > maxTurns) {
                alert('Game over! Final score: ' + document.getElementById('total-score').textContent);
                return;
            }
        } else {
            alert('This score type has already been used. Please select another.');
        }
    }

    rollDiceButton.addEventListener('click', () => {
        yatzyEngine.rollDice();
        renderDice(); //Makes the dice as they should be 
        if (yatzyEngine.rollsLeft < 0) {
            alert('No rolls left. Select a score box.');
        }
    });

    document.getElementById('next-turn').addEventListener('click', endTurn);

    initializeDice();
    renderDice();
});

