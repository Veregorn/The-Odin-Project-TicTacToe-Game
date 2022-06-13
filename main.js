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
const Player = () => {

};

//We need two players to play the game
const player1 = Player();
const player2 = Player();

gameBoard.printBoard();