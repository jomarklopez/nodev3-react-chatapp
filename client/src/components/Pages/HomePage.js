import React, { useEffect } from 'react';

import socket from '../socket';
import ChatroomContainer from '../ChatroomComponents/ChatroomContainer';
import UserContext from '../UserContext';

const HomePage = (props) => {
    // Upon mounting, join the specified room
    useEffect(() => {
        if (props.location.state) {
            const { username, room } = props.location.state;
            socket.emit('joinRoom', { username, room }, (error) => {
                if (error) {
                    alert(error);
                    window.location.href = '/login';
                }
            });
        } else {
            // If user has not logged in then redirect to login page
            window.location.href = '/login';
        }
    });

    return (
        <UserContext.Provider value={props.location.state}>
            <div className="main">
                <ChatroomContainer />
            </div>
        </UserContext.Provider>
    );
};

export default HomePage;
