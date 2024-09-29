import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { BiCommentDetail } from 'react-icons/bi'; // Icons for actions
import { FaUserCircle } from 'react-icons/fa'; // Using FaUserCircle as profile icon
import Comments from './Comments';
import moment from 'moment';
import './Post.css'; // Custom CSS for layout improvements
import { MdDelete, MdEdit } from 'react-icons/md';

const Post = ({ post, commentCount = 0, onDelete, onEdit, currentUser }) => {
    const [showComments, setShowComments] = useState(false); // State to toggle comment visibility

    // Toggle comments visibility
    const handleToggleComments = () => {
        setShowComments(!showComments);
    };

    console.log(currentUser, "currentUser"); // Debug log
    console.log(post, "post"); // Debug log

    // Determine if the current user is the author of the post
    const isAuthor = currentUser?.username === post.author;

    return (
        <Card className="mb-4 post-card">
            <Card.Body>
                <div className="d-flex align-items-center post-header mb-3">
                    <FaUserCircle size={40} className="me-3" /> {/* Replaced with icon */}
                    <div className="post-author-info flex-grow-1">
                        <div>
                            <strong>{post.author || 'Anonymous'}</strong>
                            {post.feeling && (
                                <span className="text-muted ms-1">
                                    is feeling {post.feeling} <span role="img" aria-label="emoji">{post.emoji}</span>
                                </span>
                            )}
                        </div>
                        <small className="text-muted">
                            {moment(post.createdAt).fromNow()} {/* Displaying duration (e.g., "2 hours ago") */}
                        </small>
                    </div>

                    {/* Reserve space for edit and delete buttons, even if not shown */}
                    <div className={`ms-auto d-flex ${isAuthor ? '' : 'invisible'}`}>
                        <Button variant="link" onClick={onEdit} className="p-0">
                            <MdEdit size={20} title="Edit Post" />
                        </Button>
                        <Button variant="link" onClick={onDelete} className="p-0">
                            <MdDelete size={20} title="Delete Post" />
                        </Button>
                    </div>
                </div>

                <p className="post-content">{post.content}</p>

                {/* Post interactions (Likes, Comments, Shares) */}
                <div className="post-interactions d-flex align-items-center mt-3">
                    <div className="d-flex align-items-center me-3">
                        <Button variant="link" onClick={handleToggleComments} className="p-0">
                            <BiCommentDetail size={18} className="me-1" />
                            <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
                        </Button>
                    </div>
                </div>

                {/* Comments Section (conditionally rendered) */}
                {showComments && (
                    <div className="mt-3">
                        <Comments postId={post.id} isAuthor={isAuthor} onCloseComments={handleToggleComments} />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default Post;