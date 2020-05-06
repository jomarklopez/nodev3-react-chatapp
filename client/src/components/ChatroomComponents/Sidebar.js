import React, { useState, useEffect } from 'react';

import socket from '../socket';

const Sidebar = (props) => {
    // Create a state containing the message history

    const [roomDetails, setRoomDetails] = useState({
        roomname: '',
        users: []
    });

    // Create a reference for the input and submit button elements

    useEffect(() => {
        socket.on('roomDetails', (details) => {
            updateRoomDetails(details);
        });

        return () => {
            socket.off('roomDetails');
        };
    });

    function updateRoomDetails({ roomname, users }) {
        setRoomDetails({
            ...roomDetails,
            roomname: roomname,
            users: [...users]
        });
    }

    function renderContent() {
        if (roomDetails.users.length === 0) {
            return <div>Loading...</div>;
        } else {
            return (
                <>
                    <h2 className="room-title">{roomDetails.roomname}</h2>
                    <button
                        className="leavechatroom__btn"
                        onClick={() => {
                            window.location.href = '/login';
                        }}
                    >
                        Leave Chatroom
                    </button>
                    <h2 className="list-title">Users</h2>
                    <ul className="users">
                        {roomDetails.users.map((user, index = 0) => {
                            return <li key={index++}>{user.username}</li>;
                        })}
                    </ul>
                </>
            );
        }
    }

    return <div className="sidebar">{renderContent()}</div>;
};

export default Sidebar;
