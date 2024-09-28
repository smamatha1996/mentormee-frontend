import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App.js is now outside `src`
import { Provider } from 'react-redux';
import store from './store'; // store is still in `src`
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import './index.css'; // index.css moved outside `src`

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
);