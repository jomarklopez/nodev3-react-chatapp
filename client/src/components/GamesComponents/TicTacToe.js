import React, { useState, useEffect, useContext } from 'react';

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

    const [gameMoveset, setGameMoveset] = useState(null);

    const user = useContext(UserContext);

    const [playersData, setPlayersData] = useState([]);
    const [matchState, setMatchState] = useState({
        matchOver: false,
        matchWinner: null
    });

    useEffect(() => {
        console.log(playersData);
        socket.on('playersUpdate', (playersData) => {
            setPlayersData(playersData);
        });
        return () => {
            socket.off('playersUpdate');
        };
    });

    useEffect(() => {
        if (gameMoveset == null && playersData[0]) {
            // Initialize gamemoveset from server on first render after receiving playersData
            socket.emit('initGameMoveset', playersData[0].gameroom, (error) => {
                if (error) {
                    alert(error);
                }
                console.log('The gamemoveset was requested');
            });
        }
        socket.on('gameMovesetUpdate', (moveset) => {
            console.log(moveset);
            setGameMoveset(moveset);
        });
        return () => {
            socket.off('gameMovesetUpdate');
        };
    });

    useEffect(() => {
        socket.on('gameOver', (player) => {
            alert(player + ' WON!');
        });
        return () => {
            socket.off('gameOver');
        };
    });

    // SOCKET FUNCTIONS

    const sendPlayerMove = (move) => {
        console.log(gameMoveset[move]);
        if (gameMoveset[move] !== ' ') {
            return alert("Can't place there!");
        } else {
            socket.emit('newMove', move, (error) => {
                if (error) {
                    alert(error);
                }
                console.log('The move was delivered');
            });
        }
    };

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
    // TODO SHOW WHOSE TURN IT IS
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
                    {xPlayer[0] ? <p>{xPlayer[0].username}</p> : <p>&nbsp;</p>}
                </div>
                <div className="oButtonContainer">
                    <button
                        type="choose__btn"
                        onClick={() => setPlayerSymbol('o')}
                        disabled={oPlayer[0] ? true : false}
                    >
                        O
                    </button>
                    {oPlayer[0] ? <p>{oPlayer[0].username}</p> : <p>&nbsp;</p>}
                </div>
            </>
        );
    };
    const renderButtons = () => {
        if (gameMoveset) {
            return (
                <div className="game__btns">
                    {gameMoveset.map((content, index = 0) => {
                        return (
                            <div
                                id={index}
                                key={index}
                                className="grid-item"
                                onClick={() => {
                                    sendPlayerMove(index);
                                }}
                            >
                                <p>{content}</p>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <div>Loading...</div>;
        }
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
