import { addPost, getPosts, removePost, editPost } from '../utils/db';

// Create a new post with content and author as separate arguments
export const createPost = async (content, author) => {
    try {
        const newPost = await addPost(content, author); // Pass content and author separately
        return newPost;
    } catch (error) {
        console.error("Failed to create post:", error);
        throw new Error("Could not create post");
    }
};

// Fetch all posts
export const fetchPosts = async () => {
    try {
        return await getPosts();
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        throw new Error("Could not fetch posts");
    }
};

// Delete a post by its ID
export const deletePost = async (postId) => {
    try {
        await removePost(postId);
        return postId;
    } catch (error) {
        console.error("Failed to delete post:", error);
        throw new Error("Could not delete post");
    }
};

// Update a post with separate content and author arguments
export const updatePost = async (id, content, author) => {
    try {
        const updatedPost = await editPost(id, content, author); // Pass content and author separately
        return updatedPost;
    } catch (error) {
        console.error("Failed to update post:", error);
        throw new Error("Could not update post");
    }
};