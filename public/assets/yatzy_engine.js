function calculateScore(game, scoreBox) {
    const dice = game.dice;
    const counts = new Array(6).fill(0);
    dice.forEach(die => counts[die - 1]++);
    
    switch (scoreBox) {
        case 'ones':
            return game.dice.filter(die => die === 1).length; //returns how many 1's there were 

            // would have to do for all possible scores of yahtzy 
        case 'twos':

        case 'threes':

        case 'fours':

        case 'fives':

        case 'sixes':

        case 'one-pair':

        case 'two-pairs':

        case 'three of a kind':

        case 'four of a kind':

        case 'small straight':

        case 'large straight':

        case 'full house':

        case 'chance':

        case 'yatzy':
            return 50;


            
        default:
            return 0;
    }
}

function updateOverallScore(game) {
    game.score = 0; 
    game.bonus = 0; 
    // Change code here to actually update overall score
}
