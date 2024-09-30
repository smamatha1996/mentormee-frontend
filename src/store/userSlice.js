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

export const fetchUser = createAsyncThunk('user/fetchUser', async (emailOrUsername) => {
    return await fetchUserService(emailOrUsername);
});

export const updateProfile = createAsyncThunk('user/updateProfile', async ({ email, profileData }) => {
    return await updateProfileService(email, profileData);
});
export const searchUsers = createAsyncThunk('user/searchUsers', async (query) => {
    return await searchUsersService(query);
});

export const sendFriendRequest = createAsyncThunk('user/sendFriendRequest', async ({ fromUserEmail, toUserEmail }) => {
    return await sendFriendRequestService(fromUserEmail, toUserEmail);
});

export const sendFollowRequest = createAsyncThunk('user/sendFollowRequest', async ({ fromUserEmail, toUserEmail }) => {
    return await sendFollowRequestService(fromUserEmail, toUserEmail);
});

export const fetchFriends = createAsyncThunk('user/fetchFriends', async (userEmail) => {
    return await fetchFriendsService(userEmail);
});


export const fetchSuggestedFriends = createAsyncThunk('user/fetchSuggestedFriends', async (userEmail) => {
    return await fetchSuggestedFriendsService(userEmail); 
});


export const fetchFriendRequests = createAsyncThunk('user/fetchFriendRequests', async (userEmail) => {
    return await fetchFriendRequestsService(userEmail); 
});


export const acceptFriendRequest = createAsyncThunk('user/acceptFriendRequest', async (requestId) => {
    return await acceptFriendRequestService(requestId); 
});


export const rejectFriendRequest = createAsyncThunk('user/rejectFriendRequest', async (requestId) => {
    return await rejectFriendRequestService(requestId); 
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        searchResults: [], 
        friends: [], 
        suggestedFriends: [],
        fetchStatus: 'idle', 
        updateStatus: 'idle', 
        searchStatus: 'idle', 
        friendRequestStatus: 'idle', 
        followRequestStatus: 'idle', 
        fetchFriendsStatus: 'idle', 
        fetchSuggestedFriendsStatus: 'idle', 
        error: null,
        fetchFriendRequestsStatus: 'idle', 
        acceptFriendRequestStatus: 'idle', 
        rejectFriendRequestStatus: 'idle', 
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
           
            .addCase(fetchUser.pending, (state) => {
                state.fetchStatus = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.fetchStatus = 'succeeded';
                state.userInfo = action.payload; 
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.error = action.error.message;
            })

            
            .addCase(updateProfile.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                state.userInfo = { ...state.userInfo, ...action.payload }; 
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.error = action.error.message;
            })

            .addCase(searchUsers.pending, (state) => {
                state.searchStatus = 'loading';
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.searchStatus = 'succeeded';
                state.searchResults = action.payload; 
                state.error = null;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.searchStatus = 'failed';
                state.error = action.error.message;
            })

      
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

            .addCase(fetchFriends.pending, (state) => {
                state.fetchFriendsStatus = 'loading';
            })
            .addCase(fetchFriends.fulfilled, (state, action) => {
                state.fetchFriendsStatus = 'succeeded';
                state.friends = action.payload; 
                state.error = null;
            })
            .addCase(fetchFriends.rejected, (state, action) => {
                state.fetchFriendsStatus = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchSuggestedFriends.pending, (state) => {
                state.fetchSuggestedFriendsStatus = 'loading';
            })
            .addCase(fetchSuggestedFriends.fulfilled, (state, action) => {
                state.fetchSuggestedFriendsStatus = 'succeeded';
                state.suggestedFriends = action.payload; 
                state.error = null;
            })
            .addCase(fetchSuggestedFriends.rejected, (state, action) => {
                state.fetchSuggestedFriendsStatus = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchFriendRequests.pending, (state) => {
                state.fetchFriendRequestsStatus = 'loading';
            })
            .addCase(fetchFriendRequests.fulfilled, (state, action) => {
                state.fetchFriendRequestsStatus = 'succeeded';
                state.friendRequests = action.payload; 
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
                state.friendRequests = state.friendRequests.filter(req => req.id !== action.payload); 
                state.error = null;
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.acceptFriendRequestStatus = 'failed';
                state.error = action.error.message;
            })

            .addCase(rejectFriendRequest.pending, (state) => {
                state.rejectFriendRequestStatus = 'loading';
            })
            .addCase(rejectFriendRequest.fulfilled, (state, action) => {
                state.rejectFriendRequestStatus = 'succeeded';
                state.friendRequests = state.friendRequests.filter(req => req.id !== action.payload); 
                state.error = null;
            })
            .addCase(rejectFriendRequest.rejected, (state, action) => {
                state.rejectFriendRequestStatus = 'failed';
                state.error = action.error.message;
            })
    },
});

export default userSlice.reducer;