import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = (props) => {
    const [inputValue, setInputValue] = useState({
        username: '',
        room: ''
    });

    // FORM
    function handleChange(e) {
        const value = e.target.value;
        setInputValue({
            ...inputValue,
            [e.target.name]: value
        });
    }

    return (
        <div className="centered-form">
            <div className="centered-form__box">
                <h1>Join</h1>
                <form>
                    <label>Display Name</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Display name"
                        onChange={handleChange}
                        required
                    ></input>
                    <label>Room</label>
                    <input
                        type="text"
                        name="room"
                        placeholder="Room"
                        onChange={handleChange}
                        required
                    ></input>
                    <Link
                        className="join__button"
                        to={{
                            pathname: '/chatroom',
                            state: {
                                username: inputValue.username,
                                room: inputValue.room
                            }
                        }}
                    >
                        JOIN
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
