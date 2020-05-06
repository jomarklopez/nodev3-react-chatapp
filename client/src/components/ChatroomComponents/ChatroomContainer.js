import React from 'react';

import GameContainer from '../GamesComponents/GameContainer';
import Sidebar from '../ChatroomComponents/Sidebar';
import Chatbox from '../ChatroomComponents/Chatbox';

const ChatroomContainer = (props) => {
    return (
        <>
            <Sidebar />
            <GameContainer />
            <Chatbox />
        </>
    );
};

export default ChatroomContainer;
