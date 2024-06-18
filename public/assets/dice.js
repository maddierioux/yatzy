class Dice {
    constructor() {
        this.value = 0;
        this.faces = [
            'docs/design_system/dice1.png',
            'docs/design_system/dice2.png',
            'docs/design_system/dice3.png',
            'docs/design_system/dice4.png',
            'docs/design_system/dice5.png',
            'docs/design_system/dice6.png'
        ];
        this.selected = false; //Determines if the dice has been selected or not
    }
   
    rollDie() {
        this.value = Math.floor(1 + Math.random() * 6);
    }

    displayDie() {
        return this.faces[this.value - 1];
    }

    getValue() {
        return this.value;
    }
}      

const diceContainer = document.getElementById("dice-container");
const rerollButton = document.getElementById("reroll-button");
let diceArray = [];


function createDice() {

    diceArray = [];

    for (let i = 0; i < 5; i++) {
        const die = new Dice();
        die.rollDie();
        
        const dieElement = document.createElement('img');
        dieElement.src = die.displayDie();
        dieElement.className = 'die';
        dieElement.addEventListener('click', () => toggleSelectDie(die,dieElement));

        diceArray.push(die);
        diceContainer.appendChild(dieElement);
    }
}

function toggleSelectDie(die, dieElement){ //Toggles the selected property
    die.selected = !die.selected;
    dieElement.classList.toggle('selected', die.selected);
}

function rerollSelectedDie() {
    for(i = 0; i< diceArray.length; i++){
        if(diceArray[i].selected){

            diceArray[i].rollDie();
            diceContainer.children[i].src = diceArray[i].displayDie(); //Updates the image on the screen
            diceArray[i].selected = false; //Reset the status of the die
            diceContainer.children[i].classList.remove('selected') //Remove the highlighted status on the die
        }
    }
}

createDice();

rerollButton.addEventListener('click', rerollSelectedDie);