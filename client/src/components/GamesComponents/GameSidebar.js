import React, { useState, useEffect } from 'react';
import socket from '../socket';

const GameContainerSideBar = (props) => {
    const [roomDetails, setRoomDetails] = useState({
        gameTitle: '',
        players: []
    });

    // Upon mounting, check for message received from the server and join the specified room
    useEffect(() => {
        socket.on('gameRoomDetails', (details) => {
            updateRoomDetails(details);
        });
    });

    // SOCKET FUNCTIONS

    function updateRoomDetails(details) {
        // Update the roomname and the number of users
        setRoomDetails({ gameTitle: details.gameroom, players: details.users });
    }

    function leaveGameRoom() {
        // Set state to the game selected to undefined
        socket.emit('leaveGameRoom', (error) => {
            if (error) {
                alert(error);
            }
        });
        props.leaveGame();
    }

    function renderUsers() {
        return roomDetails.players.map((player, index = 0) => {
            return <li key={index++}>{player.username}</li>;
        });
    }

    return (
        <div className="game__container-sidebar">
            <h2 className="room-title">{roomDetails.gameTitle}</h2>
            <button className="leavegame__btn" onClick={leaveGameRoom}>
                Leave Game
            </button>
            <h2 className="list-title">Players</h2>
            <ul className="users">{renderUsers()}</ul>
        </div>
    );
};

export default GameContainerSideBar;
