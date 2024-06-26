<?php
namespace Yatzy\Test;

use Yatzy\YatzyGame;
use Yatzy\YatzyEngine;
use PHPUnit\Framework\TestCase;

class YatzyEngineTest extends TestCase
{
    public function testCalculateScore()
    {
        $engine = new YatzyEngine();
        
        $game = new YatzyGame();
        $game->diceValues = [1, 1, 2, 4, 5];
        $this->assertEquals(2, $engine->calculateScore($game, 'ones'));
        $this->assertEquals(2, $engine->calculateScore($game, 'twos'));
        
        $game->diceValues = [3, 3, 3, 4, 5];
        $this->assertEquals(9, $engine->calculateScore($game, 'threes'));
        
        $game->diceValues = [4, 4, 4, 4, 5];
        $this->assertEquals(16, $engine->calculateScore($game, 'fours'));
        
        $game->diceValues = [5, 5, 5, 5, 5];
        $this->assertEquals(25, $engine->calculateScore($game, 'fives'));
        
        $game->diceValues = [6, 6, 6, 6, 6];
        $this->assertEquals(30, $engine->calculateScore($game, 'sixes'));

        // Test three of a kind
        $game->diceValues = [3, 3, 3, 4, 5];
        $this->assertEquals(18, $engine->calculateScore($game, 'three_of_a_kind'));

        // Test four of a kind
        $game->diceValues = [4, 4, 4, 4, 5];
        $this->assertEquals(21, $engine->calculateScore($game, 'four_of_a_kind'));

        // Test full house
        $game->diceValues = [3, 3, 3, 2, 2];
        $this->assertEquals(25, $engine->calculateScore($game, 'full_house'));

        // Test small straight
        $game->diceValues = [1, 2, 3, 4, 6];
        $this->assertEquals(30, $engine->calculateScore($game, 'small_straight'));

        // Test large straight
        $game->diceValues = [2, 3, 4, 5, 6];
        $this->assertEquals(40, $engine->calculateScore($game, 'large_straight'));

        // Test Yatzy
        $game->diceValues = [5, 5, 5, 5, 5];
        $this->assertEquals(50, $engine->calculateScore($game, 'yatzy'));

        // Test chance
        $game->diceValues = [1, 2, 3, 4, 5];
        $this->assertEquals(15, $engine->calculateScore($game, 'chance'));
    }

    public function testUpdateOverallScore()
    {
        $engine = new YatzyEngine();
        $game = new YatzyGame();
        
        // Example scores
        $game->scores = [
            'ones' => 3,
            'twos' => 6,
            'threes' => 9,
            'fours' => 12,
            'fives' => 15,
            'sixes' => 18,
            'three_of_a_kind' => 20,
            'four_of_a_kind' => 24,
            'full_house' => 25,
            'small_straight' => 30,
            'large_straight' => 40,
            'yatzy' => 50,
            'chance' => 15
        ];
        
        $engine->updateOverallScore($game);

        // Sum of all scores + bonus (35 for reaching 63 in upper section)
        $expectedOverallScore = array_sum($game->scores) + 35;
        $this->assertEquals($expectedOverallScore, $game->overallScore);
        $this->assertEquals(35, $game->bonus);
    }
}
