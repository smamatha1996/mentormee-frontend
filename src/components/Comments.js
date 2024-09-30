import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addNewComment, deleteComment, updateComment } from '../store/commentSlice';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import Comment from './Comment'; 
import './Comments.scss'; 

const Comments = ({ postId, onCloseComments, isAuthor }) => {
    const dispatch = useDispatch();
    const comments = useSelector((state) => state.comment.comments[postId] || []);
    const userInfo = useSelector((state) => state.user.userInfo);
    const [commentContent, setCommentContent] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        dispatch(fetchComments(postId));
    }, [dispatch, postId]);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';  
        textarea.style.height = `${textarea.scrollHeight}px`;  
    };

    const handleAddComment = () => {
        if (commentContent.trim()) {
            const newComment = {
                postId,
                content: commentContent,
                author: userInfo?.username || 'Anonymous',
            };
            dispatch(addNewComment(newComment));
            setCommentContent('');
        }
    };

    const handleDelete = (commentId) => {
        dispatch(deleteComment({ postId, commentId }));
    };

    const handleUpdate = (updatedComment) => {
        dispatch(updateComment(updatedComment));
    };

    return (
        <div className="comments-container">
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    isAuthor={isAuthor}
                    userInfo={userInfo}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                />
            ))}

            {}
            <div className="add-comment">
                <div className="comment-input-container">
                    <InputGroup className="input-group">
                        <FormControl
                            as="textarea"
                            ref={textareaRef}
                            rows={1}
                            placeholder="Enter your comment..."
                            value={commentContent}
                            onChange={(e) => {
                                setCommentContent(e.target.value);
                                adjustTextareaHeight();
                            }}
                            className="transparent-input"
                        />
                    </InputGroup>
                    <div className="comment-buttons mt-2">
                        <Button variant="secondary" onClick={onCloseComments} className="cancel-btn me-2">
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddComment} className="send-btn">
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comments;