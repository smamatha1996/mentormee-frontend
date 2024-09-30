import { addComment, getComments, removeComment, editComment } from '../utils/db';

export const createComment = async (commentData) => {
    try {
        const newComment = await addComment(commentData.postId, commentData.content, commentData.author);
        return newComment;
    } catch (error) {
        console.error("Failed to create comment:", error);
        throw new Error("Could not create comment");
    }
};

export const fetchComments = async (postId) => {
    try {
        return await getComments(postId);
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        throw new Error("Could not fetch comments");
    }
};

export const deleteComment = async (commentId) => {
    try {
        await removeComment(commentId);
        return commentId;
    } catch (error) {
        console.error("Failed to delete comment:", error);
        throw new Error("Could not delete comment");
    }
};

export const updateComment = async (id, content, author, postId) => {
    try {
        const updatedComment = await editComment(id, content, author, postId);
        return updatedComment;
    } catch (error) {
        console.error("Failed to update comment:", error);
        throw new Error("Could not update comment");
    }
};