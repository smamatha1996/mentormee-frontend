import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchComments as fetchCommentsService, createComment as addCommentService, updateComment as editCommentService, deleteComment as removeCommentService } from '../services/commentService';


export const fetchComments = createAsyncThunk('comment/fetchComments', async (postId, { rejectWithValue }) => {
    try {
        const comments = await fetchCommentsService(postId); 
        return { postId, comments };
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const addNewComment = createAsyncThunk('comment/addNewComment', async ({ postId, content, author }, { rejectWithValue }) => {
    try {
        const comment = await addCommentService({ postId, content, author }); 
        return { postId, comment };
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const updateComment = createAsyncThunk('comment/updateComment', async ({ postId, id, content, author }, { rejectWithValue }) => {
    try {
        const updatedComment = await editCommentService(id, content, author, postId); 
        return { commentId: id, updatedComment };
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const deleteComment = createAsyncThunk('comment/deleteComment', async ({ postId, commentId }, { rejectWithValue }) => {
    try {
        await removeCommentService(commentId); 
        return { postId, commentId }; 
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


const initialState = {
    comments: {},
    status: 'idle',
    error: null,
};


const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
           
            .addCase(fetchComments.fulfilled, (state, action) => {
                const { postId, comments } = action.payload;
                state.comments[postId] = comments;
            })
            
            .addCase(addNewComment.fulfilled, (state, action) => {
                const { postId, comment } = action.payload;
                if (state.comments[postId]) {
                    state.comments[postId].push(comment);
                } else {
                    state.comments[postId] = [comment];
                }
            })
            
            .addCase(updateComment.fulfilled, (state, action) => {
                const { commentId, updatedComment } = action.payload;
                const postId = updatedComment.postId; 
                const index = state.comments[postId].findIndex((comment) => comment.id === commentId);
                if (index !== -1) {
                    state.comments[postId][index] = updatedComment;
                }
            })
            
            .addCase(deleteComment.fulfilled, (state, action) => {
                const { postId, commentId } = action.payload; 
                state.comments[postId] = state.comments[postId].filter((comment) => comment.id !== commentId);
            });
    },
});

export default commentSlice.reducer;