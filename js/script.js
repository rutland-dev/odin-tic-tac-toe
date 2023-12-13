const createPlayer = (playerName, playerMark) => {
    let player = {
        name: playerName,
        mark: playerMark,
        score: 0,
        marks: [],
    };
    return player;
};

const gameBoard = () => {
    let board;
    const createBoard = () => {
        board = [
            '', '', '',
            '', '', '',
            '', '', '',
        ];
    };

    const resetBoard = () => {
        board = [
            '', '', '',
            '', '', '',
            '', '', '',
        ];
    }

    const getBoard = () => board;

    const placeMark = (playerMark, cell) => {
        board[cell] = playerMark;
    };

    return {
        createBoard,
        getBoard,
        placeMark,
        resetBoard,
    };
};

const gameController = () => {
    const player1 = createPlayer('Player1', 'X');
    const player2 = createPlayer('Player2', 'O');
    const gameBoardFunctions = gameBoard();
    gameBoardFunctions.createBoard();
    let board = gameBoardFunctions.getBoard();
    let message = `Player1's turn. Place your mark.`
    
    const getBoard = () => board;

    let currentPlayer = player1;

    const switchCurrentPlayer = () => {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    };

    const getCurrentPlayer = () => currentPlayer;

    const getScores = () => {
        let player1Score = player1.score;
        let player2Score = player2.score;
        return {
            player1Score,
            player2Score,
        }
    }

    const getMessage = () => message;

    const playAgain = () => {
        player1.marks = [];
        player2.marks = [];
        switchCurrentPlayer();
        gameBoardFunctions.resetBoard();
        board = gameBoardFunctions.getBoard();
    };

    const playRound = (cell) => {
        if (board[cell] === '') {
            gameBoardFunctions.placeMark(currentPlayer.mark, cell);
            currentPlayer.marks.push(cell);
            checkWin(currentPlayer.marks);
            if (checkWin(currentPlayer.marks).win) {
                message = `${currentPlayer.name} wins!`
                currentPlayer.score += 3;
                return message;
            } else if (checkWin(currentPlayer.marks).draw) {
                message = "Draw!";
                player1.score += 1;
                player2.score += 1;
                return;
            } else {
                switchCurrentPlayer();
        message = `${currentPlayer.name}'s turn. Place your mark.`;
        return;
            }
            } else {
                message = `Invalid selection. ${currentPlayer.name} try again.`;
                return;
        }
    };

    const checkWin = (marks) => {
        let board = gameBoardFunctions.getBoard();
        let win = false;
        let draw = false;
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
            [0, 4, 8], [2, 4, 6] //diagonals
        ];
        winConditions.forEach((condition) => {
            if (marks.includes(condition[0]) &&
                marks.includes(condition[1]) &&
                marks.includes(condition[2])) {
                    win = true;
                } else if (!board.includes('')) {
                    draw = true;
                }
        })
        return {
            win,
            draw,
        };
    };

    return {
        playRound,
        getCurrentPlayer,
        getBoard,
        getScores,
        getMessage,
        playAgain,
        checkWin,
    };
};

const screenController = () => {
    const game = gameController();
    const scoreDiv = document.getElementById('score');
    const turnDiv = document.getElementById('turn');
    const boardDiv = document.getElementById('board')
    let message = game.getMessage();

    const updateScreen = () => {
        scoreDiv.textContent = '';
        turnDiv.textContent = '';
        boardDiv.textContent = '';

        let board = game.getBoard();
        let currentPlayer = game.getCurrentPlayer();
        const player1Score = game.getScores().player1Score;
        const player2Score = game.getScores().player2Score;

        scoreDiv.textContent = `Player 1: ${player1Score} - Player 2: ${player2Score}`;

        turnDiv.textContent = game.getMessage();

        const playAgain = () => {
            const playButton = document.createElement('button');
            playButton.textContent = "Play Again";
            turnDiv.appendChild(playButton);
            playButton.addEventListener('click', () => {
                game.playAgain();
                board = game.getBoard();
                updateScreen();
            })
        }

        if (
            game.checkWin(currentPlayer.marks).win || 
            game.checkWin(currentPlayer.marks).draw) {
            playAgain();
        }

        let i = 0;
        
        board.forEach((cell) => {
            const button = document.createElement('button');
            button.setAttribute('id', i);
            i++;
            boardDiv.appendChild(button);
            button.textContent = cell;
            if (button.textContent === 'X' || button.textContent === 'O') {
                button.classList.add(cell);
            }
            button.addEventListener('click', () => {
                message = game.message;
                game.playRound(parseInt(button.id));
                updateScreen();
            });
        });

        
    };
    updateScreen();
    return {
        updateScreen,
    }
};

screenController();