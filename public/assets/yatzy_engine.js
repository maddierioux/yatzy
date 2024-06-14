function calculateScore(game, scoreBox) {
    const dice = game.dice;
    const counts = new Array(6).fill(0);
    dice.forEach(die => counts[die - 1]++);
    
    switch (scoreBox) {
        case 'ones':
            return game.dice.filter(die => die === 1).length; //returns how many 1's there were 

            // would have to do for all possible scores of yahtzy 
        default:
            return 0;
    }
}

function updateOverallScore(game) {
    game.score = 0; 
    game.bonus = 0; 
    // Change code here to actually update overall score
}
