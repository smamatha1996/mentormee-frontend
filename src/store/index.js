import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import postReducer from './postSlice';
import commentReducer from './commentSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        post: postReducer,
        comment: commentReducer,  
    },
});

export default store;