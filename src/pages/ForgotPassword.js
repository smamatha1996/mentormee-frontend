import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleForgotPassword = (e) => {
        e.preventDefault();

        setIsLoading(true);
        setTimeout(() => {
            if (email === "example@domain.com") {
                setSuccessMessage('A password reset link has been sent to your email.');
                setErrorMessage('');
            } else {
                setErrorMessage('No account found with this email.');
                setSuccessMessage('');
            }

            setEmail('');
            setIsLoading(false);
        }, 2000);
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <div className="shadow p-4 rounded bg-white">
                        <h2 className="text-center mb-4">Forgot Password</h2>
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <Form onSubmit={handleForgotPassword}>
                            <Form.Group controlId="formBasicEmail" className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        <span className="ms-2">Sending...</span>
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </Form>
                        <div className="text-center mt-3">
                            <Button variant="link" onClick={() => navigate('/login')}>
                                Back to Login
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;