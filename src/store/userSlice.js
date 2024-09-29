import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    updateProfile as updateProfileService,
    fetchUser as fetchUserService,
    searchUsers as searchUsersService,
    sendFriendRequest as sendFriendRequestService,
    sendFollowRequest as sendFollowRequestService,
    fetchFriends as fetchFriendsService,
    fetchSuggestedFriends as fetchSuggestedFriendsService,
    fetchFriendRequests as fetchFriendRequestsService,
    acceptFriendRequest as acceptFriendRequestService,
    rejectFriendRequest as rejectFriendRequestService
} from '../services/userService';

// Async thunk for fetching user data
export const fetchUser = createAsyncThunk('user/fetchUser', async (emailOrUsername) => {
    return await fetchUserService(emailOrUsername);
});

// Async thunk for updating profile
export const updateProfile = createAsyncThunk('user/updateProfile', async ({ email, profileData }) => {
    return await updateProfileService(email, profileData);
});

// Async thunk for searching users
export const searchUsers = createAsyncThunk('user/searchUsers', async (query) => {
    return await searchUsersService(query);
});

// Async thunk for sending friend request
export const sendFriendRequest = createAsyncThunk('user/sendFriendRequest', async ({ fromUserEmail, toUserEmail }) => {
    return await sendFriendRequestService(fromUserEmail, toUserEmail);
});

// Async thunk for sending follow request
export const sendFollowRequest = createAsyncThunk('user/sendFollowRequest', async ({ fromUserEmail, toUserEmail }) => {
    return await sendFollowRequestService(fromUserEmail, toUserEmail);
});

// Async thunk for fetching friends
export const fetchFriends = createAsyncThunk('user/fetchFriends', async (userEmail) => {
    return await fetchFriendsService(userEmail); // Fetch friends for the user with this email
});

// Async thunk for fetching suggested friends
export const fetchSuggestedFriends = createAsyncThunk('user/fetchSuggestedFriends', async (userEmail) => {
    return await fetchSuggestedFriendsService(userEmail); // Fetch suggested friends based on the user's email
});

// Async thunk for fetching friend requests
export const fetchFriendRequests = createAsyncThunk('user/fetchFriendRequests', async (userEmail) => {
    return await fetchFriendRequestsService(userEmail); // Fetch friend requests for the user
});

// Async thunk for accepting friend request
export const acceptFriendRequest = createAsyncThunk('user/acceptFriendRequest', async (requestId) => {
    return await acceptFriendRequestService(requestId); // Accept the friend request with this ID
});

// Async thunk for rejecting friend request
export const rejectFriendRequest = createAsyncThunk('user/rejectFriendRequest', async (requestId) => {
    return await rejectFriendRequestService(requestId); // Reject the friend request with this ID
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        searchResults: [], // Store search results here
        friends: [], // Store the user's friends
        suggestedFriends: [], // Store suggested friends
        fetchStatus: 'idle', // Status for fetching user data
        updateStatus: 'idle', // Status for updating profile
        searchStatus: 'idle', // Status for searching users
        friendRequestStatus: 'idle', // Status for sending friend requests
        followRequestStatus: 'idle', // Status for sending follow requests
        fetchFriendsStatus: 'idle', // Status for fetching friends
        fetchSuggestedFriendsStatus: 'idle', // Status for fetching suggested friends
        error: null,
        fetchFriendRequestsStatus: 'idle', // Status for fetching friend requests
        acceptFriendRequestStatus: 'idle', // Status for accepting friend requests
        rejectFriendRequestStatus: 'idle', // Status for rejecting friend requests
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch User Handlers
            .addCase(fetchUser.pending, (state) => {
                state.fetchStatus = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.fetchStatus = 'succeeded';
                state.userInfo = action.payload; // Update user info
                state.error = null;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.error = action.error.message;
            })

            // Update Profile Handlers
            .addCase(updateProfile.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                state.userInfo = { ...state.userInfo, ...action.payload }; // Update user info with new data
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.error = action.error.message;
            })

            // Search Users Handlers
            .addCase(searchUsers.pending, (state) => {
                state.searchStatus = 'loading';
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.searchStatus = 'succeeded';
                state.searchResults = action.payload; // Store search results
                state.error = null;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.searchStatus = 'failed';
                state.error = action.error.message;
            })

            // Send Friend Request Handlers
            .addCase(sendFriendRequest.pending, (state) => {
                state.friendRequestStatus = 'loading';
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.friendRequestStatus = 'succeeded';
                state.error = null;
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.friendRequestStatus = 'failed';
                state.error = action.error.message;
            })

            // Send Follow Request Handlers
            .addCase(sendFollowRequest.pending, (state) => {
                state.followRequestStatus = 'loading';
            })
            .addCase(sendFollowRequest.fulfilled, (state) => {
                state.followRequestStatus = 'succeeded';
                state.error = null;
            })
            .addCase(sendFollowRequest.rejected, (state, action) => {
                state.followRequestStatus = 'failed';
                state.error = action.error.message;
            })

            // Fetch Friends Handlers
            .addCase(fetchFriends.pending, (state) => {
                state.fetchFriendsStatus = 'loading';
            })
            .addCase(fetchFriends.fulfilled, (state, action) => {
                state.fetchFriendsStatus = 'succeeded';
                state.friends = action.payload; // Store friends
                state.error = null;
            })
            .addCase(fetchFriends.rejected, (state, action) => {
                state.fetchFriendsStatus = 'failed';
                state.error = action.error.message;
            })

            // Fetch Suggested Friends Handlers
            .addCase(fetchSuggestedFriends.pending, (state) => {
                state.fetchSuggestedFriendsStatus = 'loading';
            })
            .addCase(fetchSuggestedFriends.fulfilled, (state, action) => {
                state.fetchSuggestedFriendsStatus = 'succeeded';
                state.suggestedFriends = action.payload; // Store suggested friends
                state.error = null;
            })
            .addCase(fetchSuggestedFriends.rejected, (state, action) => {
                state.fetchSuggestedFriendsStatus = 'failed';
                state.error = action.error.message;
            })
            // Fetch Friend Requests Handlers
            .addCase(fetchFriendRequests.pending, (state) => {
                state.fetchFriendRequestsStatus = 'loading';
            })
            .addCase(fetchFriendRequests.fulfilled, (state, action) => {
                state.fetchFriendRequestsStatus = 'succeeded';
                state.friendRequests = action.payload; // Store friend requests
                state.error = null;
            })
            .addCase(fetchFriendRequests.rejected, (state, action) => {
                state.fetchFriendRequestsStatus = 'failed';
                state.error = action.error.message;
            })
            .addCase(acceptFriendRequest.pending, (state) => {
                state.acceptFriendRequestStatus = 'loading';
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.acceptFriendRequestStatus = 'succeeded';
                state.friendRequests = state.friendRequests.filter(req => req.id !== action.payload); // Remove accepted request
                state.error = null;
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.acceptFriendRequestStatus = 'failed';
                state.error = action.error.message;
            })

            // Reject Friend Request Handlers
            .addCase(rejectFriendRequest.pending, (state) => {
                state.rejectFriendRequestStatus = 'loading';
            })
            .addCase(rejectFriendRequest.fulfilled, (state, action) => {
                state.rejectFriendRequestStatus = 'succeeded';
                state.friendRequests = state.friendRequests.filter(req => req.id !== action.payload); // Remove rejected request
                state.error = null;
            })
            .addCase(rejectFriendRequest.rejected, (state, action) => {
                state.rejectFriendRequestStatus = 'failed';
                state.error = action.error.message;
            })
    },
});

export default userSlice.reducer;