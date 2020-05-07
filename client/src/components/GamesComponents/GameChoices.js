import React from 'react';

const GameChoices = (props) => {
    return (
        <div className="game-choices-container">
            <div
                id="b1"
                className="game-choice"
                onClick={() => props.onGameSelect('tictactoe')}
            >
                Tic Tac Toe
            </div>
        </div>
    );
};

export default GameChoices;
