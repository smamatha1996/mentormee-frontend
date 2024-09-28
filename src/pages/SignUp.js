import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error state for inline error messages
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupStatus = useSelector((state) => state.user.signupStatus);
  const signupError = useSelector((state) => state.user.error);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Reset field errors
    setFieldErrors({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    let hasError = false;

    if (firstName.trim() === '') {
      setFieldErrors((prev) => ({ ...prev, firstName: 'First name is required.' }));
      hasError = true;
    }

    if (lastName.trim() === '') {
      setFieldErrors((prev) => ({ ...prev, lastName: 'Last name is required.' }));
      hasError = true;
    }

    if (username.trim() === '') {
      setFieldErrors((prev) => ({ ...prev, username: 'Username is required.' }));
      hasError = true;
    }

    if (email.trim() === '') {
      setFieldErrors((prev) => ({ ...prev, email: 'Email is required.' }));
      hasError = true;
    }

    if (password.length < 6) {
      setFieldErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters.' }));
      hasError = true;
    }

    if (password !== confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
      hasError = true;
    }

    if (hasError) return;

    try {
      await dispatch(
        signupUser({
          firstName,
          lastName,
          username,
          email,
          password,
        })
      );
    } catch (err) {
      setFieldErrors((prev) => ({ ...prev, form: signupError || 'Signup failed. Please try again.' }));
    }
  };

  // Navigate to login after signup is successful
  useEffect(() => {
    if (signupStatus === 'succeeded') {
      navigate('/login');
    } else if (signupStatus === 'failed') {
      setFieldErrors((prev) => ({ ...prev, form: signupError || 'Signup failed. Please try again.' }));
    }
  }, [signupStatus, signupError, navigate]);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div className="shadow p-4 rounded bg-white">
            <h2 className="text-center mb-4">Sign Up</h2>

            {/* Show form-level error if any */}
            {fieldErrors.form && <Alert variant="danger">{fieldErrors.form}</Alert>}

            <Form onSubmit={handleSignup}>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      isInvalid={!!fieldErrors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">{fieldErrors.firstName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      isInvalid={!!fieldErrors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">{fieldErrors.lastName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!fieldErrors.username}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.username}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!fieldErrors.email}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!fieldErrors.password}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!fieldErrors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100" disabled={signupStatus === 'loading'}>
                {signupStatus === 'loading' ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Signing Up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <Button variant="link" onClick={() => navigate('/login')}>
                Already have an account? Log in
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;