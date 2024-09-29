import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupUser as signupService, loginUser as loginService } from '../services/authService';

// Async thunk for signup
export const signupUser = createAsyncThunk('auth/signup', async (userData) => {
    return await signupService(userData);
});

// Async thunk for login
export const loginUser = createAsyncThunk('auth/login', async (userData) => {
    return await loginService(userData);
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('mentorMeeToken') || null, // Initialize from localStorage
        isAuthenticated: !!localStorage.getItem('mentorMeeToken'), // Auth status
        signupStatus: 'idle',
        loginStatus: 'idle',
        error: null,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        clearToken: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('mentorMeeToken'); // Remove token from localStorage
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('mentorMeeToken'); // Remove token from localStorage
        },
    },
    extraReducers: (builder) => {
        builder
            // Signup Handlers
            .addCase(signupUser.pending, (state) => {
                state.signupStatus = 'loading';
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.signupStatus = 'succeeded';
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.signupStatus = 'failed';
                state.error = action.error.message;
            })

            // Login Handlers
            .addCase(loginUser.pending, (state) => {
                state.loginStatus = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { token } = action.payload;
                state.loginStatus = 'succeeded';
                state.token = token;
                state.isAuthenticated = true;
                localStorage.setItem('mentorMeeToken', token); // Save token to localStorage
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setToken, clearToken, logout } = authSlice.actions;
export default authSlice.reducer;