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

    function setBoard(pos, sign) {
        if ((0 <= pos) && (pos <= 8)) {
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

    return {
        isEmpty,
        setBoard,
        getBoardPos
    }
})();

// A module for the game flow
let displayController = (function() {
    'use strict';

    // '1' if is turn for Player 1 and '2' if is turn for Player 2
    let _turnOwner = 1;
    // The game has 9 max moves. In each mov the Counter increments by one
    let _movCounter = 1;
    const _gameSquares = document.querySelectorAll('.game-square');

    // Adding Event Listeners to game-square class divs
    _gameSquares.forEach(element => {
        element.addEventListener('click', () => selectMov(element.id.slice(3)));
    });

    function selectMov(pos) {
        // First of all I need to check if the Square is occupied by another sign
        if (gameBoard.isEmpty(pos)) {
            // Fill in the board array with the correct value
            if (_turnOwner == 1) {
                gameBoard.setBoard(pos, "X");
                _turnOwner = 2;
            } else {
                gameBoard.setBoard(pos, "O");
                _turnOwner = 1;
            }
            // Paint the value on screen
            paintSquare(pos);
            _movCounter++;
        } else {
            console.log("You are trying to fill an occupied square!!!");
        }
    }

    // Writes the value on screen
    function paintSquare(pos) {
        _gameSquares[pos].textContent = gameBoard.getBoardPos(pos);
    }

    return {
        selectMov,
        paintSquare
    }
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
    
    // Function that captures a human player movement in the game

    return {getType,setLevel,getLevel};
};

//We need two players to play the game
const player1 = Player("human");
const player2 = Player("human");