import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaRegUser, FaClipboardList, FaCommentDots } from 'react-icons/fa';
import { fetchPosts } from '../store/postSlice'; 
import './Dashboard.css';  

const Dashboard = () => {
    const dispatch = useDispatch();
    const { posts, postStatus } = useSelector((state) => state.post);
    const { userInfo } = useSelector((state) => state.user);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    useEffect(() => {
        if (posts.length > 0) {
            const totalPosts = posts.length;
            const totalComments = posts.reduce((total, post) => total + (post.comments?.length || 0), 0);
            setStats({ totalPosts, totalComments });
        }
    }, [posts]);

    if (postStatus === 'loading') {
        return (
            <div className="loading-container">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container className="dashboard-container my-5">
            <Row className="mb-4">
                <Col>
                    <h1 className="dashboard-title">Dashboard</h1>
                </Col>
            </Row>

            {userInfo && (
                <Row className="mb-4">
                    <Col>
                        <Card className="user-info-card shadow-sm">
                            <Card.Body>
                                <h3>Hello, {userInfo.firstName} {userInfo.lastName}</h3>
                                <p>Email: {userInfo.email}</p>
                                <p>Username: {userInfo.username}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Row className="stats-grid">
                <Col md={4}>
                    <Card className="stat-card text-center">
                        <Card.Body>
                            <FaClipboardList size={50} className="icon" />
                            <h4>Total Posts</h4>
                            <p className="stat-number">{stats?.totalPosts || 0}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="stat-card text-center">
                        <Card.Body>
                            <FaCommentDots size={50} className="icon" />
                            <h4>Total Comments</h4>
                            <p className="stat-number">{stats?.totalComments || 0}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {(!stats || (stats.totalPosts === 0 && stats.totalComments === 0)) && (
                <Alert variant="info" className="text-center mt-4">No posts or comments yet.</Alert>
            )}
        </Container>
    );
};

export default Dashboard;