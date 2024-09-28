import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupUser as signupService, loginUser as loginService, updateProfile as updateProfileService, fetchUser as fetchUserService } from '../services/userService';

// Async thunk for signup
export const signupUser = createAsyncThunk('user/signup', async (userData) => {
    return await signupService(userData);
});

// Async thunk for login
export const loginUser = createAsyncThunk('user/login', async (userData) => {
    return await loginService(userData);
});

// Async thunk for fetching user data
export const fetchUser = createAsyncThunk('user/fetchUser', async (emailOrUsername) => {
    return await fetchUserService(emailOrUsername);
});

// Async thunk for updating profile
export const updateProfile = createAsyncThunk('user/updateProfile', async ({ email, profileData }) => {
    return await updateProfileService(email, profileData);
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        token: localStorage.getItem('mentorMeeToken') || null, // Initialize from localStorage
        isAuthenticated: !!localStorage.getItem('mentorMeeToken'), // Auth status
        signupStatus: 'idle',
        loginStatus: 'idle',
        updateStatus: 'idle',
        fetchStatus: 'idle', // Status for fetching user data
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
            state.userInfo = null;
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
            .addCase(signupUser.fulfilled, (state, action) => {
                state.signupStatus = 'succeeded';
                state.userInfo = action.payload;
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
                const { token, user } = action.payload;
                state.loginStatus = 'succeeded';
                state.userInfo = user;
                state.token = token;
                state.isAuthenticated = true;
                localStorage.setItem('mentorMeeToken', token); // Save token to localStorage
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginStatus = 'failed';
                state.error = action.error.message;
            })

            // Fetch User Handlers
            .addCase(fetchUser.pending, (state) => {
                state.fetchStatus = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.fetchStatus = 'succeeded';
                console.log(action.payload, 'fetchUser.fulfilled action.payload');
                state.userInfo = action.payload; // Update user info
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                console.log(action.payload, 'fetchUser.rejected action.payload');
                state.error = action.error.message;
            })

            // Update Profile Handlers
            .addCase(updateProfile.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                state.userInfo = { ...state.userInfo, ...action.payload }; // Update user info with new data
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setToken, clearToken, logout } = userSlice.actions;
export default userSlice.reducer;