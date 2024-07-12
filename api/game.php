<?php
session_start();

if (!isset($_SESSION['gameState'])) {
    initializeGame();
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'rollDice':
        rollDice();
        break;
    case 'placeScore':
        $scoreType = $_GET['scoreType'];
        placeScore($scoreType);
        break;
    case 'saveScore':
        $score = $_GET['score'];
        saveScore($score);
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

function initializeGame() {
    $_SESSION['gameState'] = [
        'dice' => [],
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
    echo json_encode([
        'scores' => $_SESSION['gameState']['scores'],
        'usedScores' => $_SESSION['gameState']['usedScores'],
        'totalScore' => $_SESSION['gameState']['totalScore']
    ]);
}

function rollDice() {
    $dice = [];
    for ($i = 0; $i < 5; $i++) {
        $dice[] = rand(1, 6);
    }
    $_SESSION['gameState']['dice'] = $dice;
    $scoreOptions = calculateScoreOptions($dice);
    echo json_encode([
        'dice' => $dice,
        'scoreOptions' => $scoreOptions
    ]);
}

function placeScore($scoreType) {
    $dice = $_SESSION['gameState']['dice'];
    $scoreOptions = calculateScoreOptions($dice);
    $score = $scoreOptions[$scoreType];
    $_SESSION['gameState']['scores'][$scoreType] = $score;
    $_SESSION['gameState']['usedScores'][$scoreType] = true;
    $_SESSION['gameState']['totalScore'] += $score;

    echo json_encode([
        'scores' => $_SESSION['gameState']['scores'],
        'usedScores' => $_SESSION['gameState']['usedScores'],
        'totalScore' => $_SESSION['gameState']['totalScore']
    ]);
}

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

function saveScore($score) {
    if (!isset($_SESSION['gameState']['leaderboard'])) {
        $_SESSION['gameState']['leaderboard'] = [];
    }
    $_SESSION['gameState']['leaderboard'][] = ['score' => $score];
    usort($_SESSION['gameState']['leaderboard'], function($a, $b) {
        return $b['score'] - $a['score'];
    });
    $_SESSION['gameState']['leaderboard'] = array_slice($_SESSION['gameState']['leaderboard'], 0, 10);
    echo json_encode(['success' => true]);
}

function getLeaderboard() {
    $leaderboard = $_SESSION['gameState']['leaderboard'] ?? [];
    echo json_encode(['leaderboard' => $leaderboard]);
}
?>

