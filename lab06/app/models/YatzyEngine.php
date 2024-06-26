<?php
namespace Yatzy;

class YatzyEngine
{
    public function calculateScore($game, $scoreBox)
    {
        $diceValues = $game->diceValues;
        switch ($scoreBox) {
            case 'ones':
                return array_sum(array_filter($diceValues, fn($value) => $value == 1));
            case 'twos':
                return array_sum(array_filter($diceValues, fn($value) => $value == 2));
            // Add other cases for threes, fours, fives, sixes, etc.
            default:
                return 0;
        }
    }

    public function updateOverallScore($game)
    {
        // Implement overall score calculation
    }
}
