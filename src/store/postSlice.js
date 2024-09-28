import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPosts as fetchPostsService, createPost as createPostService, deletePost as deletePostService, updatePost as updatePostService } from '../services/postService'; // Importing from the new post service

// Thunk to fetch posts from the database
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
    try {
        const posts = await fetchPostsService(); // Call the fetchPostsService
        return posts;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Thunk to create a new post with content and author
export const createPost = createAsyncThunk('posts/createPost', async ({ content, author }, { rejectWithValue }) => {
    try {
        const newPost = await createPostService(content, author); // Call the createPostService
        return newPost;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Thunk to delete a post
export const deletePost = createAsyncThunk('posts/deletePost', async (postId, { rejectWithValue }) => {
    try {
        await deletePostService(postId); // Call the deletePostService
        return postId;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Thunk to update a post
export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, content, author }, { rejectWithValue }) => {
    try {
        const updatedPost = await updatePostService(id, content, author); // Call the updatePostService
        return updatedPost;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Define the initial state of the post slice
const initialState = {
    posts: [],
    status: 'idle',
    error: null,
};

// Create the post slice
const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Handle fetching posts
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

        // Handle creating a new post
        builder
            .addCase(createPost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts.push(action.payload); // Add the new post to the posts array
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        // Handle deleting a post
        builder
            .addCase(deletePost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = state.posts.filter((post) => post.id !== action.payload); // Remove the deleted post
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        // Handle updating a post
        builder
            .addCase(updatePost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.posts.findIndex((post) => post.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = action.payload; // Update the post with the new content and author
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Export the default reducer
export default postSlice.reducer;