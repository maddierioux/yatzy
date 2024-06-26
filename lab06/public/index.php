<?php
require_once('_config.php');

use Yatzy\YatzyGame;

$game = new YatzyGame();

for ($turn = 1; $turn <= 3; $turn++) {
    $game->rollDice();
    echo "Turn {$turn} Dice: " . implode(', ', $game->diceValues) . "<br>";
}
