import React from 'react';

const TicTacToe = () => {
    /**
     * TIC TAC TOE
     *  - Has 6 buttons
     *  - Checks for winner every click
     *  - Has Diagonal,Horizontal, Vertical win patterns
     *    DIAGONAL WIN
     *       1-5-9
     *       3-5-7
     *    HORIZONAL WIN
     *       1-2-3
     *       4-5-6
     *       7-8-9
     *    VERTICAL WIN
     *       1-4-7
     *       2-5-8
     *       3-6-9
     *  - Shares information on the current filled buttons or numbers in an array indicating the buttons clicked
     *  - Server then checks for a winner with the data sent by client
     *  - If there is a winner then send to clients via chat message the name of the winner and also send to the game state that the game is finished and there is a declared winner.
     */

    return (
        <div className="TicTacToe__container">
            <div
                id="b1"
                className="grid-item"
                onClick={() => console.log('1')}
            ></div>
            <div
                id="b2"
                className="grid-item"
                onClick={() => console.log('2')}
            ></div>
            <div
                id="b3"
                className="grid-item"
                onClick={() => console.log('3')}
            ></div>
            <div
                id="b4"
                className="grid-item"
                onClick={() => console.log('4')}
            ></div>
            <div
                id="b5"
                className="grid-item"
                onClick={() => console.log('5')}
            ></div>
            <div
                id="b6"
                className="grid-item"
                onClick={() => console.log('6')}
            ></div>
            <div
                id="b7"
                className="grid-item"
                onClick={() => console.log('7')}
            ></div>
            <div
                id="b8"
                className="grid-item"
                onClick={() => console.log('8')}
            ></div>
            <div
                id="b9"
                className="grid-item"
                onClick={() => console.log('9')}
            ></div>
        </div>
    );
};

export default TicTacToe;
