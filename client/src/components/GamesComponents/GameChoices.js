import React from 'react';

const GameChoices = (props) => {
    return (
        <div className="game-choices-container">
            <div
                id="b1"
                className="game-choice"
                onClick={() => props.onGameSelect('TicTacToe')}
            >
                Tic Tac Toe
            </div>
            <div
                id="b2"
                className="game-choice"
                onClick={() => props.onGameSelect('ChortleMyBalls')}
            >
                Chortle My Balls
            </div>
            <div
                id="b3"
                className="game-choice"
                onClick={() => props.onGameSelect('MemoryGame')}
            >
                MemoryGame
            </div>
        </div>
    );
};

export default GameChoices;
