import { addPost, getPosts, removePost, editPost } from '../utils/db';

export const createPost = async (content, author) => {
    try {
        const newPost = await addPost(content, author); 
    } catch (error) {
        console.error("Failed to create post:", error);
        throw new Error("Could not create post");
    }
};

export const fetchPosts = async () => {
    try {
        return await getPosts();
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        throw new Error("Could not fetch posts");
    }
};

export const deletePost = async (postId) => {
    try {
        await removePost(postId);
        return postId;
    } catch (error) {
        console.error("Failed to delete post:", error);
        throw new Error("Could not delete post");
    }
};

export const updatePost = async (id, content, author) => {
    try {
        const updatedPost = await editPost(id, content, author); 
        return updatedPost;
    } catch (error) {
        console.error("Failed to update post:", error);
        throw new Error("Could not update post");
    }
};