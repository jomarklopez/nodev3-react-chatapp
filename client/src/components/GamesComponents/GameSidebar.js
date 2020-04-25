import React, { useEffect } from 'react';

const GameContainerSideBar = (props) => {
    useEffect(() => {});

    function renderUsers(users) {
        return <div>wow</div>;
        //props.socket.on('gameRoomDetails', ({ room, users }) => {});
    }

    return (
        <div className="game__container-sidebar">
            <h2 className="room-title">Tic Tac Toe Room</h2>
            <h2 className="list-title">Users</h2>
            <ul className="users">{renderUsers()}</ul>
        </div>
    );
};

export default GameContainerSideBar;
