import React, { useState, useRef } from 'react';
import { Button, FormControl, InputGroup, Row, Col } from 'react-bootstrap';
import { MdEdit, MdDelete } from "react-icons/md";
import { FaUserCircle } from 'react-icons/fa'; // Using FaUserCircle as profile icon
import moment from 'moment';
import './Comment.scss'; // Use SCSS for styling

const Comment = ({ comment, isAuthor, userInfo, handleDelete, handleUpdate }) => {
    const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited
    const [editingContent, setEditingContent] = useState(''); // Track the content being edited
    const textareaRef = useRef(null); // Ref for the textarea when editing

    // Handle edit button click
    const handleEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content); // Set the content to be edited
    };

    // Save the edited comment
    const handleSaveEdit = () => {
        if (editingContent.trim()) {
            const updatedComment = {
                id: editingCommentId,
                postId: comment.postId,
                content: editingContent,
                author: userInfo?.username || 'Anonymous',
            };
            handleUpdate(updatedComment);
            setEditingCommentId(null); // Reset editing state
            setEditingContent('');
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingCommentId(null); // Exit editing mode
        setEditingContent(''); // Clear editing content
    };

    // Function to auto-adjust textarea height
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';  // Reset height
        textarea.style.height = `${textarea.scrollHeight}px`;  // Set new height based on content
    };

    return (
        <div className="comment-card mb-3">
            <Row className="align-items-start">
                <Col xs="auto">
                    <FaUserCircle size={30} className="comment-user-icon" /> {/* Replaced image with icon */}
                </Col>
                <Col className="flex-grow-1"> {/* This will make this column take up the remaining space */}
                    <div className="comment-content">
                        <div className="d-flex justify-content-between">
                            <div>
                                <span className="comment-author">{comment.author || 'Anonymous'}</span>
                                <small className="comment-time">
                                    • {moment(comment.createdAt).fromNow()}
                                </small>
                            </div>
                            {/* Show edit and delete buttons only if the current user is the comment author */}
                            {isAuthor || userInfo?.username === comment.author ? (
                                <div className="comment-actions">
                                    <Button variant="link" onClick={() => handleEdit(comment)} title="Edit">
                                        <MdEdit size={18} />
                                    </Button>
                                    <Button variant="link" onClick={() => handleDelete(comment.id)} title="Delete">
                                        <MdDelete size={18} />
                                    </Button>
                                </div>
                            ) : null}
                        </div>

                        {editingCommentId === comment.id ? (
                            <div className="edit-comment">
                                <div className="comment-input-container">
                                    <InputGroup className="input-group">
                                        <FormControl
                                            as="textarea"
                                            ref={textareaRef}
                                            rows={1}
                                            value={editingContent}
                                            onChange={(e) => {
                                                setEditingContent(e.target.value);
                                                adjustTextareaHeight();
                                            }}
                                            className="transparent-input"
                                        />
                                    </InputGroup>
                                    <div className="comment-buttons mt-2">
                                        <Button variant="secondary" size="sm" onClick={handleCancelEdit} className="cancel-btn me-2">
                                            Cancel
                                        </Button>
                                        <Button variant="primary" size="sm" onClick={handleSaveEdit} className="save-btn">
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="comment-text">{comment.content}</p>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Comment;