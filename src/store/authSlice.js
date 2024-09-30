import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupUser as signupService, loginUser as loginService } from '../services/authService';

export const signupUser = createAsyncThunk('auth/signup', async (userData) => {
    return await signupService(userData);
});
export const loginUser = createAsyncThunk('auth/login', async (userData) => {
    return await loginService(userData);
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('mentorMeeToken') || null,
        isAuthenticated: !!localStorage.getItem('mentorMeeToken'), 
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
            localStorage.removeItem('mentorMeeToken'); 
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('mentorMeeToken'); 
        },
    },
    extraReducers: (builder) => {
        builder
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

            .addCase(loginUser.pending, (state) => {
                state.loginStatus = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { token } = action.payload;
                state.loginStatus = 'succeeded';
                state.token = token;
                state.isAuthenticated = true;
                localStorage.setItem('mentorMeeToken', token); 
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setToken, clearToken, logout } = authSlice.actions;
export default authSlice.reducer;