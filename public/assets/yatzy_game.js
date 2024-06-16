import { Dice } from './dice.js';

export class YatzyGame {
    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.turn = 0;
        this.dice = [new Dice(), new Dice(), new Dice(), new Dice(), new Dice(), new Dice()]; //Initializing the six dice using the Dice class
        this.keep = [true, true, true, true, true]; //Initializing all dice to be kept at the start
    }

    rollDice() {
        if (this.turn >= 3) return;
        this.turn++;
        for (let i = 0; i < 5; i++) {
            if (!this.keep[i]) {
                this.dice[i] = rollDice();
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
}
