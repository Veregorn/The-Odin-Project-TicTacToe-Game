// A module for the game board
let gameBoard = (function() {
    'use strict';

    let _board = ["X","O","O","X","X","O","X","O","X"];

    function printBoard() {
        const gameSquares = document.querySelectorAll('.game-square');
        for (let i = 0; i < gameSquares.length; i++) {
            const square = gameSquares[i];
            square.textContent = _board[i];
        }
    }

    return {
        printBoard
    }
})();

// A module for the game flow
let displayController = (function() {
    'use strict';
})();

// A factory for the players
const Player = (type) => {
    // Only two possible values: 'human' OR 'ia'
    const _type = type;
    let _level = undefined;
    const getType = () => _type;
    const setLevel = (level) => {
        if (_type == "ia") {
            if (level == "easy" || level == "medium" || level == "hard") {
                _level = level;
            } else {
                console.log("Invalid level entry. Level must be one of these: easy, medium, hard");
            }
        } else {
            console.log("You can't set IA level in a human player");
        }
    }
    const getLevel = () => _level;
    // Function that generates auto movement for 'ia' type players
    // const genMov = () => ;

    return {getType,setLevel,getLevel};
};

//We need two players to play the game
const player1 = Player("human");
const player2 = Player("human");

gameBoard.printBoard();