//Moved all the scoring within this file 
class YatzyEngine {
    constructor() {
        this.dice = [new Dice(), new Dice(), new Dice(), new Dice(), new Dice()];
        this.rollsLeft = 3;
        this.score = 0;
        this.bonus = 0;
    }

    rollDice() {
        if (this.rollsLeft > 0) {
            this.dice.forEach(die => die.rollDie());
            this.rollsLeft--;
        }
    }

    resetRolls() {
        this.rollsLeft = 3;
    }

    toggleAll(){
        this.dice.forEach(die => die.untoggle());
    }

    toggleHold(index) {
        this.dice[index].toggleHold();
    }

    getDiceValues() {
        return this.dice.map(die => die.value);
    }

    getDiceImages() {
        return this.dice.map(die => die.displayDie());
    }

    calculateScore(scoreType) {
        const dice = this.getDiceValues();
        const counts = new Array(6).fill(0);
        dice.forEach(die => counts[die - 1]++);

        switch (scoreType) {
            case 'ones':
                return counts[0];
            case 'twos':
                return counts[1] * 2;
            case 'threes':
                return counts[2] * 3;
            case 'fours':
                return counts[3] * 4;
            case 'fives':
                return counts[4] * 5;
            case 'sixes':
                return counts[5] * 6;
            case 'onePair':
                let highestPair = 0;
                for (let i = 0; i < 6; i++) {
                    if (counts[i] >= 2) {
                        highestPair = i + 1;
                    }
                }
                return highestPair * 2;
            case 'twoPairs':
                const pairs = [];
                for (let i = 0; i < 6; i++) {
                    if (counts[i] == 2) {
                        pairs.push(i + 1);
                    }
                }
                if (pairs.length >= 2) {
                    pairs.sort((a, b) => b - a);
                    return pairs[0] * 2 + pairs[1] * 2;
                } else {
                    return 0;
                }
            case 'three-of-a-kind':
                let highestThree = 0;
                for (let i = 0; i < 6; i++) {
                    if (counts[i] >= 3) {
                        highestThree = i + 1;
                    }
                }
                return highestThree * 3;


            case 'four-of-a-kind':
                let highestFour = 0;
                for (let i = 0; i < 6; i++) {
                    if (counts[i] >= 4) {
                        highestFour = i + 1;
                    }
                }
                return highestFour * 4;

            case 'small-straight': //Checks if the player has the dice 1-2-3-4 or 2-3-4-5 or 3-4-5-6
                if((counts[0] >= 1 && counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1)|| (counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1 && counts[5] >= 1) || (counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1 && counts[5] >= 1 && counts[6] >= 1)){
                    return 30;
                }
    
                return 0; //If they don't have the correct combination, return 0
    
            case 'large-straight': //Checks if the player has the dice 2-3-4-5-6 or 1-2-3-4-5
                if((counts[0] >= 1 && counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1 && counts[5] >= 1)||( counts[1] == 1 && counts[2] == 1 && counts[3] == 1 && counts[4] == 1 && counts[5] == 1)) {
                    return 40;
                }
    
                return 0; //If they don't have the correct combination, return 0
                

            case 'full-house':
                let pair = false;
                let trio = false;
                let pairTotal = 0;
                let trioTotal = 0;
                for (let i = 0; i < 6; i++) {
                    if (counts[i] == 2) {
                        pair = true;
                        pairTotal = (i + 1) * 2;
                    } else if (counts[i] == 3) {
                        trio = true;
                        trioTotal = (i + 1) * 3;
                    }
                }
                if (pair && trio) {
                    return pairTotal + trioTotal;
                } else {
                    return 0;
                }
            case 'chance':
                return dice.reduce((total, value) => total + value, 0);
            case 'yatzy':
                if (new Set(dice).size === 1) {
                    return 50;
                }
                return 0;
            default:
                return 0;
        }
    }

    updateOverallScore(scoreType) {
        const score = this.calculateScore(scoreType);
        this.score += score;
        return this.score;
    }
}
