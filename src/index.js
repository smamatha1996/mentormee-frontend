import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import { Provider } from 'react-redux';
import store from './store'; 
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
);