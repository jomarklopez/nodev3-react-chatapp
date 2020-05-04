import React, { useState, useEffect, useContext } from 'react';

import socket from '../socket';

const TicTacToe = (props) => {
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

    /**
     *
     * Create a gamedata state to emit to socketio
     * This game data will contain every player's information:
     *  1. Players Data
     *      a. Chosen Symbols
     *      b. Moves
     *  2. Game State
     *      a. Is the game over
     *      b. Whose turn it is
     *      c. Is there a winner
     *
     */
    const [playersData, setPlayersData] = useState([
        {
            username: '',
            symbol: '',
            playerMoves: []
        }
    ]);

    const [gameData, setGameData] = useState({
        matchMoves: 1,
        matchOver: false,
        matchWinner: null
    });

    /* useEffect(() => {
        socket.on('gameMoves', ({ matchMoves, move }) => {
            updateGameMoves({ matchMoves, move });
        });

        socket.on('gameOver', (winner) => {
            setGameData({
                players: [
                    {
                        symbol: '',
                        playerMoves: []
                    }
                ],
                game: {
                    matchOver: true,
                    matchWinner: winner
                }
            });
        });

        return () => {
            socket.off();
        };
    }, [gameData]); */

    useEffect(() => {
        socket.on('symbolsUpdate', (player) => {
            setPlayersData([...playersData, player]);
        });
    });

    // SOCKET FUNCTIONS

    /* function sendPlayerMove(move) {
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
    } */

    function setPlayerSymbol(symbol) {
        // Send to the server the player's symbol
        socket.emit('setPlayerSymbol', symbol, (error) => {
            if (error) {
                alert(error);
            }
            console.log('The selected symbol was sent');
        });
    }

    // RENDER FUNCTIONS
    function renderChooseButtons() {
        return (
            <>
                <button type="choose__btn" onClick={() => setPlayerSymbol('x')}>
                    X
                </button>
                <div>OR</div>
                <button type="choose__btn" onClick={() => setPlayerSymbol('o')}>
                    O
                </button>
            </>
        );
    }
    function renderButtons() {
        return (
            <div className="game__btns">
                {gameboard.map((content, index = 0) => {
                    return (
                        <div
                            id={index}
                            key={index}
                            className="grid-item"
                            onClick={() => {
                                console.log('Player move sent');
                            }}
                        >
                            <p>{content}</p>
                        </div>
                    );
                })}
            </div>
        );
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
