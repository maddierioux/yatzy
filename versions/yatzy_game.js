function startGame() {
    console.log("Game started");
    fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ action: 'start_game' })
    })
    .then(response => response.text()) // Change from .json() to .text() to inspect raw response
    .then(data => {
        console.log("Raw response:", data); // Log the raw response for debugging
        try {
            const jsonData = JSON.parse(data); // Manually parse JSON
            if (jsonData.success) {
                console.log("Game state initialized", jsonData.game_state);
            } else {
                console.error("Failed to start game:", jsonData.message);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error, "Response text:", data);
        }
    })
    .catch(error => console.error('Error starting game:', error));
}

async function rollDice() {
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'roll_dice' })
        });

        const text = await response.text(); // Get raw response text
        console.log("Raw response:", text); // Log the raw response for debugging

        const data = JSON.parse(text); // Parse the JSON from raw text

        if (data.success) {
            updateDiceContainer(data.dice);
            console.log("Rolls left:", data.rolls_left);
        } else {
            console.error("Failed to roll dice:", data.message);
        }
    } catch (error) {
        console.error('Error rolling dice:', error);
    }
}
function updateDiceContainer(dice) {
    const container = document.getElementById('dice-container');
    container.innerHTML = '';
    dice.forEach(die => {
        const dieElement = document.createElement('img');
        dieElement.className = 'die';
        dieElement.src = `images/dice-${die}.png`; // Assuming dice images are in the 'images' folder
        container.appendChild(dieElement);
    });
}

async function calculateScore() {
    const scoreType = document.getElementById('score-type').value;
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'submit_score', scoreBox: scoreType })
        });
        const data = await response.json();
        if (data.success) {
            updateScore(scoreType, data.score);
            console.log("Total score:", data.total_score);
            console.log("Bonus:", data.bonus);
            console.log("Leaderboard:", data.leaderboard);
        } else {
            console.error("Failed to submit score:", data.message);
        }
    } catch (error) {
        console.error('Error submitting score:', error);
    }
}

function updateScore(scoreType, score) {
    const scoreElement = document.getElementById(`score-${scoreType}`);
    scoreElement.textContent = score;
    updateTotalScore();
}

function updateTotalScore() {
    const scores = Array.from(document.querySelectorAll('[id^=score-]')).map(score => parseInt(score.textContent));
    const totalScore = scores.reduce((acc, score) => acc + score, 0);
    document.getElementById('total-score').textContent = totalScore;
}

function nextTurn() {
    console.log("Next turn");
    // Additional logic for next turn
}

document.getElementById('roll-dice').addEventListener('click', rollDice);
document.getElementById('next-turn').addEventListener('click', nextTurn);
document.getElementById('score-type').addEventListener('change', calculateScore);

// Start the game when the page loads
window.onload = startGame;





