<?php
session_start();

// Debugging
ini_set('display_errors', 0); // Disable displaying errors - This is what was causing errors 

// Initialize the game state if it hasn't been set
if (!isset($_SESSION['gameState'])) {
    initializeGame();
}

//$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';


// Route the request to the appropriate function based on the action parameter
switch ($action) {
    case 'rollDice':
        $held = json_decode($_GET['heldDice'], true);;
        rollDice($held);
        break;
    case 'placeScore':
        $scoreType = $_GET['scoreType'] ?? '';
        if (!empty($scoreType)) {
            placeScore($scoreType);
        } else {
            echo json_encode(['error' => 'Invalid score type']);
        }
        break;
    case 'saveScore':
        $score = $_GET['score'] ?? '';
        if (!empty($score)) {
            saveScore($score);
        } else {
            echo json_encode(['error' => 'Invalid score']);
        }
        break;
    case 'getLeaderboard':
        getLeaderboard();
        break;
    case 'newGame':
        initializeGame();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

// Function to initialize the game state
function initializeGame() {
    $_SESSION['gameState'] = [
        'dice' => [1, 1, 1, 1, 1],
        'heldDice' => [false, false, false, false, false],
        'scores' => [
            'ones' => null, 'twos' => null, 'threes' => null, 'fours' => null, 'fives' => null, 'sixes' => null,
            'three-of-a-kind' => null, 'four-of-a-kind' => null, 'full-house' => null, 'small-straight' => null,
            'large-straight' => null, 'chance' => null, 'yatzy' => null
        ],
        'usedScores' => [
            'ones' => false, 'twos' => false, 'threes' => false, 'fours' => false, 'fives' => false, 'sixes' => false,
            'three-of-a-kind' => false, 'four-of-a-kind' => false, 'full-house' => false, 'small-straight' => false,
            'large-straight' => false, 'chance' => false, 'yatzy' => false
        ],
        'totalScore' => 0,
        'leaderboard' => []
    ];

    header('Content-Type: application/json');
    echo json_encode([
        'scores' => $_SESSION['gameState']['scores'],
        'usedScores' => $_SESSION['gameState']['usedScores'],
        'totalScore' => $_SESSION['gameState']['totalScore']
    ]);
}

// Function to roll the dice and calculate score options
function rollDice($held) {
    if (!isset($_SESSION['gameState']['heldDice']) || !is_array($_SESSION['gameState']['heldDice'])) {
        $_SESSION['gameState']['heldDice'] = [false, false, false, false, false];
    }

    $_SESSION['gameState']['heldDice'] = $held;
    
    $dice = $_SESSION['gameState']['dice'];
    $heldDice = $_SESSION['gameState']['heldDice'];
    
    for ($i = 0; $i < 5; $i++) {
        if (!$heldDice[$i]) {
            $dice[$i] = rand(1, 6);
        }
    }
    $_SESSION['gameState']['dice'] = $dice;
    $scoreOptions = calculateScoreOptions($dice);

    header('Content-Type: application/json');
    echo json_encode([
        'dice' => $dice,
        'scoreOptions' => $scoreOptions,
        'heldDice' => $heldDice
    ]);
}

// Function to place the score for the selected score type
function placeScore($scoreType) {
    $dice = $_SESSION['gameState']['dice'];
    $scoreOptions = calculateScoreOptions($dice);
    $score = $scoreOptions[$scoreType];
    $_SESSION['gameState']['scores'][$scoreType] = $score;
    $_SESSION['gameState']['usedScores'][$scoreType] = true;
    $_SESSION['gameState']['totalScore'] += $score;

    header('Content-Type: application/json');
    echo json_encode([
        'scores' => $_SESSION['gameState']['scores'],
        'usedScores' => $_SESSION['gameState']['usedScores'],
        'totalScore' => $_SESSION['gameState']['totalScore']
    ]);
}

// Function to calculate the possible score options based on the dice roll
function calculateScoreOptions($dice) {
    $counts = array_count_values($dice);
    $scoreOptions = [
        'ones' => 0, 'twos' => 0, 'threes' => 0, 'fours' => 0, 'fives' => 0, 'sixes' => 0,
        'three-of-a-kind' => 0, 'four-of-a-kind' => 0, 'full-house' => 0, 'small-straight' => 0,
        'large-straight' => 0, 'chance' => array_sum($dice), 'yatzy' => 0
    ];

    foreach ($counts as $num => $count) {
        switch ($num) {
            case 1:
                $scoreOptions['ones'] = $num * $count;
                break;
            case 2:
                $scoreOptions['twos'] = $num * $count;
                break;
            case 3:
                $scoreOptions['threes'] = $num * $count;
                break;
            case 4:
                $scoreOptions['fours'] = $num * $count;
                break;
            case 5:
                $scoreOptions['fives'] = $num * $count;
                break;
            case 6:
                $scoreOptions['sixes'] = $num * $count;
                break;
        }
        if ($count >= 3) {
            $scoreOptions['three-of-a-kind'] = array_sum($dice);
        }
        if ($count >= 4) {
            $scoreOptions['four-of-a-kind'] = array_sum($dice);
        }
        if ($count == 5) {
            $scoreOptions['yatzy'] = 50;
        }
    }

    if (count($counts) == 2 && in_array(3, $counts) && in_array(2, $counts)) {
        $scoreOptions['full-house'] = 25;
    }

    $uniqueDice = array_keys($counts);
    sort($uniqueDice);
    if (count($uniqueDice) >= 4 && ($uniqueDice == [1, 2, 3, 4] || $uniqueDice == [2, 3, 4, 5] || $uniqueDice == [3, 4, 5, 6])) {
        $scoreOptions['small-straight'] = 30;
    }
    if ($uniqueDice == [1, 2, 3, 4, 5] || $uniqueDice == [2, 3, 4, 5, 6]) {
        $scoreOptions['large-straight'] = 40;
    }

    return $scoreOptions;
}

// Function to save the score to the leaderboard
function saveScore($score) {
    if (!isset($_SESSION['gameState']['leaderboard'])) {
        $_SESSION['gameState']['leaderboard'] = [];
    }
    $_SESSION['gameState']['leaderboard'][] = ['score' => $score];
    usort($_SESSION['gameState']['leaderboard'], function($a, $b) {
        return $b['score'] - $a['score'];
    });
    $_SESSION['gameState']['leaderboard'] = array_slice($_SESSION['gameState']['leaderboard'], 0, 10);

    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
}

// Function to get the leaderboard
function getLeaderboard() {
    $leaderboard = $_SESSION['gameState']['leaderboard'] ?? [];
    header('Content-Type: application/json');
    echo json_encode(['leaderboard' => $leaderboard]);
}

