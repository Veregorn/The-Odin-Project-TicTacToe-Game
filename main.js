// A module for the game board
let gameBoard = (function() {
    'use strict';

    // The game board is represented by a matrix of 3x3
    let _board = [["","",""],["","",""],["","",""]];

    function isEmpty(x,y) {
        if (_board[x][y] == "") {
            return true;
        } else {
            return false;
        }
    }

    // Returns an array with the empty positions (myArray = [[x,y],[y,z],[a,b]])
    function getEmptyPosArray() {
        let myArray = [];
        for (let i = 0; i < _board.length; i++) {
            for (let j = 0; j < _board[i].length; j++) {
                if (isEmpty(i,j)) {
                    myArray.push([i,j]);
                }
            }
        }
        return myArray;
    }

    function setBoard(x,y) {
        if ((0 <= x) && (x <= 2) && (0 <= y) && (y <= 2)) {
            const sign = displayController.getTurnOwner();
            if (sign == "X" || sign == "O") {
                if (isEmpty(x,y)) {
                    _board[x][y] = sign;
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

    function getBoardPos(x,y) {
        return _board[x][y];
    }

    function evaluateBoard() {
        // Checking for rows for X or O victory
        for (let row = 0; row < 3; row++) {
            if (_board[row][0] == _board[row][1] && _board[row][1] == _board[row][2]) {
                if (_board[row][0] == 'X') {
                    return +10;
                } else if (_board[row][0] == 'O') {
                    return -10;
                }
            }
        }

        // Checking for columns for X or O victory
        for (let col = 0; col < 3; col++) {
            if (_board[0][col] == _board[1][col] && _board[1][col] == _board[2][col]) {
                if (_board[0][col] == 'X') {
                    return +10;
                } else if (_board[0][col] == 'O') {
                    return -10;
                }
            }
        }

        // Checking for diagonals for X or O victory
        if (_board[0][0] == _board[1][1] && _board[1][1] == _board[2][2]) {
            if (_board[0][0] == 'X') {
                return +10;
            } else if (_board[0][0] == 'O') {
                return -10;
            }
        }
        if (_board[0][2] == _board[1][1] && _board[1][1] == _board[2][0]) {
            if (_board[0][2] == 'X') {
                return +10;
            } else if (_board[0][2] == 'O') {
                return -10;
            }
        }

        // Else if none of them have won, then return 0
        return 0;
    }

    function resetBoard() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                _board[i][j] = "";    
            }
        }
    }

    return {
        isEmpty,
        setBoard,
        getBoardPos,
        resetBoard,
        getEmptyPosArray,
        evaluateBoard
    }
})();

// A module for the game flow
let displayController = (function() {
    'use strict';

    let _turnOwner = "X";
    // The game has 9 max moves. In each mov the Counter increments by one
    let _movCounter = 1;
    // A mark that info about the state of the game
    let _gameFinished = true;
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
    const _modalContAI = document.getElementById('mod-con-ai');
    const _human1Radio = document.getElementById('human-1');
    const _human2Radio = document.getElementById('human-2');
    const _ai1Radio = document.getElementById('ai-1');
    const _ai2Radio = document.getElementById('ai-2');
    const _easy1Radio = document.getElementById('easy-1');
    const _easy2Radio = document.getElementById('easy-2');
    const _hard1Radio = document.getElementById('hard-1');
    const _hard2Radio = document.getElementById('hard-2');
    const _aiOptionsBtn = document.getElementById('ai-options');
    const _saveAIBtn = document.getElementById('save-ai-btn');
    const _player1Type = document.getElementById('player-1-type');
    const _player2Type = document.getElementById('player-2-type');
    
    // Adding Event Listeners to game-square class divs
    _gameSquares.forEach(element => {
        element.addEventListener('click', () => selectMov(element.id.slice(3,4), element.id.slice(4)));
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
    _startBtn.addEventListener('click', () => {
        _gameBoard.classList.add('show');
        _gameFinished = false;
        // If some player is an AI I need to generate a move
        if ((getTurnOwner() == "X") && (player1.getType() == "AI")) {
            const mov = player1.genMov();
            setTimeout(() => {selectMov(mov[0],mov[1]);}, 1000);
        }
        if ((getTurnOwner() == "O") && (player2.getType() == "AI")) {
            const mov = player2.genMov();
            setTimeout(() => {selectMov(mov[0],mov[1]);}, 1000);
        }
    });

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

    // Adding Event Listener to 'AI Options' button
    _aiOptionsBtn.addEventListener('click', () => _modalContAI.classList.add('show'));

    // Adding Event Listener to 'Save AI Options' button
    _saveAIBtn.addEventListener('click', () => {
        // Set values for player 1
        if (_human1Radio.checked) {
            player1.setType(_human1Radio.value);
        } else {
            player1.setType(_ai1Radio.value);
            if (_easy1Radio.checked) {
                player1.setLevel(_easy1Radio.value);
            } else {
                player1.setLevel(_hard1Radio.value);
            }
        }
        // Set values for player 2
        if (_human2Radio.checked) {
            player2.setType(_human2Radio.value);
        } else {
            player2.setType(_ai2Radio.value);
            if (_easy2Radio.checked) {
                player2.setLevel(_easy2Radio.value);
            } else {
                player2.setLevel(_hard2Radio.value);
            }
        }
        // Next we need to refresh player types to display
        refreshPlayerTypes();
        // At last, I change the opacity of the modal window
        _modalContAI.classList.remove('show');
    });

    function refreshPlayerTypes() {
        if (player1.getType() == "AI") {
            _player1Type.textContent = player1.getType() + ' - ' + player1.getLevel();
        } else {
            _player1Type.textContent = player1.getType();
        }
        if (player2.getType() == "AI") {
            _player2Type.textContent = player2.getType() + ' - ' + player2.getLevel();
        } else {
            _player2Type.textContent = player2.getType();
        }
    }

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

    function selectMov(x,y) {
        // First of all I need to check if the Square is occupied by another sign
        if (gameBoard.isEmpty(x,y)) {
            // Fill in the board array
            gameBoard.setBoard(x,y);
            // Paint the value on screen
            paintSquare(x,y);
            // I need to check if there is a winner
            const evaluation = gameBoard.evaluateBoard();
            if (evaluation == +10) {
                _modalTitle.textContent = player1.getName() + " wins!!!";
                _modalContEnd.classList.add('show');
                _gameFinished = true;
            } else if (evaluation == -10) {
                _modalTitle.textContent = player2.getName() + " wins!!!";
                _modalContEnd.classList.add('show');
                _gameFinished = true;
            } else if (_movCounter == 9) {
                // I need to check if there's a tie
                _modalTitle.textContent = "There's a TIE. Nobody wins";
                _modalContEnd.classList.add('show');
            } else {
                // If there is no winner and there is no tie, we can change the player turn and move the counter
                changeTurnOwner();
                _movCounter++;
            }
        } else {
            console.log("You are trying to fill an occupied square!!!");
        }
        // At last, I check if next turn is for an AI player, in that case I call my function selectMov() recursively
        if ((getTurnOwner() == "X") && (player1.getType() == "AI") && (!_gameFinished)) {
            const mov = player1.genMov();
            setTimeout(() => {selectMov(mov[0],mov[1]);}, 1000);
        }
        if ((getTurnOwner() == "O") && (player2.getType() == "AI") && (!_gameFinished)) {
            const mov = player2.genMov();
            setTimeout(() => {selectMov(mov[0],mov[1]);}, 1000);
        }
    }

    // Writes the value on screen
    function paintSquare(x,y) {
        const square = document.getElementById('gs-' + x + y);
        square.textContent = gameBoard.getBoardPos(x,y);
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
    // Only two possible values: 'human' OR 'AI'
    let _type = type;
    let _name = name;
    let _level = undefined;

    const getType = () => _type;

    const setType = (type) => _type = type;

    const getName = () => _name;

    const setName = (name) => {
        if (name != "") {
            _name = name;
        }
    }
    
    const setLevel = (level) => {
        if (_type == "AI") {
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
    const genMov = () => {
        // We need to chose AI mov from the empty squares
        const myArray = gameBoard.getEmptyPosArray();
        let result;
        if (getLevel() == "easy") {
            // Simply return a random value
            result = myArray[Math.floor(Math.random()*myArray.length)];
        } else {
            // Here I need to implement my Minimax Algorithm
            result = myArray[Math.floor(Math.random()*myArray.length)];
        }
        return result;
    };

    return {
        getType,
        setType,
        getName,
        setLevel,
        getLevel,
        setName,
        genMov
    };
};

//We need two players to play the game
const player1 = Player("human", "Player 1");
const player2 = Player("human", "Player 2");