import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, ListGroup, Button, Alert, Spinner, Form } from 'react-bootstrap';
import {
    updateProfile,
    fetchUser,
    searchUsers,
    fetchFriends,
    fetchFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    fetchSuggestedFriends,
    sendFollowRequest
} from '../store/userSlice';
import './Profile.scss';
import FindUsers from './FindUsers';

const Profile = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const searchResults = useSelector((state) => state.user.searchResults);
    const friendsList = useSelector((state) => state.user.friends);
    const friendRequests = useSelector((state) => state.user.friendRequests);
    const suggestedFriends = useSelector((state) => state.user.suggestedFriends);
    const token = localStorage.getItem('mentorMeeToken');
    const email = userInfo?.email || token?.split('-')[0];

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!userInfo && email) {
            dispatch(fetchUser(email));
        }
        dispatch(fetchFriends());
        dispatch(fetchSuggestedFriends());
        dispatch(fetchFriendRequests());
    }, [dispatch, userInfo, email]);

    useEffect(() => {
        if (userInfo) {
            setFirstName(userInfo.firstName || '');
            setLastName(userInfo.lastName || '');
            setUsername(userInfo.username || '');
        }
    }, [userInfo]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError(null);
        setSuccess(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        dispatch(updateProfile({ email, profileData: { firstName, lastName } }))
            .then(() => {
                setSuccess('Profile updated successfully');
                setIsEditing(false);
                return dispatch(fetchUser(email));
            })
            .catch(() => setError('Failed to update profile'))
            .finally(() => setLoading(false));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim()) {
            dispatch(searchUsers(e.target.value));
        }
    };

    const handleSelectUser = (user) => {
        setSearchQuery('');
    };

    const handleSendFriendRequest = (toUserEmail) => {
        dispatch(sendFriendRequest({ fromUserEmail: email, toUserEmail }));
    };

    
    const handleAcceptRequest = (requestId) => {
        dispatch(acceptFriendRequest(requestId))
            .then(() => dispatch(fetchFriends()));
    };

   
    const handleRejectRequest = (requestId) => {
        dispatch(rejectFriendRequest(requestId));
    };

    return (
        <Container className="my-5">
            <Row>
                {}
                <Col xs={12} md={8}>
                    <Card className="shadow p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">Profile</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            {!isEditing ? (
                                <>
                                    <p><strong>First Name:</strong> {firstName}</p>
                                    <p><strong>Last Name:</strong> {lastName}</p>
                                    <p><strong>Email:</strong> {email}</p>
                                    <p><strong>Username:</strong> {username}</p>
                                    <Button variant="primary" onClick={handleEditToggle} className="w-100">
                                        Edit Profile
                                    </Button>
                                </>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </Form.Group>

                                    <p><strong>Email:</strong> {email}</p>
                                    <p><strong>Username:</strong> {username}</p>

                                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Save Changes'}
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        onClick={handleCancelEdit}
                                        className="w-100 mt-2"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {}
                <Col xs={12} md={4}>
                    {}
                    <FindUsers
                        currentUserId={userInfo?.id}
                        searchQuery={searchQuery}
                        handleSearchChange={handleSearchChange}
                        searchResults={searchResults}
                        handleSelectUser={handleSelectUser}
                        sendFriendRequest={(toUserEmail) => handleSendFriendRequest(toUserEmail)}
                        sendFollowRequest={(toUserEmail) => dispatch(sendFollowRequest({ fromUserEmail: email, toUserEmail }))}
                    />

                    {}
                    <Card className="shadow mb-4">
                        <Card.Body>
                            <h4>Friends</h4>
                            {friendsList && friendsList.length > 0 ? (
                                <ListGroup>
                                    {friendsList.map((friend) => (
                                        <ListGroup.Item key={friend.id}>
                                            {friend.username} ({friend.email})
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No friends yet.</p>
                            )}
                        </Card.Body>
                    </Card>

                    {}
                    <Card className="shadow mb-4">
                        <Card.Body>
                            <h4>Friend Requests</h4>
                            {friendRequests && friendRequests.length > 0 ? (
                                <ListGroup>
                                    {friendRequests.map((request) => (
                                        <ListGroup.Item key={request.id}>
                                            {request.from.username} ({request.from.email})
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="float-end"
                                                onClick={() => handleAcceptRequest(request.id)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="float-end me-2"
                                                onClick={() => handleRejectRequest(request.id)}
                                            >
                                                Reject
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No friend requests.</p>
                            )}
                        </Card.Body>
                    </Card>

                    {}
                    <Card className="shadow">
                        <Card.Body>
                            <h4>Suggested Friends</h4>
                            {suggestedFriends && suggestedFriends.length > 0 ? (
                                <ListGroup>
                                    {suggestedFriends.map((user) => (
                                        <ListGroup.Item key={user.id}>
                                            {user.username} ({user.email})
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="float-end"
                                                onClick={() => handleSendFriendRequest(user.email)}
                                            >
                                                Add Friend
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No suggestions available.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;