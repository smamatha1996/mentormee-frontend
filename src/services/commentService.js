import { addComment, getComments, removeComment, editComment } from '../utils/db';

// Create a new comment
export const createComment = async (commentData) => {
    try {
        // Add the new comment to the database
        const newComment = await addComment(commentData.postId, commentData.content, commentData.author);
        return newComment;
    } catch (error) {
        console.error("Failed to create comment:", error);
        throw new Error("Could not create comment");
    }
};

// Fetch comments for a specific post
export const fetchComments = async (postId) => {
    try {
        // Get all comments for the specified postId
        return await getComments(postId);
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        throw new Error("Could not fetch comments");
    }
};

// Delete a comment by its ID
export const deleteComment = async (commentId) => {
    try {
        // Remove the comment from the database
        await removeComment(commentId);
        return commentId;
    } catch (error) {
        console.error("Failed to delete comment:", error);
        throw new Error("Could not delete comment");
    }
};

// Update an existing comment
export const updateComment = async (id, content, author, postId) => {
    try {
        // Update the comment in the database
        const updatedComment = await editComment(id, content, author, postId);
        return updatedComment;
    } catch (error) {
        console.error("Failed to update comment:", error);
        throw new Error("Could not update comment");
    }
};