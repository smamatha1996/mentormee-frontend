import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchComments as fetchCommentsService, createComment as addCommentService, updateComment as editCommentService, deleteComment as removeCommentService } from '../services/commentService';

// Fetch comments for a post
export const fetchComments = createAsyncThunk('comment/fetchComments', async (postId, { rejectWithValue }) => {
    try {
        const comments = await fetchCommentsService(postId); // Call the correct service function
        return { postId, comments };
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Add a new comment to a post
export const addNewComment = createAsyncThunk('comment/addNewComment', async ({ postId, content, author }, { rejectWithValue }) => {
    try {
        const comment = await addCommentService({ postId, content, author }); // Send data as an object
        return { postId, comment };
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Edit a comment
export const updateComment = createAsyncThunk('comment/updateComment', async ({ postId, id, content, author }, { rejectWithValue }) => {
    try {
        const updatedComment = await editCommentService(id, content, author, postId); // Call the service with the correct parameters
        return { commentId: id, updatedComment };
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Delete a comment
export const deleteComment = createAsyncThunk('comment/deleteComment', async ({ postId, commentId }, { rejectWithValue }) => {
    try {
        await removeCommentService(commentId); // Call the correct service function
        return { postId, commentId }; // Return both postId and commentId
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Initial state
const initialState = {
    comments: {}, // Comments stored as {postId: [comment1, comment2,...]}
    status: 'idle',
    error: null,
};

// Create the comment slice
const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetching comments
            .addCase(fetchComments.fulfilled, (state, action) => {
                const { postId, comments } = action.payload;
                state.comments[postId] = comments;
            })
            // Handle adding a new comment
            .addCase(addNewComment.fulfilled, (state, action) => {
                const { postId, comment } = action.payload;
                if (state.comments[postId]) {
                    state.comments[postId].push(comment);
                } else {
                    state.comments[postId] = [comment];
                }
            })
            // Handle editing a comment
            .addCase(updateComment.fulfilled, (state, action) => {
                const { commentId, updatedComment } = action.payload;
                const postId = updatedComment.postId; // Retrieve postId from the updated comment
                const index = state.comments[postId].findIndex((comment) => comment.id === commentId);
                if (index !== -1) {
                    state.comments[postId][index] = updatedComment;
                }
            })
            // Handle deleting a comment
            .addCase(deleteComment.fulfilled, (state, action) => {
                const { postId, commentId } = action.payload; // Retrieve postId and commentId from action payload
                state.comments[postId] = state.comments[postId].filter((comment) => comment.id !== commentId);
            });
    },
});

export default commentSlice.reducer;