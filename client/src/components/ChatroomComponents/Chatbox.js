import React, { useState, useEffect, useContext, useRef } from 'react';
import Moment from 'react-moment';

import socket from '../socket';
import ChatInput from './ChatInput';
import UserContext from '../userContext';

const Chatbox = (props) => {
    // Create a state containing initial values for displaying the chatbox
    const [messageHistory, setMessageHistory] = useState([]);
    const [chatDisplay, setChatDisplay] = useState(false);
    const user = useContext(UserContext);
    let lastMessageDummy = useRef(null);

    useEffect(() => {
        // Check for message or room details received from server then set state to rerender.
        socket.on('message', (messageObject) => {
            updateMessageHistory(messageObject);
        });
        lastMessageDummy.scrollIntoView();

        return () => {
            socket.off('message');
        };
    });

    const updateMessageHistory = (messageObject) => {
        // Add message object containing the text, creation date, and username of sender
        setMessageHistory([...messageHistory, messageObject]);
    };

    // Toggle chat visibility
    const toggleShowHide = () => {
        setChatDisplay(!chatDisplay);
    };

    // Use the socket emit
    const sendMessage = (message, inputMessageRef, submitButtonRef) => {
        socket.emit('newMessage', message, (error) => {
            submitButtonRef.current.removeAttribute('disabled');
            if (error) {
                alert(error);
            }
            console.log('The message was delivered');
            inputMessageRef.current.value = '';
            inputMessageRef.current.focus();
        });
    };

    // Show chat messages
    const renderChat = (user) => {
        return messageHistory.map((message, index = 0) => {
            if (
                message.username === 'Admin' ||
                message.username === 'Game Master'
            ) {
                return (
                    <div className="message message__admin" key={index++}>
                        <p className="message__content">{message.text}</p>
                    </div>
                );
            } else {
                return (
                    <div
                        className={
                            message.username === user.username
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
            }
        });
    };

    return (
        <div
            className={
                chatDisplay ? 'chat__main chat__main-expand' : 'chat__main'
            }
        >
            <button
                className={
                    chatDisplay
                        ? 'chatdisplay__button switch right'
                        : 'chatdisplay__button switch'
                }
                onClick={toggleShowHide}
            >
                <div className="arrow"></div>
            </button>
            <div
                className={
                    chatDisplay
                        ? 'chat__messages chat__messages-expand'
                        : 'chat__messages'
                }
            >
                {renderChat(user)}
                <div
                    className="last__message-dummy"
                    style={{ float: 'left', clear: 'both' }}
                    ref={(e) => (lastMessageDummy = e)}
                ></div>
            </div>
            <ChatInput
                send={sendMessage}
                toggleShowHide={toggleShowHide}
                chatDisplay={chatDisplay}
            />
        </div>
    );
};

export default Chatbox;
