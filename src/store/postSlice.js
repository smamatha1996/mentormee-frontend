import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPosts as fetchPostsService, createPost as createPostService, deletePost as deletePostService, updatePost as updatePostService } from '../services/postService'; // Importing from the new post service


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
    try {
        const posts = await fetchPostsService(); 
        return posts;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const createPost = createAsyncThunk('posts/createPost', async ({ content, author }, { rejectWithValue }) => {
    try {
        const newPost = await createPostService(content, author); 
        return newPost;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const deletePost = createAsyncThunk('posts/deletePost', async (postId, { rejectWithValue }) => {
    try {
        await deletePostService(postId); 
        return postId;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, content, author }, { rejectWithValue }) => {
    try {
        const updatedPost = await updatePostService(id, content, author); 
        return updatedPost;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const initialState = {
    posts: [],
    status: 'idle',
    error: null,
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        builder
            .addCase(createPost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts.push(action.payload); 
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        builder
            .addCase(deletePost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = state.posts.filter((post) => post.id !== action.payload); 
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        builder
            .addCase(updatePost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.posts.findIndex((post) => post.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default postSlice.reducer;