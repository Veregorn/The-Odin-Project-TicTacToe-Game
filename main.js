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
    const _modalContEnd = document.getElementById('mod-con-end');
    const _modalTitle = document.querySelector('.modal-title');
    const _tryAgain = document.getElementById('try-again');
    const _modalContForm = document.getElementById('mod-con-form');
    const _editPlayerNames = document.getElementById('edit-names');
    const _saveNames = document.getElementById('save-nms-btn');
    const _player1Input = document.getElementById('player-1');
    const _player2Input = document.getElementById('player-2');
    const _player1ShownName = document.getElementById('player-1-show-name');
    const _player2ShownName = document.getElementById('player-2-show-name');
    const _startBtn = document.getElementById('start-game');
    const _gameBoard = document.getElementById('game-board');
    const _resetBtn = document.getElementById('reset-game');
    const _human1Radio = document.getElementById('human-1');
    const _human2Radio = document.getElementById('human-2');
    const _ai1Radio = document.getElementById('ai-1');
    const _ai2Radio = document.getElementById('ai-2');
    const _easy1Radio = document.getElementById('easy-1');
    const _easy2Radio = document.getElementById('easy-2');
    const _hard1Radio = document.getElementById('hard-1');
    const _hard2Radio = document.getElementById('hard-2');
    
    // Adding Event Listeners to game-square class divs
    _gameSquares.forEach(element => {
        element.addEventListener('click', () => selectMov(element.id.slice(3)));
    });

    // Adding Event Listener to 'Try Again' button
    _tryAgain.addEventListener('click', () => {resetGame()});

    // Adding Event Listener to 'Edit Player Names' button
    _editPlayerNames.addEventListener('click', () => _modalContForm.classList.add('show'));

    // Adding Event Listener to 'Save' button
    _saveNames.addEventListener('click', () => {
        player1.setName(_player1Input.value);
        player2.setName(_player2Input.value);
        refreshPlayerNames();
        _modalContForm.classList.remove('show');
    });

    // Adding Event Listener to 'Start' button
    _startBtn.addEventListener('click', () => _gameBoard.classList.add('show'));

    // Adding Event Listener to 'Reset' button
    _resetBtn.addEventListener('click', () => resetGame());

    // Adding Event Listeners to radio buttons to enable-disable ai controls
    _human1Radio.addEventListener('click', () => {
        _easy1Radio.disabled = true;
        _hard1Radio.disabled = true;
    });
    _ai1Radio.addEventListener('click', () => {
        _easy1Radio.disabled = false;
        _hard1Radio.disabled = false;
    });
    _human2Radio.addEventListener('click', () => {
        _easy2Radio.disabled = true;
        _hard2Radio.disabled = true;
    });
    _ai2Radio.addEventListener('click', () => {
        _easy2Radio.disabled = false;
        _hard2Radio.disabled = false;
    });

    function refreshPlayerNames() {
        _player1ShownName.textContent = player1.getName();
        _player2ShownName.textContent = player2.getName();
    }

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
                _modalContEnd.classList.add('show');
            } else {
                // I need to check if there's a tie
                if (_movCounter == 9) {
                    _modalTitle.textContent = "There's a TIE. Nobody wins";
                    _modalContEnd.classList.add('show');
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
        _modalContEnd.classList.remove('show');
        _gameBoard.classList.remove('show');
        _movCounter = 1;
        _turnOwner = "X";
    }

    return {getTurnOwner}
})();

// A factory for the players
const Player = (type,name) => {
    // Only two possible values: 'human' OR 'ai'
    const _type = type;
    let _name = name;
    let _level = undefined;

    const getType = () => _type;

    const getName = () => _name;

    const setName = (name) => {
        if (name != "") {
            _name = name;
        }
    }
    
    const setLevel = (level) => {
        if (_type == "ai") {
            if (level == "easy" || level == "hard") {
                _level = level;
            } else {
                console.log("Invalid level entry. Level must be one of these: easy, hard");
            }
        } else {
            console.log("You can't set AI level in a human player");
        }
    }
    
    const getLevel = () => _level;
    
    // Function that generates auto movement for 'ia' type players
    // const genMov = () => ;

    return {
        getType,
        getName,
        setLevel,
        getLevel,
        setName
    };
};

//We need two players to play the game
const player1 = Player("human", "Player 1");
const player2 = Player("human", "Player 2");