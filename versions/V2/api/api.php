<?php
session_start();

require '../dice.php';
require '../YatzyEngine.php';
require '../YatzyGame.php';

use Yatzy\Dice;
use Yatzy\YatzyEngine;
use Yatzy\YatzyGame;

// Initialize game state if not already set
if (!isset($_SESSION['game_state'])) {
    $_SESSION['game_state'] = new YatzyGame();
}

// Function to roll the dice
function rollDice() {
    $_SESSION['game_state']->rollDice();
    return $_SESSION['game_state']->diceValues;
}

// Function to calculate the score for a given score box
function calculateScore($scoreBox) {
    $engine = new YatzyEngine();
    $score = $engine->calculateScore($_SESSION['game_state'], $scoreBox);
    $_SESSION['game_state']->scores[$scoreBox] = $score;
    $engine->updateOverallScore($_SESSION['game_state']);
    return $score;
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    switch ($action) {
        case 'start_game':
            $_SESSION['game_state'] = new YatzyGame();
            echo json_encode(['success' => true, 'game_state' => $_SESSION['game_state']]);
            break;
        case 'roll_dice':
            $dice = rollDice();
            echo json_encode(['success' => true, 'dice' => $dice, 'rolls_left' => 3 - $_SESSION['game_state']->rolls]);
            break;
        case 'submit_score':
            $scoreBox = $_POST['scoreBox'];
            $score = calculateScore($scoreBox);
            echo json_encode([
                'success' => true, 
                'score' => $score, 
                'total_score' => $_SESSION['game_state']->overallScore, 
                'bonus' => $_SESSION['game_state']->bonus,
                'leaderboard' => $_SESSION['leaderboard']
            ]);
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

