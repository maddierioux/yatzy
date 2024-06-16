import { Dice } from './dice.js';

export class YatzyGame {
    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.turn = 0;
        this.dice = [new Dice(), new Dice(), new Dice(), new Dice(), new Dice(), new Dice()]; //Initializing the six dice using the Dice class
        this.keep = [true, true, true, true, true]; //Initializing all dice to be kept at the start
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

    rollDice() {
        if (this.turn >= 3) return;
        this.turn++;
        for (let i = 0; i < 5; i++) {
            if (!this.keep[i]) {
                this.dice[i].rollDie;
            }
        }
    }

    toggleKeep(index) {
        if (index >= 0 && index < 5) {
            this.keep[index] = !this.keep[index];
        }
    }

    getGameState() {
        return {
            turn: this.turn,
            dice: this.dice,
            keep: this.keep
        };
    }

    getDiceValues(){
        return this.dice.map(die => die.getValue);
    }
}
