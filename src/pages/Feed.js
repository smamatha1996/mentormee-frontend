import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, createPost, deletePost, updatePost } from '../store/postSlice';
import { fetchComments } from '../store/commentSlice'; // Action to fetch comments for each post
import { Button, Card, Container, Row, Col, Modal, FormControl, Dropdown } from 'react-bootstrap';
import Post from '../components/Post';
import { fetchUser } from '../store/userSlice';
import Feedback from '../components/Feedback';

const Feed = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts);
    const comments = useSelector((state) => state.comment.comments); // Access all comments from Redux state
    const userInfo = useSelector((state) => state.user.userInfo); // Get user info from Redux
    const [postContent, setPostContent] = useState('');
    const [editingPostId, setEditingPostId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '', show: false });
    const [sortOrder, setSortOrder] = useState('latest'); // Default sort order is 'latest'

    // Fetch posts and user info on mount
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch, userInfo]);

    // Fetch comments for each post
    useEffect(() => {
        if (posts && posts.length > 0) {
            posts.forEach((post) => {
                dispatch(fetchComments(post.id));
            });
        }
    }, [dispatch, posts]);

    // Sort posts by createdAt (latest or oldest)
    const sortedPosts = [...posts].sort((a, b) => {
        if (sortOrder === 'latest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // Handle sorting change
    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    // Handle creating a new post
    const handleCreatePost = () => {
        if (postContent.trim()) {
            const newPost = {
                content: postContent,
                author: userInfo?.username || 'Anonymous',
            };
            dispatch(createPost(newPost))
                .unwrap()
                .then(() => {
                    setFeedback({ type: 'success', message: 'Post created successfully', show: true });
                })
                .catch(() => setFeedback({ type: 'danger', message: 'Failed to create post', show: true }));
            setPostContent('');
        } else {
            setFeedback({ type: 'danger', message: 'Post content cannot be empty', show: true });
        }
    };

    // Handle deleting a post
    const handleDeletePost = (postId) => {
        dispatch(deletePost(postId))
            .unwrap()
            .then(() => {
                setFeedback({ type: 'success', message: 'Post deleted successfully', show: true });
            })
            .catch(() => setFeedback({ type: 'danger', message: 'Failed to delete post', show: true }));
    };

    // Handle editing a post
    const handleEditPost = (postId, content) => {
        setEditingPostId(postId);
        setPostContent(content);
        setShowEditModal(true);
    };

    // Handle saving edited post
    const handleSaveEdit = () => {
        if (postContent.trim()) {
            const updatedPost = {
                id: editingPostId,
                content: postContent,
                author: userInfo?.username || 'Anonymous',
                updatedAt: new Date().toISOString(),
            };

            dispatch(updatePost(updatedPost))
                .unwrap()
                .then(() => {
                    setFeedback({ type: 'success', message: 'Post updated successfully', show: true });
                })
                .catch(() => setFeedback({ type: 'danger', message: 'Failed to update post', show: true }));

            setShowEditModal(false);
            setPostContent('');
        } else {
            setFeedback({ type: 'danger', message: 'Post content cannot be empty', show: true });
        }
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={12}>
                    {/* Feedback Component */}
                    <Feedback
                        type={feedback.type}
                        message={feedback.message}
                        show={feedback.show}
                        autoHide={true}
                        duration={3000} // Auto-hide after 3 seconds
                        onClose={() => setFeedback({ ...feedback, show: false })} // Close the feedback message
                    />

                    <Card className="mb-3">
                        <Card.Body>
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

                    {/* Sort Dropdown - Below Add Post Box and Right Aligned */}
                    <div className="d-flex justify-content-end mb-3">
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                Sort by {sortOrder === 'latest' ? 'Latest' : 'Oldest'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleSortChange('latest')}>Latest</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSortChange('oldest')}>Oldest</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {sortedPosts && sortedPosts.length > 0 ? (
                        sortedPosts.map((post) => {
                            const postComments = comments[post.id] || [];
                            return (
                                <Post
                                    key={post.id}
                                    post={post}
                                    commentCount={postComments.length} // Pass the number of comments
                                    onDelete={() => handleDeletePost(post.id)}
                                    onEdit={() => handleEditPost(post.id, post.content)}
                                    currentUser={userInfo} // Pass the current user info to handle author visibility
                                />
                            );
                        })
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