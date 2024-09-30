import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPost, fetchPosts, deletePost, updatePost } from '../store/postSlice';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Post from '../components/Post';
import { toast } from 'react-toastify';

const Posts = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);
    const [content, setContent] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [loading, setLoading] = useState(false);

   
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const validateContent = (content) => {
        const trimmedContent = content.trim();
        if (!trimmedContent) {
            toast.error('Post content cannot be empty.');
            return false;
        }
        if (trimmedContent.length < 10) {
            toast.error('Post content is too short. Please write at least 10 characters.');
            return false;
        }
        if (trimmedContent.length > 1000) {
            toast.error('Post content is too long. Please keep it under 1000 characters.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateContent(content)) {
            setLoading(true);
            try {
                if (editMode) {
                    await dispatch(updatePost({ id: currentPostId, content })).unwrap();
                    toast.success('Post updated successfully!');
                } else {
                    await dispatch(createPost(content)).unwrap();
                    toast.success('Post created successfully!');
                }
                setContent('');
                setEditMode(false);
                setCurrentPostId(null);
                dispatch(fetchPosts()); 
            } catch (err) {
                toast.error(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (post) => {
        console.log('Editing post:', post);
        if (post && post.id) {
            setEditMode(true);
            setContent(post.content);
            setCurrentPostId(post.id);  
        } else {
            console.error('Post ID not found:', post);
        }
    };

    const handleDelete = async (id) => {
        await dispatch(deletePost(id)).unwrap();
        toast.success('Post deleted successfully!');
    };

    return (
        <Container fluid className="py-5 bg-light">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <h2 className="text-center mb-4">Social Media</h2>
                    <Form onSubmit={handleSubmit} className="mb-5">
                        <Form.Group controlId="postContent" className="mb-4">
                            <Form.Label>{editMode ? "Edit Post" : "Create a Post"}</Form.Label>
                            <ReactQuill
                                value={content}
                                onChange={setContent}
                                placeholder="Share your thoughts..."
                                style={{ height: '150px', marginBottom: '40px' }}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
                            {loading ? (editMode ? 'Updating...' : 'Posting...') : (editMode ? 'Update Post' : 'Post')}
                        </Button>
                    </Form>
                    <h3 className="mb-3 text-center">Posts</h3>
                    <div className="posts-list">
                        {posts.length === 0 ? (
                            <p className="text-center">No posts available. Be the first to share!</p>
                        ) : (
                            posts.map((post, index) => (
                                post && post.content ? (
                                    <Post key={post.id || index} post={post} onEdit={handleEdit} onDelete={handleDelete} />
                                ) : null
                            ))
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Posts;