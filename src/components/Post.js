import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { BiEdit, BiTrash } from 'react-icons/bi'; // Modern icons
import Comments from './Comments';
import moment from 'moment'; // For formatting the duration
import './Post.css'; // Include a custom CSS file for layout improvements

const Post = ({ post, onDelete, onEdit }) => {
    return (
        <Card className="mb-4 post-card">
            <Card.Body>
                <div className="post-header d-flex justify-content-between">
                    <div className="post-content">
                        {post.content}
                    </div>
                    <div className="post-actions">
                        <Button variant="link" onClick={onEdit} className="p-0 edit-btn">
                            <BiEdit size={22} title="Edit Post" />
                        </Button>
                        <Button variant="link" onClick={onDelete} className="p-0 delete-btn">
                            <BiTrash size={22} title="Delete Post" />
                        </Button>
                    </div>
                </div>
                <div className="mt-2">
                    <small className="text-muted">
                        Posted by {post.author || 'Anonymous'} - {moment(post.createdAt).fromNow()}
                    </small>
                </div>

                {/* Comments Section */}
                <div className="comments-section mt-3">
                    <Comments postId={post.id} />
                </div>
            </Card.Body>
        </Card>
    );
};

export default Post;