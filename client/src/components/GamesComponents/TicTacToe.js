import React, { useState, useEffect, useContext, useRef } from 'react';

import socket from '../socket';
import UserContext from '../UserContext';

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

    const user = useContext(UserContext);

    const [playersData, setPlayersData] = useState([]);
    const [gameData, setGameData] = useState({
        xPlayer: null,
        oPlayer: null,
        matchMoves: 1,
        matchOver: false,
        matchWinner: null
    });

    let selectXBtn = useRef(null);
    let selectOBtn = useRef(null);

    useEffect(() => {
        socket.on('playersUpdate', (playersData) => {
            setPlayersData(playersData);
            // Put labels around the X and O button
        });
        return () => {
            socket.off('playersUpdate');
        };
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

    const setPlayerSymbol = (symbol) => {
        // Check first if player has already selected a symbol
        const player = playersData.filter(
            (player) => player.username === user.username
        );

        if (player[0] && player[0].symbol) {
            console.log('Player has already selected a symbol');
        } else {
            // Send to the server the player's symbol
            socket.emit('setPlayerSymbol', symbol, (error) => {
                if (error) {
                    alert(error);
                }
                console.log('The selected symbol was sent');
            });
        }
    };

    // RENDER FUNCTIONS

    const renderChooseButtons = () => {
        const xPlayer = playersData.filter((player) => player.symbol === 'x');
        const oPlayer = playersData.filter((player) => player.symbol === 'o');

        return (
            <>
                <div className="xButtonContainer">
                    <button
                        type="choose__btn"
                        onClick={() => setPlayerSymbol('x')}
                        disabled={xPlayer[0] ? true : false}
                    >
                        X
                    </button>
                    {xPlayer[0] ? <p>{xPlayer[0].username}</p> : <p></p>}
                </div>
                <div className="oButtonContainer">
                    <button
                        type="choose__btn"
                        onClick={() => setPlayerSymbol('o')}
                        disabled={oPlayer[0] ? true : false}
                    >
                        O
                    </button>
                    {oPlayer[0] ? <p>{oPlayer[0].username}</p> : <p></p>}
                </div>
            </>
        );
    };
    const renderButtons = () => {
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
    };

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
