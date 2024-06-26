<?php
namespace Yatzy\Test;

use Yatzy\YatzyGame;
use PHPUnit\Framework\TestCase;

class YatzyGameTest extends TestCase
{
    public function testInitialGameState()
    {
        $game = new YatzyGame();
        $this->assertEquals(0, $game->rolls);
        $this->assertEquals(array_fill(0, 5, 0), $game->diceValues);
        $this->assertEquals(array_fill(0, 5, false), $game->keep);
    }

    public function testRollDice()
    {
        $game = new YatzyGame();
        $game->rollDice();
        $this->assertEquals(1, $game->rolls);
        foreach ($game->diceValues as $value) {
            $this->assertGreaterThanOrEqual(1, $value);
            $this->assertLessThanOrEqual(6, $value);
        }
    }
}
