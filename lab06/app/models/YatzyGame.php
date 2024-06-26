<?php
namespace Yatzy;

class YatzyGame
{
    public $rolls;
    public $diceValues;
    public $keep;
    public $scores;       // Add this line
    public $overallScore; // Add this line
    public $bonus;        // Add this line

    public function __construct()
    {
        $this->rolls = 0;
        $this->diceValues = array_fill(0, 5, 0);
        $this->keep = array_fill(0, 5, false);
        $this->scores = [];        // Initialize scores
        $this->overallScore = 0;   // Initialize overall score
        $this->bonus = 0;          // Initialize bonus
    }

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

