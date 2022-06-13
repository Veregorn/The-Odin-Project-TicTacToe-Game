# The-Odin-Project-TicTacToe-Game
A Tic Tac Toe Web game to practice with the module pattern in Javascript

The gameboard is stored as an array inside of a Gameboard object. Players are also stored in objects and there is another object to control game flow.
The goal is to have as little global code as possible, placing everything inside a module (one instance) or a factory (multiple instances). With this in mind, our players must be factories and gameBoard, displayController must be modules.