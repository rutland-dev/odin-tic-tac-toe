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

const gameController = (player1, player2) => {
    const gameBoardFunctions = gameBoard();
    gameBoardFunctions.createBoard();
    let board = gameBoardFunctions.getBoard();
    let message = `${player1.name}'s turn. Place your mark.`;
    
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
        message = `${currentPlayer.name}'s turn. Place your mark.`
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
    let game;
    const scoreDiv = document.getElementById('score');
    const turnDiv = document.getElementById('turn');
    const boardDiv = document.getElementById('board')

    const modalDiv = document.getElementById('modal');
    const modalForm = document.createElement('form');
    modalDiv.appendChild(modalForm);
    const player1Label = document.createElement('label');
    player1Label.setAttribute('for', 'player-1-input');
    player1Label.textContent = "Player 1's name";
    modalForm.appendChild(player1Label);
    const player1Input = document.createElement('input');
    player1Input.setAttribute('type', 'text');
    player1Input.setAttribute('id', 'player-1-input');
    player1Input.setAttribute('name', 'player-1-input');
    player1Input.setAttribute('autofocus', 'autofocus');
    modalForm.appendChild(player1Input);
    const modalButtonsDiv = document.createElement('div');
    modalButtonsDiv.setAttribute('id', 'modal-buttons-div');
    modalForm.appendChild(modalButtonsDiv);
    const player1Button = document.createElement('button');
    player1Button.setAttribute('type', 'button');
    player1Button.textContent = "Next";
    modalButtonsDiv.appendChild(player1Button);
    player1Button.addEventListener('click', () => {
        let player1 = createPlayer(player1Input.value, 'X');
        getPlayer2(player1);
    });
    player1Input.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            let player1 = createPlayer(player1Input.value, 'X');
            getPlayer2(player1);
        }
    });

    const getPlayer2 = (player1) => {
        player1Button.removeEventListener('click', () => {
            let player1 = createPlayer(player1Input.value, 'X');
            getPlayer2(player1);
        });
        player1Input.removeEventListener('keypress', (event) => {
            if (event.key === "Enter") {
                let player1 = createPlayer(player1Input.value, 'X');
                getPlayer2(player1);
            }
        });
        player1Button.remove();
        while (modalForm.firstChild) {
            modalForm.removeChild(modalForm.lastChild);
        }
        const player2Label = document.createElement('label');
        player2Label.setAttribute('for', 'player-2-input');
        player2Label.textContent = "Player 2's name";
        modalForm.appendChild(player2Label);
        const player2Input = document.createElement('input');
        player2Input.setAttribute('type', 'text');
        player2Input.setAttribute('id', 'player-2-input');
        player2Input.setAttribute('name', 'player-2-input');
        modalForm.appendChild(player2Input);
        const modalButtonsDiv = document.createElement('div');
        modalForm.appendChild(modalButtonsDiv);
        const player2Button = document.createElement('button');
        player2Button.setAttribute('type', 'button');
        player2Button.textContent = "Play";
        modalButtonsDiv.appendChild(player2Button);
        player2Input.focus();
        player2Button.addEventListener('click', () => {
            let player2 = createPlayer(player2Input.value, 'O');
            game = gameController(player1, player2);
            updateScreen();
        });
        player2Input.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("player2 enter happened");
            let player2 = createPlayer(player2Input.value, 'O');
            game = gameController(player1, player2);
            updateScreen();
        }
    });
    };

    

    const updateScreen = () => {
        modalDiv.setAttribute('style', 'display: none');
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
    // updateScreen();
    return {
        updateScreen,
    }
};

screenController();