import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, createPost, deletePost, updatePost } from '../store/postSlice';
import { Button, Card, Container, Row, Col, Modal, Alert, FormControl } from 'react-bootstrap';
import Post from '../components/Post';
import moment from 'moment'; // For formatting the post creation time

const Feed = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts);
    const userInfo = useSelector((state) => state.user.userInfo); // Get user info from Redux
    const [postContent, setPostContent] = useState('');
    const [editingPostId, setEditingPostId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    // Handle creating a new post
    const handleCreatePost = () => {
        if (postContent.trim()) {
            const newPost = {
                content: postContent, // Passing content directly as a string
                author: userInfo?.username || 'Anonymous', // Pass the author's username
            };
            dispatch(createPost(newPost))
                .unwrap()
                .then(() => {
                    setSuccess('Post created successfully');
                    setError(null);
                })
                .catch(() => setError('Failed to create post'));
            setPostContent('');
        } else {
            setError('Post content cannot be empty');
        }
    };

    // Handle deleting a post
    const handleDeletePost = (postId) => {
        dispatch(deletePost(postId))
            .unwrap()
            .then(() => {
                setSuccess('Post deleted successfully');
                setError(null);
            })
            .catch(() => setError('Failed to delete post'));
    };

    // Handle editing a post
    const handleEditPost = (postId, content) => {
        setEditingPostId(postId);
        setPostContent(content); // Make sure to set the post content correctly here
        setShowEditModal(true);
    };

    // Handle saving edited post
    const handleSaveEdit = () => {
        if (postContent.trim()) {
            const updatedPost = {
                id: editingPostId,
                content: postContent, // Keep content as a string for the post
                author: userInfo?.username || 'Anonymous', // Retain the author's username
                updatedAt: new Date().toISOString(), // Add updated timestamp
            };

            // Dispatch the update post action
            dispatch(updatePost(updatedPost))
                .unwrap()
                .then(() => {
                    setSuccess('Post updated successfully');
                    setError(null);
                })
                .catch(() => setError('Failed to update post'));

            // Close the modal and reset the post content
            setShowEditModal(false);
            setPostContent('');
        } else {
            setError('Post content cannot be empty');
        }
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={12}>
                    <Card className="mb-3">
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            <div className="mb-3">
                                <FormControl
                                    as="textarea"
                                    rows={3}
                                    placeholder="What's on your mind?"
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                />
                                <Button onClick={handleCreatePost} variant="primary" className="w-100 mt-2">
                                    Create Post
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <Post
                                key={post.id}
                                post={post}
                                onDelete={() => handleDeletePost(post.id)}
                                onEdit={() => handleEditPost(post.id, post.content)}
                            />
                        ))
                    ) : (
                        <p>No posts yet. Be the first to create one!</p>
                    )}
                </Col>
            </Row>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl
                        as="textarea"
                        rows={3}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Feed;