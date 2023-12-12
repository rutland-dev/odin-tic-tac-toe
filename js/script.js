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

    const getBoard = () => board;

    const placeMark = (playerMark, cell) => {
        if (board[cell] === '') {
            board[cell] = playerMark;
        } else {
            console.log("invalid option");
        }
    };

    return {
        createBoard,
        getBoard,
        placeMark,
    };
};

const gameController = () => {
    const player1 = createPlayer('Player1', 'X');
    const player2 = createPlayer('Player2', 'O');
    const gameBoardFunctions = gameBoard();
    gameBoardFunctions.createBoard();
    let board = gameBoardFunctions.getBoard();
    
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

    const printNewRound = () => {
        console.log(board);
        console.log(`${currentPlayer.name}'s turn. Place your mark.`);
    };

    const playRound = (cell) => {
        gameBoardFunctions.placeMark(currentPlayer.mark, cell);
        currentPlayer.marks.push(cell);
        checkWin(currentPlayer.marks);
        if (checkWin(currentPlayer.marks).win) {
            console.log(`${currentPlayer.name} wins!`);
            currentPlayer.score += 3;
            return;
        } else if (checkWin(currentPlayer.marks).draw) {
            console.log('Draw!');
            player1.score += 1;
            player2.score += 1;
            return;
        }
        switchCurrentPlayer();
        printNewRound();
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
        printNewRound,
        getCurrentPlayer,
        getBoard,
        getPlayer1Score: player1.score,
        getPlayer2Score: player2.score,
    };
};

const screenController = () => {
    const game = gameController();
    const scoreDiv = document.getElementById('score');
    const turnDiv = document.getElementById('turn');
    const boardDiv = document.getElementById('board')

    const updateScreen = () => {
        scoreDiv.textContent = '';
        turnDiv.textContent = '';
        boardDiv.textContent = '';

        const board = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();
        const player1Score = game.getPlayer1Score;
        const player2Score = game.getPlayer2Score;

        scoreDiv.textContent = `Player 1: ${player1Score} - Player 2: ${player2Score}`;

        turnDiv.textContent = `${currentPlayer.name}'s turn. Place your mark.`;

        console.log(board);

        board.forEach((cell) => {
            const button = document.createElement('button');
            button.setAttribute('id', cell);
            boardDiv.appendChild(button);
        })
    };
    updateScreen();
};

screenController();