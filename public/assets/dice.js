class Dice {
    constructor() {
        this.value = 0;
        this.faces = [
            'docs/design_system/dice1.png',
            'docs/design_system/dice2.png',
            'docs/design_system/dice3.png',
            'docs/design_system/dice4.png',
            'docs/design_system/dice5.png',
            'docs/design_system/dice6.png' // Fixed this to dice6.png
        ];
    }

    rollDie() {
        this.value = Math.floor(1 + Math.random() * 6);
    }

    displayDie() {
        return this.faces[this.value - 1];
    }
}

const diceContainer = document.getElementById("dice-container");

function createDice() {
    for (let i = 0; i < 5; i++) {
        const die = new Dice();
        die.rollDie();
        
        const dieElement = document.createElement('img');
        dieElement.src = die.displayDie();
        
        diceContainer.appendChild(dieElement);
    }
}


createDice();









