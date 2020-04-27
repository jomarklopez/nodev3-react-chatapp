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
    const [gameState, setGameState] = useState({
        gameOver: false,
        playerNums: 0,
        winner: null
    });

    useEffect(() => {
        console.log(playerMoves);
        socket.on('gameMoves', ({ matchMoves, move }) => {
            updateGameMoves({ matchMoves, move });
        });

        socket.on('gameOver', (winner) => {
            setGameState({
                gameOver: true,
                playerNums: 0,
                winner
            });
        });

        return () => {
            socket.off();
        };
    });

    useEffect(() => {
        socket.emit('checkWin', playerMoves, (error) => {
            if (error) {
                alert(error);
            }
            console.log('Player moves was delivered');
        });
    }, [playerMoves]);
    // GAME STATE FUNCTIONS

    function updateGameMoves({ matchMoves, move }) {
        // Add message object containing the text, creation date, and username of sender
        // Moves determine in which index should the symbol be placed
        let newPlayerMoves = [...gameboard];
        newPlayerMoves[move.index] = move.chosenSymbol;
        setGameboard(newPlayerMoves);
        setMatchMoves(matchMoves);
        addPlayerMove(move);
    }

    function onSymbolSelect(symbol) {
        setChosenSymbol(symbol);
    }

    function addPlayerMove(move) {
        if (move.chosenSymbol === chosenSymbol) {
            setPlayerMoves((playerMoves) => [...playerMoves, move.index]);
        }
    }

    // SOCKET FUNCTIONS

    function sendPlayerMove(move) {
        // If there is no placement at the gameboard then emit the move
        // Check for winner
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
        if (chosenSymbol && !gameState.gameOver) {
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
        } else if (gameState.gameOver) {
            return (
                <>
                    <h1>{gameState.winner} wins!</h1>
                    <button onClick={console.log('play again!')}>
                        Play Again?
                    </button>
                </>
            );
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
