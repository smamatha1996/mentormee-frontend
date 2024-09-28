import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addNewComment, deleteComment, updateComment } from '../store/commentSlice';
import { Button, Card, FormControl, FormLabel, InputGroup } from 'react-bootstrap';
import { BiEdit, BiTrash, BiCommentAdd } from 'react-icons/bi';
import moment from 'moment'; // For formatting the duration
import './Comments.css';  // Import custom CSS for further styling

const Comments = ({ postId }) => {
    const dispatch = useDispatch();
    const comments = useSelector((state) => state.comment.comments[postId] || []);
    const userInfo = useSelector((state) => state.user.userInfo); // Fetch user info from Redux state
    const [commentContent, setCommentContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');

    useEffect(() => {
        dispatch(fetchComments(postId)); // Fetch comments when component mounts
    }, [dispatch, postId]);

    // Add a new comment with the author and postId
    const handleAddComment = () => {
        if (commentContent.trim()) {
            const newComment = {
                postId: postId,
                content: commentContent,  // Pass content as string
                author: userInfo?.username || 'Anonymous',  // Pass author as string
            };
            dispatch(addNewComment(newComment));
            setCommentContent('');
        }
    };

    // Set comment in editing mode
    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentContent(comment.content);
    };

    const handleSaveCommentEdit = () => {
        if (editingCommentContent.trim()) {
            const updatedComment = {
                id: editingCommentId, // Make sure editingCommentId is defined and passed correctly
                postId, // Ensure postId is retained during the edit
                content: editingCommentContent,
                author: userInfo?.username || 'Anonymous', // Retain the author during edit
                updatedAt: new Date().toISOString(),
            };
            dispatch(updateComment(updatedComment)) // Dispatch the update comment action
                .unwrap()
                .then(() => setEditingCommentId(null))
                .catch((err) => console.error("Error updating comment:", err));
        }
    };

    // Delete a comment
    const handleDeleteComment = (commentId) => {
        dispatch(deleteComment({ postId, commentId })); // Pass both postId and commentId when deleting
    };

    return (
        <div className="comments-container">
            <h5 className="mb-3">Comments</h5>
            {comments && comments.length > 0 ? (
                comments.map((comment) => (
                    <Card key={comment.id} className="mb-3 shadow-sm comment-card">
                        <Card.Body className="d-flex justify-content-between">
                            {editingCommentId === comment.id ? (
                                <>
                                    <FormControl
                                        type="text"
                                        value={editingCommentContent}
                                        onChange={(e) => setEditingCommentContent(e.target.value)}
                                        className="edit-comment-input"
                                    />
                                    <div className="comment-actions">
                                        <Button variant="success" onClick={handleSaveCommentEdit} className="me-2">
                                            Save
                                        </Button>
                                        <Button variant="secondary" onClick={() => setEditingCommentId(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="comment-content">{comment.content}</p>
                                    <small className="text-muted">
                                        Commented by {comment.author || 'Anonymous'} - {moment(comment.createdAt).fromNow()}
                                    </small>
                                    <div className="comment-actions">
                                        <Button variant="outline-primary" onClick={() => handleEditComment(comment)} className="me-2">
                                            <BiEdit size={16} /> Edit
                                        </Button>
                                        <Button variant="outline-danger" onClick={() => handleDeleteComment(comment.id)}>
                                            <BiTrash size={16} /> Delete
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p className="text-muted">No comments yet. Be the first to comment!</p>
            )}

            {/* Add New Comment */}
            <div className="add-comment mt-4">
                <FormLabel className="fw-bold">Add a comment:</FormLabel>
                <InputGroup>
                    <FormControl
                        type="text"
                        placeholder="Enter your comment..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleAddComment}>
                        <BiCommentAdd size={18} className="me-1" /> Add Comment
                    </Button>
                </InputGroup>
            </div>
        </div>
    );
};

export default Comments;