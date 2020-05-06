import React, { useState, useContext, useEffect } from 'react';

import UserContext from '../UserContext';
import socket from '../socket';
import GameChoices from './GameChoices';
import TicTacToe from './TicTacToe';

const GameContainer = (props) => {
    // Initial state
    const [gameSelected, setGameSelected] = useState();
    const user = useContext(UserContext);

    useEffect(() => {
        if (gameSelected) {
            const gameroom = user.room + '-' + gameSelected;
            socket.emit('joinGameRoom', { gameroom }, (error) => {
                if (error) {
                    console.log(error);
                    alert(error);
                    window.location.href = '/';
                }
            });
        }
    });

    // Handles game select button action
    const onGameSelected = (selection) => {
        // Set state to the game selected
        setGameSelected(selection);
        // TODO: If chat is expanded, then minimize
    };

    const leaveGameRoom = () => {
        // Set state to the game selected to undefined
        socket.emit('leaveGameRoom', (error) => {
            if (error) {
                alert(error);
            }
        });
        setGameSelected(undefined);
    };

    const renderGame = () => {
        // Render a game based on the gameSelected state
        if (gameSelected === 'tictactoe') {
            return (
                <>
                    <button className="leavegame__btn" onClick={leaveGameRoom}>
                        Leave Game
                    </button>
                    <TicTacToe />
                </>
            );
        } else {
            // Renders the game choices and passing a function to set the state of game selection
            return <GameChoices onGameSelect={onGameSelected} />;
        }
    };

    return (
        <div id="game__container" className="game__container">
            {renderGame()}
        </div>
    );
};

export default GameContainer;
