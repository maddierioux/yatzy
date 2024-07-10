<?php
namespace Yatzy;

// YatzyEngine class to handle scoring logic
class YatzyEngine
{
    // Method to calculate the score for a given score box
    public function calculateScore($game, $scoreBox)
    {
        $diceValues = $game->diceValues;
        switch ($scoreBox) {
            case 'ones':
                return array_sum(array_filter($diceValues, fn($value) => $value == 1));
            case 'twos':
                return array_sum(array_filter($diceValues, fn($value) => $value == 2));
            case 'threes':
                return array_sum(array_filter($diceValues, fn($value) => $value == 3));
            case 'fours':
                return array_sum(array_filter($diceValues, fn($value) => $value == 4));
            case 'fives':
                return array_sum(array_filter($diceValues, fn($value) => $value == 5));
            case 'sixes':
                return array_sum(array_filter($diceValues, fn($value) => $value == 6));
            case 'three_of_a_kind':
                return $this->scoreOfAKind($diceValues, 3);
            case 'four_of_a_kind':
                return $this->scoreOfAKind($diceValues, 4);
            case 'full_house':
                return $this->scoreFullHouse($diceValues);
            case 'small_straight':
                return $this->scoreSmallStraight($diceValues);
            case 'large_straight':
                return $this->scoreLargeStraight($diceValues);
            case 'yatzy':
                return $this->scoreYatzy($diceValues);
            case 'chance':
                return array_sum($diceValues);
            default:
                return 0;
        }
    }

    // Private method to score "Of A Kind" categories
    private function scoreOfAKind($diceValues, $count)
    {
        $counts = array_count_values($diceValues);
        foreach ($counts as $value => $number) {
            if ($number >= $count) {
                return $value * $count;
            }
        }
        return 0;
    }

    // Private method to score "Full House" category
    private function scoreFullHouse($diceValues)
    {
        $counts = array_count_values($diceValues);
        if (in_array(3, $counts) && in_array(2, $counts)) {
            return 25;
        }
        return 0;
    }

    // Private method to score "Small Straight" category
    private function scoreSmallStraight($diceValues)
    {
        sort($diceValues);
        $uniqueValues = array_unique($diceValues);
        $straights = [
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6]
        ];
        foreach ($straights as $straight) {
            if (array_slice($uniqueValues, 0, 4) == $straight) {
                return 30;
            }
        }
        return 0;
    }

    // Private method to score "Large Straight" category
    private function scoreLargeStraight($diceValues)
    {
        sort($diceValues);
        $uniqueValues = array_unique($diceValues);
        $straights = [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6]
        ];
        if (in_array($uniqueValues, $straights)) {
            return 40;
        }
        return 0;
    }

    // Private method to score "Yatzy" category
    private function scoreYatzy($diceValues)
    {
        $counts = array_count_values($diceValues);
        if (in_array(5, $counts)) {
            return 50;
        }
        return 0;
    }

    // Method to update the overall score including bonus
    public function updateOverallScore($game)
    {
        $game->overallScore = array_sum($game->scores);
        if (array_sum(array_slice($game->scores, 0, 6)) >= 63) {
            $game->bonus = 35;
        } else {
            $game->bonus = 0;
        }
        $game->overallScore += $game->bonus;
    }
}
?>

