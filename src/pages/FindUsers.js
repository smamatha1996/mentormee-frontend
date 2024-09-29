import React, { useState } from 'react';
import { Modal, FormControl, InputGroup, Button, Row, Col, Container } from 'react-bootstrap';
import { FaSearch, FaUserPlus, FaUserCheck, FaUserCircle } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi'; // Icon for follow button
import './FindUsers.scss';

const FindUsers = ({ searchQuery, handleSearchChange, searchResults, handleSelectUser, sendFriendRequest, sendFollowRequest, currentUserId }) => {
    const [showModal, setShowModal] = useState(false);

    const handleFocus = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    // Filter out the current user from the search results
    const filteredResults = searchResults.filter(user => user.id !== currentUserId);

    return (
        <>
            <InputGroup className="mb-4 shadow-sm">
                <FormControl
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onClick={handleFocus} // Open modal on focus
                    className="search-input"
                />
                <Button variant="outline-secondary" onClick={handleFocus}>
                    <FaSearch />
                </Button>
            </InputGroup>

            {/* Modal for Autocomplete Search Results */}
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Find Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        autoFocus
                        className="mb-3"
                    />

                    {filteredResults && filteredResults.length > 0 ? (
                        <Container>
                            <Row>
                                {filteredResults.map((user) => (
                                    <Col xs={12} md={6} lg={4} className="mb-4" key={user.id}>
                                        <div className="user-card shadow-sm p-3">
                                            <div className="d-flex align-items-center">
                                                {/* Using FaUserCircle as default profile icon */}
                                                <FaUserCircle size={50} className="me-3 user-avatar" />

                                                <div className="user-info">
                                                    <h5>{user.username}</h5>
                                                    <p className="text-muted mb-1">{user.email}</p>
                                                </div>
                                            </div>

                                            <div className="mt-2 d-flex justify-content-between action-buttons">
                                                {/* Friend Request Button */}
                                                {user.isFriendRequestSent ? (
                                                    <Button variant="outline-secondary" disabled className="action-btn small-btn">
                                                        <FaUserCheck />
                                                        Sent
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="primary"
                                                        className="action-btn small-btn"
                                                        onClick={() => sendFriendRequest(user.email)}
                                                    >
                                                        <FaUserPlus />
                                                        Add
                                                    </Button>
                                                )}

                                                {/* Follow Button */}
                                                {user.isFollowing ? (
                                                    <Button variant="outline-success" disabled className="action-btn small-btn">
                                                        Following
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="success"
                                                        className="action-btn small-btn"
                                                        onClick={() => sendFollowRequest(user.email)}
                                                    >
                                                        <FiUser />
                                                        Follow
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    ) : (
                        <p className="text-muted mt-3">No results found.</p>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default FindUsers;