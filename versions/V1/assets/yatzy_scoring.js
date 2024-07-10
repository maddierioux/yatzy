function calculateScore(game, scoreType) {
    const dice = game.dice;
    const counts = new Array(6).fill(0);
    dice.forEach(die => counts[die - 1]++); //Increments the count array on how many of each value are present on the set of die
    
    switch (scoreType) {
        case 'ones': //Calculates the number of 1s and the sum
            return counts[0];

        case 'twos': //Calculates the number of 2s and the sum
            return counts[1]*2;

        case 'threes': //Calculates the number of 3s and the sum
            return counts[2]*3;

        case 'fours': //Calculates the number of 4s and the sum
            return counts[3]*4;

        case 'fives': //Calculates the number of 5s and the sum
            return counts[4]*5;

        case 'sixes': //Calculates the number of 6s and the sum
            return counts[5]*6;

        case 'onePair': //Calculates the highest the value pair
            const highestPair = 0;
            for(i = 0; i < 6; i++){
                if(counts[i] >= 2){
                    highestPair = i+1;
                }
            }

            return highestPair*2;

        case 'twoPairs':
            const pairs = [];
            for(i = 0; i < 6; i++){
                if(counts[i] == 2){
                    pairs.push(i+1);
                }
            }
            if(pairs.length >= 2){
                pairs.sort();
                pairs.reverse();
                return pairs[0]*2 + pairs[1]*2;
            }else{
                return 0;
            }


        case 'three-of-a-kind': //Checks what the highest group of 3 die
            const highestThree = 0;
            for(i = 0; i < 6; i++){
                if(counts[i] >= 3){
                    highestThree = i+1;
                }
            }

            return highestThree*3;

        case 'four-of-a-kind': //Checks what the highest group of 4 die
            const highestFour = 0;
            for(i = 0; i < 6; i++){
                if(counts[i] >= 4){
                    highestFour = i+1;
                }
            }
            return highestFour*4;
    
        case 'small-straight': //Checks if the player has the dice 1-2-3-4-5
            if(counts[0] == 1 && counts[1] == 1 && counts[2] == 1 && counts[3] == 1 && counts[4] == 1) {
                return 15;
            }

            return 0; //If they don't have the correct combination, return 0

        case 'large-straight': //Checks if the player has the dice 2-3-4-5-6
            if(counts[1] == 1 && counts[2] == 1 && counts[3] == 1 && counts[4] == 1 && counts[5] == 1) {
                return 25;
            }

            return 0; //If they don't have the correct combination, return 0

        case 'full-house': //Checks if the player has a full house
            const pair = false;
            const trio = false;

            const pairTotal = 0;
            const trioTotal = 0;

            for(i = 0; i<6; i++){
                if(counts[i] == 2){
                    pair = true;
                    pairTotal = (i+1)*2
                }else if(counts[i] == 3){
                    trio = true;
                    trioTotal = (i+1)*3
                }
            }

            if(pair && trio){
                return pairTotal + trioTotal;   
            }else{ 
                return 0;
            }

        case 'chance':
            return counts[0] + counts[1] + counts[2] + counts[3] + counts[4] + counts[5];

        case 'yatzy': //Checks if the player has a yatzy
            if(counts[0] == 5 &&counts[1] == 5 && counts[2] == 5 && counts[3] == 5 && counts[4] == 5 && counts[5] == 5) {
                return 50;    
            }

            return 0;
             
        default:
            return 0;
    }
}

function updateOverallScore(game) {
    game.score = 0; 
    game.bonus = 0; 
    // Change code here to actually update overall score
}
