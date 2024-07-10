<?php
namespace Yatzy;

// YatzyGame class representing the game state
class YatzyGame
{
    public $rolls;
    public $diceValues;
    public $keep;
    public $scores;
    public $overallScore;
    public $bonus;

    // Constructor to initialize the game state
    public function __construct()
    {
        $this->rolls = 0;
        $this->diceValues = array_fill(0, 5, 0);
        $this->keep = array_fill(0, 5, false);
        $this->scores = [];
        $this->overallScore = 0;
        $this->bonus = 0;
    }

    // Method to roll the dice
    public function rollDice()
    {
        $this->rolls++;
        for ($i = 0; $i < 5; $i++) {
            if (!$this->keep[$i]) {
                $dice = new Dice();
                $this->diceValues[$i] = $dice->roll();
            }
        }
    }
}
?>


