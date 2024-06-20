class Dice {
    constructor() {
        this.value = 0;
        this.selected = false; //Determines if the dice has been selected or not
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
        if (!this.selected) { //Only if we want to actually roll the die do we do it 
            //By adding the above line I was able to remove a lot of the code below that ensures the die has to not be selected to be rolled. 
            this.value = Math.floor(1 + Math.random() * 6);
        }
    }

    displayDie() {
        return this.faces[this.value - 1];
    }

    toggleHold() { //For when we want to change wether the dice is held or not 
        this.selected = !this.selected;
    }
    untoggle(){
        this.selected = false;
    }
}

const diceContainer = document.getElementById("dice-container");



