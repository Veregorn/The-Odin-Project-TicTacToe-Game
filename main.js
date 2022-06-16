// A module for the game board
let gameBoard = (function() {
    'use strict';

    let _board = ["","","","","","","","",""];

    function isEmpty(pos) {
        if (_board[pos] == "") {
            return true;
        } else {
            return false;
        }
    }

    function setBoard(pos) {
        if ((0 <= pos) && (pos <= 8)) {
            const sign = displayController.getTurnOwner();
            if (sign == "X" || sign == "O") {
                if (isEmpty(pos)) {
                    _board[pos] = sign;
                } else {
                    console.log("Position already occupied!!!");
                }
            } else {
                console.log("Invalid player sign received!!!");
            }
        } else {
            console.log("Invalid array index received!!!");
        }
    }

    function getBoardPos(pos) {
        return _board[pos];
    }

    function isWinner(sign) {
        // There is an X axis win of sign
        if (((getBoardPos(0) == getBoardPos(1)) && (getBoardPos(1) == getBoardPos(2)) && (getBoardPos(2) == sign)) || ((getBoardPos(3) == getBoardPos(4)) && (getBoardPos(4) == getBoardPos(5)) && (getBoardPos(5) == sign)) || ((getBoardPos(6) == getBoardPos(7)) && (getBoardPos(7) == getBoardPos(8)) && (getBoardPos(8) == sign))) {
            return true;
        // There is an Y axis win of sign
        } else if (((getBoardPos(0) == getBoardPos(3)) && (getBoardPos(3) == getBoardPos(6)) && (getBoardPos(6) == sign)) || ((getBoardPos(1) == getBoardPos(4)) && (getBoardPos(4) == getBoardPos(7)) && (getBoardPos(7) == sign)) || ((getBoardPos(2) == getBoardPos(5)) && (getBoardPos(5) == getBoardPos(8)) && (getBoardPos(8) == sign))) {
            return true;
        // There is a diagonal win of sign
        } else if (((getBoardPos(0) == getBoardPos(4)) && (getBoardPos(4) == getBoardPos(8)) && (getBoardPos(8) == sign)) || ((getBoardPos(2) == getBoardPos(4)) && (getBoardPos(4) == getBoardPos(6)) && (getBoardPos(6) == sign))) {
            return true;
        } else {
            return false;
        }
    }

    function resetBoard() {
        for (let i = 0; i < 9; i++) {
            _board[i] = "";
        }
    }

    return {
        isEmpty,
        setBoard,
        getBoardPos,
        isWinner,
        resetBoard
    }
})();

// A module for the game flow
let displayController = (function() {
    'use strict';

    let _turnOwner = "X";
    // The game has 9 max moves. In each mov the Counter increments by one
    let _movCounter = 1;
    // DOM attributes
    const _gameSquares = document.querySelectorAll('.game-square');
    const _modalContainer = document.querySelector('.modal-container');
    const _modalTitle = document.querySelector('.modal-title');
    const _tryAgain = document.getElementById('try-again');
    
    // Adding Event Listeners to game-square class divs
    _gameSquares.forEach(element => {
        element.addEventListener('click', () => selectMov(element.id.slice(3)));
    });

    // Adding Event Listener to 'Try Again' button
    _tryAgain.addEventListener('click', () => {resetGame()});

    function changeTurnOwner() {
        if (_turnOwner == "X") {
            _turnOwner = "O";
        } else {
            _turnOwner = "X";
        }
    }

    function getTurnOwner() {
        return _turnOwner;
    }

    function selectMov(pos) {
        // First of all I need to check if the Square is occupied by another sign
        if (gameBoard.isEmpty(pos)) {
            // Fill in the board array
            gameBoard.setBoard(pos);
            // Paint the value on screen
            paintSquare(pos);
            // I need to check if there is a winner
            if (gameBoard.isWinner(getTurnOwner())) {
                if (getTurnOwner() == "X") {
                    _modalTitle.textContent = player1.getName() + " wins!!!";
                } else {
                    _modalTitle.textContent = player2.getName() + " wins!!!";
                }
                _modalContainer.classList.add('show');
            } else {
                // I need to check if there's a tie
                if (_movCounter == 9) {
                    _modalTitle.textContent = "There's a TIE. Nobody wins";
                    _modalContainer.classList.add('show');
                } else {
                    // If there is no winner and there is no tie, we can change the player turn and move the counter
                    changeTurnOwner();
                    _movCounter++;
                }
            }
        } else {
            console.log("You are trying to fill an occupied square!!!");
        }
    }

    // Writes the value on screen
    function paintSquare(pos) {
        _gameSquares[pos].textContent = gameBoard.getBoardPos(pos);
    }

    // Clear all the signs in the displaying board
    function cleanDisplay() {
        for (let i = 0; i < 9; i++) {
            _gameSquares[i].textContent = "";
        }
    }

    // Reset all the game values for a new one
    function resetGame() {
        gameBoard.resetBoard();
        cleanDisplay();
        _modalContainer.classList.remove('show');
        _movCounter = 1;
        _turnOwner = "X";
    }

    return {getTurnOwner}
})();

// A factory for the players
const Player = (type,name) => {
    // Only two possible values: 'human' OR 'ia'
    const _type = type;
    const _name = name;
    let _level = undefined;

    const getType = () => _type;

    const getName = () => _name;
    
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

    return {
        getType,
        getName,
        setLevel,
        getLevel
    };
};

//We need two players to play the game
const player1 = Player("human", "Bill");
const player2 = Player("human", "John");