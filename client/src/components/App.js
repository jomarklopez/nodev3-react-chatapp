import React from 'react';
import { Router, Route } from 'react-router-dom';

import '../styles/app.css';
import history from '../history';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';

const App = (props) => {
    return (
        <>
            <Router history={history}>
                <Route path="/" exact component={HomePage} />
                <Route path="/login" exact component={LoginPage} />
            </Router>
        </>
    );
};

export default App;
