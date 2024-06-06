let diceValues = [];
numberOfDice = 5;

function rollDie (numberOfDice){
    const results = []

    for (let i = 0; i < numberOfDice; i++) {
        const roll = Math.floor(1 + Math.random() * 6);
        diceValues.push(roll);
    }
}

function rerollSelectedDice() {
    const diceContainer = document.getElementById('diceContainer');
    const diceElements = diceContainer.children;
    for (let i = 0; i < numberOfDice; i++) {
        if (diceElements[i].classList.contains('selected')) {
            diceValues[i] = rollDice();
            diceElements[i].classList.remove('selected');
        }
    }
    displayDice();
}

function toggleSelection(event) {
    event.target.classList.toggle('selected');
}

function displayDice() {
    const diceContainer = document.getElementById('diceContainer');
    diceContainer.innerHTML = '';
    diceValues.forEach((value, index) => {
        const diceElement = document.createElement('div');
        diceElement.className = 'dice';
        diceElement.innerText = value;
        diceElement.onclick = toggleSelection;
        diceContainer.appendChild(diceElement);
    });
}




