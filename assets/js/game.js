document.addEventListener('DOMContentLoaded', () => {
    // Get elements from the DOM
    const rollDiceButton = document.getElementById('roll-dice');
    const diceContainer = document.getElementById('dice-container');
    const scoreTypeSelect = document.getElementById('score-type');
    const nextTurnButton = document.getElementById('next-turn');
    const newGameButton = document.getElementById('new-game');
    const leaderboardList = document.getElementById('leaderboard');

    // Mapping score types to their respective elements
    const scoreElements = {
        ones: document.getElementById('score-ones'),
        twos: document.getElementById('score-twos'),
        threes: document.getElementById('score-threes'),
        fours: document.getElementById('score-fours'),
        fives: document.getElementById('score-fives'),
        sixes: document.getElementById('score-sixes'),
        'three-of-a-kind': document.getElementById('score-three-of-a-kind'),
        'four-of-a-kind': document.getElementById('score-four-of-a-kind'),
        'full-house': document.getElementById('score-full-house'),
        'small-straight': document.getElementById('score-small-straight'),
        'large-straight': document.getElementById('score-large-straight'),
        chance: document.getElementById('score-chance'),
        yatzy: document.getElementById('score-yatzy')
    };

    let currentRoll = [];
    let rollCount = 0;

    // Add event listeners
    rollDiceButton.addEventListener('click', rollDice);
    nextTurnButton.addEventListener('click', nextTurn);
    newGameButton.addEventListener('click', newGame);

    // Function to handle rolling the dice
    function rollDice() {
        if (rollCount >= 3) {
            alert('You have reached the maximum number of rolls. Please select a score.');
            return;
        }

        fetch('http://localhost:8081/api/game.php?action=rollDice')
            .then(response => response.json())
            .then(data => {
                currentRoll = data.dice;
                rollCount++;
                updateDice(currentRoll);
                updateScoreOptions(data.scoreOptions);
            });
    }

    // Function to update the dice display
    function updateDice(dice) {
        diceContainer.innerHTML = '';
        dice.forEach(die => {
            const dieElement = document.createElement('div');
            dieElement.classList.add('dice');
            dieElement.innerHTML = `<img src="assets/images/dice${die}.png" alt="Die">`;
            diceContainer.appendChild(dieElement);
        });
    }

    // Function to update the score options in the dropdown
    function updateScoreOptions(scoreOptions) {
        for (const [type, score] of Object.entries(scoreOptions)) {
            const safeType = CSS.escape(type);
            const option = scoreTypeSelect.querySelector(`option[value=${safeType}]`);
            if (option) {
                option.textContent = `${type.replace(/-/g, ' ')}: ${score}`;
            }
        }
    }

    // Function to handle selecting a score type and proceeding to the next turn
    function nextTurn() {
        const selectedScoreType = scoreTypeSelect.value;
        if (!currentRoll.length || !selectedScoreType) return;

        fetch(`http://localhost:8081/api/game.php?action=placeScore&scoreType=${selectedScoreType}`)
            .then(response => response.json())
            .then(data => {
                updateScoreElements(data.scores);
                updateTotalScore(data.totalScore);
                currentRoll = [];
                rollCount = 0;
                removeUsedScoreType(selectedScoreType);
                clearScoreOptions();

                console.log('Used Scores:', data.usedScores); // Debugging statement

                if (isGameOver(data.usedScores)) {
                    alert('Game over! Check your final score and start a new game.');
                    saveScore(data.totalScore);
                    loadLeaderboard();
                }
            });
    }

    // Function to update the score elements in the UI
    function updateScoreElements(scores) {
        for (const [type, score] of Object.entries(scores)) {
            scoreElements[type].textContent = score;
        }
    }

    // Function to update the total score in the UI
    function updateTotalScore(totalScore) {
        document.getElementById('total-score').textContent = totalScore;
    }

    // Function to clear the score options in the dropdown
    function clearScoreOptions() {
        scoreTypeSelect.querySelectorAll('option').forEach(option => {
            option.textContent = option.value.replace(/-/g, ' ');
        });
    }

    // Function to disable a score type once it has been used
    function removeUsedScoreType(scoreType) {
        const option = scoreTypeSelect.querySelector(`option[value=${CSS.escape(scoreType)}]`);
        if (option) {
            option.disabled = true;
        }
    }

    // Function to check if the game is over (all score types used)
    function isGameOver(usedScores) {
        // Check if all score types are used
        const allScoreTypes = [
            'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
            'three-of-a-kind', 'four-of-a-kind', 'full-house', 'small-straight',
            'large-straight', 'chance', 'yatzy'
        ];
        return allScoreTypes.every(type => usedScores[type]);
    }

    // Function to save the final score to the leaderboard
    function saveScore(score) {
        fetch(`http://localhost:8081/api/game.php?action=saveScore&score=${score}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Score saved successfully!');
                }
            });
    }

    // Function to load the leaderboard from the server
    function loadLeaderboard() {
        fetch('http://localhost:8081/api/game.php?action=getLeaderboard')
            .then(response => response.json())
            .then(data => {
                leaderboardList.innerHTML = '';
                data.leaderboard.forEach(entry => {
                    const li = document.createElement('li');
                    li.textContent = `Score: ${entry.score}`;
                    leaderboardList.appendChild(li);
                });
            });
    }

    // Function to start a new game
    function newGame() {
        fetch('http://localhost:8081/api/game.php?action=newGame')
            .then(response => response.json())
            .then(data => {
                currentRoll = [];
                rollCount = 0;
                updateScoreElements(data.scores);
                updateTotalScore(data.totalScore);
                scoreTypeSelect.querySelectorAll('option').forEach(option => {
                    option.disabled = false;
                });
                loadLeaderboard();
            });
    }

    // Load the leaderboard on page load
    loadLeaderboard();
});



