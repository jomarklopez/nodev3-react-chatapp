import React, { useState, useEffect } from 'react';
import socket from '../socket';

const TicTacToe = () => {
    /**
     * TIC TAC TOE
     *  - Has 6 buttons
     *  - Checks for winner every click
     *  - Has Diagonal,Horizontal, Vertical win patterns
     *    DIAGONAL WIN
     *       1-5-9
     *       3-5-7
     *    HORIZONAL WIN
     *       1-2-3
     *       4-5-6
     *       7-8-9
     *    VERTICAL WIN
     *       1-4-7
     *       2-5-8
     *       3-6-9
     *  - Shares information on the current filled buttons or numbers in an array indicating the buttons clicked
     *  - Server then checks for a winner with the data sent by client
     *  - If there is a winner then send to clients via chat message the name of the winner and also send to the game state that the game is finished and there is a declared winner.
     */

    const [gameboard, setGameboard] = useState([
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        ' '
    ]);
    const [matchMoves, setMatchMoves] = useState(1);
    const [chosenSymbol, setChosenSymbol] = useState('');
    const [playerMoves, setPlayerMoves] = useState([]);
    const [gameFinish, setGameFinish] = useState({
        inGame: false,
        winner: null
    });

    useEffect(() => {
        socket.on('gameMoves', ({ matchMoves, move }) => {
            updateGameMoves({ matchMoves, move });
        });

        return () => {
            socket.off();
        };
    });
    // GAME STATE FUNCTIONS

    function updateGameMoves({ matchMoves, move }) {
        // Add message object containing the text, creation date, and username of sender
        // Moves determine in which index should the symbol be placed
        let newPlayerMoves = [...gameboard];
        newPlayerMoves[move.index] = move.chosenSymbol;
        setGameboard(newPlayerMoves);
        setMatchMoves(matchMoves);
        addPlayerMove(move);
        // Check for winner
        if (checkWin() && !gameFinish.inGame) {
            setGameFinish({
                inGame: true,
                winner: `${chosenSymbol} WINS!`
            });
        }
    }

    function onSymbolSelect(symbol) {
        setChosenSymbol(symbol);
    }

    function addPlayerMove(move) {
        if (move.chosenSymbol === chosenSymbol) {
            setPlayerMoves((playerMoves) => [...playerMoves, move.index]);
        }
    }

    function checkWin() {
        const horizontalCheckPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ];
        const verticalCheckPatterns = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]
        ];
        const diagonalCheckPatterns = [
            [0, 4, 8],
            [2, 4, 6]
        ];

        // Iterate through possible horizontal patterns
        for (let pattern of horizontalCheckPatterns) {
            // Checks if a pattern matches with the player's moveset
            for (let n of pattern) {
                if (!playerMoves.includes(n)) {
                    break;
                }
                if (n === pattern[pattern.length - 1]) {
                    return true;
                }
            }
        }

        // Iterate through possible vertical patterns
        for (let pattern of verticalCheckPatterns) {
            // Checks if a pattern matches with the player's moveset
            for (let n of pattern) {
                if (!playerMoves.includes(n)) {
                    break;
                }
                if (n === pattern[pattern.length - 1]) {
                    return true;
                }
            }
        }

        // Iterate through possible diagonal patterns
        for (let pattern of diagonalCheckPatterns) {
            // Checks if a pattern matches with the player's moveset
            for (let n of pattern) {
                if (!playerMoves.includes(n)) {
                    break;
                }
                if (n === pattern[pattern.length - 1]) {
                    return true;
                }
            }
        }
    }

    // SOCKET FUNCTIONS

    function sendPlayerMove(move) {
        // If there is no placement at the gameboard then emit the move

        if (gameboard[move.index] === ' ') {
            socket.emit('newMove', { matchMoves, move }, (error) => {
                if (error) {
                    alert(error);
                }
                console.log('The move was delivered');
            });
        } else {
            alert("There's already a symbol there!");
        }
    }

    // RENDER FUNCTIONS
    function renderChooseButtons() {
        if (!chosenSymbol) {
            return (
                <>
                    <button
                        type="choose__btn"
                        onClick={() => onSymbolSelect('X')}
                    >
                        X
                    </button>
                    <div>OR</div>
                    <button
                        type="choose__btn"
                        onClick={() => onSymbolSelect('O')}
                    >
                        O
                    </button>
                </>
            );
        }
    }
    function renderButtons() {
        if (chosenSymbol && !gameFinish.inGame) {
            return (
                <div className="game__btns">
                    {gameboard.map((content, index = 0) => {
                        return (
                            <div
                                id={index}
                                key={index}
                                className="grid-item"
                                onClick={() => {
                                    sendPlayerMove({ index, chosenSymbol });
                                }}
                            >
                                <p>{content}</p>
                            </div>
                        );
                    })}
                </div>
            );
        } else if (gameFinish.inGame) {
            return <h1>{gameFinish.winner}</h1>;
        } else {
            return <h1> Please select your symbols </h1>;
        }
    }

    return (
        <>
            <div className="tictactoe__container">
                <div className="choose__btns-container">
                    {renderChooseButtons()}
                </div>
                {renderButtons()}
            </div>
        </>
    );
};

export default TicTacToe;
