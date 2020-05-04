import React, { useState, useRef } from 'react';
const ChatInput = (props) => {
    // Create a state for the input element's values
    const [inputValue, setInputValue] = useState('');

    const inputMessage = useRef(null);
    const submitButton = useRef(null);
    // FORM
    function onInputChange(e) {
        setInputValue(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        submitButton.current.setAttribute('disabled', 'disabled');
        props.send(inputValue, inputMessage, submitButton);
        setInputValue('');
    }

    return (
        <div className="compose">
            <form
                className={
                    props.chatDisplay
                        ? 'message__input message__input-expand'
                        : 'message__input'
                }
                onSubmit={handleSubmit}
            >
                <input
                    ref={inputMessage}
                    value={inputValue}
                    onChange={onInputChange}
                    onClick={!props.chatDisplay ? props.toggleShowHide : null}
                    className="input"
                    name="message"
                    autoComplete="off"
                />
                <button
                    className={
                        props.chatDisplay
                            ? 'send__button send__button-expand'
                            : 'send__button'
                    }
                    ref={submitButton}
                    id="submit"
                    type="submit"
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
