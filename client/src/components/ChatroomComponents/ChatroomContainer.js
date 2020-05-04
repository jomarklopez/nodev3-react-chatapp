import React, { useState, useContext, useEffect, useRef } from 'react';

import socket from '../socket';
import GameContainer from '../GamesComponents/GameContainer';
import Sidebar from '../ChatroomComponents/Sidebar';
import Chatbox from '../ChatroomComponents/Chatbox';

const ChatroomContainer = (props) => {
    // Create a state containing the message history
    const [messageHistory, setMessageHistory] = useState([]);
    const [roomDetails, setRoomDetails] = useState({
        roomname: '',
        users: []
    });

    // Create a reference for the input and submit button elements
    let lastMessageDummy = useRef(null);

    useEffect(() => {
        // Check for message or room details received from server then set state to rerender.
        socket.on('message', (messageObject) => {
            updateMessageHistory(messageObject);
        });
        lastMessageDummy.scrollIntoView();

        return () => {
            socket.off();
        };
    });

    useEffect(() => {
        socket.on('roomDetails', (details) => {
            updateRoomDetails(details);
        });
    });

    function setLastMessageRef(ref) {
        lastMessageDummy = ref;
    }

    function updateMessageHistory(messageObject) {
        // Add message object containing the text, creation date, and username of sender
        setMessageHistory([...messageHistory, messageObject]);
    }

    function updateRoomDetails({ roomname, users }) {
        setRoomDetails({
            ...roomDetails,
            roomname: roomname,
            users: [...users]
        });
    }

    return (
        <>
            <Sidebar roomDetails={roomDetails} />
            <GameContainer />
            <Chatbox
                messageHistory={messageHistory}
                setLastMessageRef={setLastMessageRef}
            />
        </>
    );
};

export default ChatroomContainer;
