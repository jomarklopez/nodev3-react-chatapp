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

    const [playerMoves, setPlayerMoves] = useState([
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
    const [chosenSymbol, setChosenSymbol] = useState('');

    useEffect(() => {
        socket.on('gameMoves', (moves) => {
            updateGameMoves(moves);
        });
    });
    // STATE FUNCTIONS

    function updateGameMoves({ index, chosenSymbol }) {
        // Add message object containing the text, creation date, and username of sender
        // Moves determine in which index should the symbol be placed
        let newPlayerMoves = [...playerMoves];
        newPlayerMoves[index] = chosenSymbol;
        setPlayerMoves(newPlayerMoves);
    }

    function onSymbolSelect(symbol) {
        setChosenSymbol(symbol);
    }

    // SOCKET FUNCTIONS

    function sendPlayerMove(move) {
        if (playerMoves[move.index] === ' ') {
            socket.emit('newMove', move, (error) => {
                if (error) {
                    return console.log(error);
                }
                console.log('The move was delivered');
            });
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
        if (chosenSymbol) {
            return (
                <div className="game__btns">
                    {playerMoves.map((content, index = 0) => {
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
