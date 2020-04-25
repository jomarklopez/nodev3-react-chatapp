import React, { useState, useEffect } from 'react';

import socket from './socket';
import GameSidebar from './GamesComponents/GameSidebar';
import GameChoices from './GamesComponents/GameChoices';
import TicTacToe from './GamesComponents/TicTacToe';

const GameContainer = (props) => {
    // Initial state
    const [gameSelected, setGameSelected] = useState();
    // Get user details from userContext

    useEffect(() => {
        // Use consumer to pass the user's details
        if (gameSelected) {
            socket.emit('joinGameRoom', { gameroom: gameSelected }, (error) => {
                if (error) {
                    alert(error);
                    window.location.href = '/chatroom';
                }
            });
        }
    });

    // Handles game select button action
    function onGameSelected(selection) {
        // Set state to the game selected
        setGameSelected(selection);

        // TODO: If chat is expanded, then minimize
    }

    function onGameLeave() {
        // Set state to the game selected
        setGameSelected(undefined);

        // TODO: If chat is expanded, then minimize
    }

    function renderGame() {
        // Render a game based on the gameSelected state
        if (gameSelected === 'tictactoe') {
            return (
                <>
                    <GameSidebar leaveGame={onGameLeave} />
                    <TicTacToe />
                </>
            );
        } else {
            // Renders the game choices and passing a function to set the state of game selection
            return <GameChoices onGameSelect={onGameSelected} />;
        }
    }

    return (
        <div id="game__container" className="game__container">
            {renderGame()}
        </div>
    );
};

export default GameContainer;
