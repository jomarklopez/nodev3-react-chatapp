import React, { useState, useContext } from 'react';
import Moment from 'react-moment';

import socket from '../socket';
import ChatInput from './ChatInput';
import UserContext from '../UserContext';

const Chatbox = (props) => {
    // Create a state containing initial values for displaying the chatbox
    const [chatDisplay, setChatDisplay] = useState(false);
    const user = useContext(UserContext);

    // Toggle chat visibility
    const toggleShowHide = () => {
        setChatDisplay(!chatDisplay);
    };

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
    function renderChat(user) {
        return props.messageHistory.map((message, index = 0) => {
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
    }

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
                    ref={props.setLastMessageRef}
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
