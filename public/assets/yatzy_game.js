
//Below ensures that we wait for the DOM content to be fully loaded 
document.addEventListener('DOMContentLoaded', () => {
    const diceContainer = document.getElementById('dice-container');
    const rollDiceButton = document.getElementById('roll-dice');
    const scoreboard = document.getElementById('scoreboard');
    const yatzyEngine = new YatzyEngine();
    const diceElements = [];


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

    function updateScoreboard() {
        scoreboard.textContent = `Score: ${yatzyEngine.score}`; //Sets the score to the current score
    }

    rollDiceButton.addEventListener('click', () => {
        yatzyEngine.rollDice();
        renderDice(); //Makes the dice as they should be 
        if (yatzyEngine.rollsLeft < 0) {
            alert('No rolls left. Select a score box.');
        }
    });


    //This one I am unsure (may need to change as to how yatzy actually works)
    document.getElementById('score-type').addEventListener('change', (event) => {
        const scoreType = event.target.value;
        yatzyEngine.updateOverallScore(scoreType);
        updateScoreboard();
        yatzyEngine.resetRolls();
    });

    initializeDice();
    renderDice();
    updateScoreboard();
});

