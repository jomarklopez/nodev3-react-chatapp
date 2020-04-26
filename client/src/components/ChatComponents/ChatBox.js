import React, { useState, useContext, useEffect, useRef } from 'react';
import Moment from 'react-moment';

import ChatInput from './ChatInput';
import socket from '../socket';
import UserContext from '../userContext';

const ChatBox = (props) => {
    // Create a state containing the message history
    const [messageHistory, setMessageHistory] = useState([]);
    // Create a state containing initial values for displaying the chatbox
    const [chatDisplay, setChatDisplay] = useState(false);

    // Get userContext for user details
    const user = useContext(UserContext);

    // Create a reference for the input and submit button elements
    let lastMessageDummy = useRef(null);

    // Upon mounting, check for message received from the server and join the specified room
    useEffect(() => {
        socket.on('message', (messageObject) => {
            updateMessageHistory(messageObject);
        });
        lastMessageDummy.scrollIntoView();
        return () => {
            socket.off();
        };
    });

    // SOCKET FUNCTIONS

    function updateMessageHistory(messageObject) {
        // Add message object containing the text, creation date, and username of sender
        setMessageHistory([...messageHistory, messageObject]);
    }

    // Use the socket emit
    function sendMessage(message, inputMessageRef, submitButtonRef) {
        socket.emit('newMessage', message, (error) => {
            submitButtonRef.current.removeAttribute('disabled');
            if (error) {
                alert(error);
            }
            console.log('The message was delivered');
            inputMessageRef.current.value = '';
            inputMessageRef.current.focus();
        });
    }

    // Show chat messages
    function renderChat({ username }) {
        return messageHistory.map((message, index = 0) => {
            return (
                <div
                    className={
                        username.toLowerCase() === message.username
                            ? 'message message__user'
                            : 'message'
                    }
                    key={index++}
                >
                    <p>
                        <span className="message__name">
                            {message.username}
                        </span>
                        <span className="message__meta">
                            {
                                <Moment
                                    date={message.createdAt}
                                    format="h:mm a"
                                />
                            }
                        </span>
                    </p>
                    <p className="message__content">{message.text}</p>
                </div>
            );
        });
    }

    // Toggle chat visibility
    const toggleShowHide = () => {
        setChatDisplay(!chatDisplay);
    };

    return (
        <>
            <div
                className={
                    chatDisplay ? 'chat__main chat__main-expand' : 'chat__main'
                }
            >
                <div
                    className={
                        chatDisplay
                            ? 'chatdisplay__button switch right'
                            : 'chatdisplay__button switch'
                    }
                    onClick={toggleShowHide}
                >
                    <div className="arrow"></div>
                </div>
                <div
                    className={
                        chatDisplay
                            ? 'chat__messages chat__messages-expand'
                            : 'chat__messages'
                    }
                >
                    {renderChat(user)}
                    <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={(el) => {
                            lastMessageDummy = el;
                        }}
                    ></div>
                </div>
                <ChatInput
                    send={sendMessage}
                    toggleShowHide={toggleShowHide}
                    chatDisplay={chatDisplay}
                />
            </div>
        </>
    );
};

export default ChatBox;
