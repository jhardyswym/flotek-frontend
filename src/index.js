import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { Router, Route, Switch, Redirect } from 'react-router';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
  <Router history = {history}>
    <Switch>
      <Route path = "/Control"><App /></Route>
    </Switch>
    <Redirect exact from="/" to="Control"/>
  </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

