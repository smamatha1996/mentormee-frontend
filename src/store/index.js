import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postReducer from './postSlice';
import commentReducer from './commentSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        post: postReducer,
        comment: commentReducer,  // Add comment reducer
    },
});

export default store;