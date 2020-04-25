import React, { useEffect } from 'react';

import socket from './socket';
import GameContainer from './GameContainer';
import ChatBox from './ChatComponents/ChatBox';

import userContext from './userContext';

const ChatRoomPage = (props) => {
    // Create a state for the input element's values
    // Create a state containing the message history
    // Upon mounting, join the specified room

    useEffect(() => {
        const { username, room } = props.location.state;
        socket.emit('joinRoom', { username, room }, (error) => {
            if (error) {
                alert(error);
                window.location.href = '/';
            }
        });
    });

    return (
        <userContext.Provider value={props.location.state}>
            <div className="main">
                <ChatBox socket={socket} />
                <GameContainer socket={socket} />
            </div>
        </userContext.Provider>
    );
};

export default ChatRoomPage;
