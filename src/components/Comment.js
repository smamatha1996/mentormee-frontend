import React, { useState, useRef } from 'react';
import { Button, FormControl, InputGroup, Row, Col } from 'react-bootstrap';
import { MdEdit, MdDelete } from "react-icons/md";
import { FaUserCircle } from 'react-icons/fa'; 
import moment from 'moment';
import './Comment.scss'; 

const Comment = ({ comment, isAuthor, userInfo, handleDelete, handleUpdate }) => {
    const [editingCommentId, setEditingCommentId] = useState(null); 
    const [editingContent, setEditingContent] = useState(''); 
    const textareaRef = useRef(null); 

    
    const handleEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content); 
    };


    const handleSaveEdit = () => {
        if (editingContent.trim()) {
            const updatedComment = {
                id: editingCommentId,
                postId: comment.postId,
                content: editingContent,
                author: userInfo?.username || 'Anonymous',
            };
            handleUpdate(updatedComment);
            setEditingCommentId(null); 
            setEditingContent('');
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null); 
        setEditingContent(''); 
    };

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';  
        textarea.style.height = `${textarea.scrollHeight}px`;  
    };

    return (
        <div className="comment-card mb-3">
            <Row className="align-items-start">
                <Col xs="auto">
                    <FaUserCircle size={30} className="comment-user-icon" /> {}
                </Col>
                <Col className="flex-grow-1"> {}
                    <div className="comment-content">
                        <div className="d-flex justify-content-between">
                            <div>
                                <span className="comment-author">{comment.author || 'Anonymous'}</span>
                                <small className="comment-time">
                                    • {moment(comment.createdAt).fromNow()}
                                </small>
                            </div>
                            {}
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