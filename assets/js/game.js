document.addEventListener('DOMContentLoaded', () => {
    const rollDiceButton = document.getElementById('roll-dice');
    const diceContainer = document.getElementById('dice-container');
    const scoreTypeSelect = document.getElementById('score-type');
    const nextTurnButton = document.getElementById('next-turn');
    const newGameButton = document.getElementById('new-game');
    const leaderboardList = document.getElementById('leaderboard');

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

    let currentRoll = [1,1,1,1,1];
    let heldDice = [false, false, false, false, false];
    let rollCount = 0;

    rollDiceButton.addEventListener('click', rollDice);
    nextTurnButton.addEventListener('click', nextTurn);
    newGameButton.addEventListener('click', newGame);

    function rollDice() {
        if (rollCount >= 3) {
            alert('You have reached the maximum number of rolls. Please select a score.');
            return;
        }

        fetch(`http://localhost:8081/api/game.php?action=rollDice&heldDice=${JSON.stringify(heldDice)}`)

            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text(); // Get response as text for debugging
            })
            .then(text => {
                console.log('Raw Roll Dice Response:', text); // Log raw response
                try {
                    const data = JSON.parse(text); // Parse JSON
                    console.log('Parsed Roll Dice Response:', data); // Log parsed response

                    currentRoll = data.dice;
                    
                    if (typeof data.heldDice === 'string') {
                        heldDice = JSON.parse(data.heldDice);
                    } else {
                        heldDice = data.heldDice;
                    }


                    heldDice = data.heldDice;

                    rollCount++;
                    updateDice(currentRoll);
                    updateScoreOptions(data.scoreOptions);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            })
            .catch(error => console.error('Fetch Error:', error)); // Log fetch error
    }

    function updateDice(dice) {
        diceContainer.innerHTML = '';
        dice.forEach((die, index) => {
            const dieElement = document.createElement('div');
            dieElement.classList.add('dice');
            if (heldDice[index]) {
                dieElement.classList.add('held');
            }
            dieElement.innerHTML = `<img src="assets/images/dice${die}.png" alt="Die">`;
            dieElement.addEventListener('click', () => toggleHoldDie(index));
            diceContainer.appendChild(dieElement);
        });
    }
    

    function toggleHoldDie(index) {
        heldDice[index] = !heldDice[index];
        updateDice(currentRoll);
    }
    

    function updateScoreOptions(scoreOptions) {
        for (const [type, score] of Object.entries(scoreOptions)) {
            const safeType = CSS.escape(type);
            const option = scoreTypeSelect.querySelector(`option[value=${safeType}]`);
            if (option) {
                option.textContent = `${type.replace(/-/g, ' ')}: ${score}`;
            }
        }
    }

    function nextTurn() {
        const selectedScoreType = scoreTypeSelect.value;
        if (!currentRoll.length || !selectedScoreType) return;

        fetch(`http://localhost:8081/api/game.php?action=placeScore&scoreType=${selectedScoreType}`)
        
            .then(response => response.json())
            .then(data => {
                console.log('Place Score Response:', data); // Debugging statement
                updateScoreElements(data.scores);
                updateTotalScore(data.totalScore);
                currentRoll = [];
                heldDice = [false, false, false, false, false];
                rollCount = 0;
                removeUsedScoreType(selectedScoreType);
                clearScoreOptions();

                console.log('Used Scores:', data.usedScores); // Debugging statement

                if (isGameOver(data.usedScores)) {
                    alert('Game over! Check your final score and start a new game.');
                    saveScore(data.totalScore);
                    loadLeaderboard();
                }
            })
            .catch(error => console.error('Error:', error)); // Debugging statement
    }

    function updateScoreElements(scores) {
        for (const [type, score] of Object.entries(scores)) {
            scoreElements[type].textContent = score;
        }
    }

    function updateTotalScore(totalScore) {
        document.getElementById('total-score').textContent = totalScore;
    }

    function clearScoreOptions() {
        scoreTypeSelect.querySelectorAll('option').forEach(option => {
            option.textContent = option.value.replace(/-/g, ' ');
        });
    }

    function removeUsedScoreType(scoreType) {
        const option = scoreTypeSelect.querySelector(`option[value=${CSS.escape(scoreType)}]`);
        if (option) {
            option.disabled = true;
        }
    }

    function isGameOver(usedScores) {
        const allScoreTypes = [
            'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
            'three-of-a-kind', 'four-of-a-kind', 'full-house', 'small-straight',
            'large-straight', 'chance', 'yatzy'
        ];
        return allScoreTypes.every(type => usedScores[type]);
    }

    function saveScore(score) {
        fetch(`http://localhost:8081/api/game.php?action=saveScore&score=${score}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Score saved successfully!');
                }
            })
            .catch(error => console.error('Error:', error)); // Debugging statement
    }

    function loadLeaderboard() {
        fetch('http://localhost:8081/api/game.php?action=getLeaderboard')
            .then(response => response.json())
            .then(data => {
                console.log('Leaderboard Response:', data); // Debugging statement
                leaderboardList.innerHTML = '';
                data.leaderboard.forEach(entry => {
                    const li = document.createElement('li');
                    li.textContent = `Score: ${entry.score}`;
                    leaderboardList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error)); // Debugging statement
    }

    function newGame() {
        fetch('http://localhost:8081/api/game.php?action=newGame')
            .then(response => response.json())
            .then(data => {
                console.log('New Game Response:', data); // Debugging statement
                currentRoll = [];
                heldDice = [false, false, false, false, false];
                rollCount = 0;
                updateScoreElements(data.scores);
                updateTotalScore(data.totalScore);
                scoreTypeSelect.querySelectorAll('option').forEach(option => {
                    option.disabled = false;
                });
                loadLeaderboard();
            })
            .catch(error => console.error('Error:', error)); // Debugging statement
    }

    newGame(); //Load new game on load
});