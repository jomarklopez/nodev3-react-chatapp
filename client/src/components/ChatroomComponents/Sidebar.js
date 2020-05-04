import React from 'react';

const GameSidebar = (props) => {
    function renderContent() {
        if (props.roomDetails.users.length === 0) {
            return <div>Loading...</div>;
        } else {
            return (
                <>
                    <h2 className="room-title">{props.roomDetails.roomname}</h2>
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
                        {props.roomDetails.users.map((user, index = 0) => {
                            return <li key={index++}>{user.username}</li>;
                        })}
                    </ul>
                </>
            );
        }
    }

    return <div className="sidebar">{renderContent()}</div>;
};

export default GameSidebar;
