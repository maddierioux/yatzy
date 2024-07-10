// Function to start a new game
function startGame() {
    fetch('api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'start_game'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update UI with the game state
            updateGameState(data.game_state);
        }
    });
}

// Function to roll the dice
function rollDice() {
    fetch('api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'roll_dice'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update UI with the new dice values
            updateGameState(data);
        }
    });
}

// Function to submit the score for a given score box
function submitScore(scoreBox) {
    fetch('api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'submit_score',
            scoreBox: scoreBox
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update UI with the new scores
            updateScoreboard(data.total_score, data.bonus);
            updateLeaderboard(data.leaderboard);
        } else {
            console.error('Error submitting score:', data.message);
        }
    });
}

// Function to update the game state in the UI
function updateGameState(gameState) {
    const diceContainer = document.getElementById('dice-container');
    diceContainer.innerHTML = '';
    gameState.diceValues.forEach((value, index) => {
        const dieElement = document.createElement('div');
        dieElement.className = 'dice';
        dieElement.style.backgroundImage = `url('docs/design_system/dice${value}.png')`;
        dieElement.onclick = () => toggleDieSelection(index);
        if (gameState.keep[index]) {
            dieElement.classList.add('selected');
        }
        diceContainer.appendChild(dieElement);
    });

    // Disable the roll dice button if no rolls are left
    document.getElementById('roll-dice').disabled = gameState.rolls_left === 0;
}

// Function to toggle the selection state of a die
function toggleDieSelection(index) {
    const diceContainer = document.getElementById('dice-container');
    const dieElement = diceContainer.children[index];
    dieElement.classList.toggle('selected');

    // Implement the AJAX call to update die selection on the server if needed
}

// Function to update the scoreboard in the UI
function updateScoreboard(totalScore, bonus) {
    const scoreboard = document.getElementById('total-score');
    scoreboard.innerHTML = `${totalScore} (Bonus: ${bonus})`;
}

// Function to update the leaderboard in the UI
function updateLeaderboard(leaderboard) {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = 'Leaderboard:<br>' + leaderboard.map(score => `<div>${score}</div>`).join('');
}

// Function to handle next turn logic
function nextTurn() {
    // Logic to proceed to the next turn
    // For example, reset dice selection and enable rolling
}




