import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter, Switch, Link} from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import SignUp from "./SignUp/SignUp";

const routing = (
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path={'/'} component={App} />
                <Route path={'/sign_up'} component={SignUp} />
            </Switch>
        </div>
    </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
