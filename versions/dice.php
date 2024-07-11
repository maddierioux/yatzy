<?php
namespace Yatzy;

// Dice class representing a single die
class Dice
{
    public $min;
    public $max;

    // Constructor to set the minimum and maximum values for the die
    public function __construct($min = 1, $max = 6)
    {
        $this->min = $min;
        $this->max = $max;
    }

    // Method to roll the die and return a random value between min and max
    public function roll()
    {
        return rand($this->min, $this->max);
    }
}
?>
