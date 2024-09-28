import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Container, Row, Col, Alert, Card, Spinner } from 'react-bootstrap';
import { updateProfile, fetchUser } from '../store/userSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const token = localStorage.getItem('mentorMeeToken'); // Get the token from localStorage
    const email = userInfo?.email || token?.split('-')[0]; // Extract email from token or get from userInfo

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch user profile on component load by passing the email if userInfo is not already available
    useEffect(() => {
        if (!userInfo && email) {
            dispatch(fetchUser(email));
        }
    }, [dispatch, userInfo, email]);

    // Once userInfo is available, populate the form fields
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

        dispatch(updateProfile({ email, profileData: { firstName, lastName } })) // Only updating firstName and lastName
            .then(() => {
                setSuccess('Profile updated successfully');
                setIsEditing(false);
                return dispatch(fetchUser(email)); // Fetch updated profile by email
            })
            .catch(() => setError('Failed to update profile'))
            .finally(() => setLoading(false));
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
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
            </Row>
        </Container>
    );
};

export default Profile;