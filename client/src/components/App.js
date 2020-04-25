import React from 'react';
import { Router, Route } from 'react-router-dom';

import '../styles/app.css';
import history from '../history';
import LoginPage from './LoginPage';
import ChatRoomPage from './ChatRoomPage';

const App = (props) => {
    return (
        <>
            <Router history={history}>
                <Route path="/" exact component={LoginPage} />
                <Route path="/chatroom" exact component={ChatRoomPage} />
            </Router>
        </>
    );
};

export default App;
