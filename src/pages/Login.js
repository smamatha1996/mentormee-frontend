import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card, FormControl, FormLabel } from 'react-bootstrap';
import Feedback from '../components/Feedback'; // Import the Feedback component

const Login = () => {
  const [input, setInput] = useState(''); // For both email and username
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginStatus = useSelector((state) => state.auth.loginStatus);
  const loginError = useSelector((state) => state.auth.error);

  const validateInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input) || input.trim().length > 0; // Allow both email and non-empty username
  };

  const handleLogin = async () => {
    setInputError('');
    setPasswordError('');
    setGeneralError('');

    let isValid = true;

    if (!validateInput(input)) {
      setInputError('Please enter a valid email address or username.');
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    if (!isValid) return;

    try {
      await dispatch(loginUser({ input, password }));
    } catch (err) {
      setGeneralError('Login failed: Invalid credentials.');
    }
  };

  useEffect(() => {
    if (loginStatus === 'succeeded') {
      navigate('/dashboard');
    } else if (loginStatus === 'failed') {
      setGeneralError(loginError || 'Failed to login. Please try again.');
    }
  }, [loginStatus, loginError, navigate]);

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>

              {/* Feedback for error message */}
              {generalError && (
                <Feedback
                  variant="danger"
                  message={generalError}
                  show={!!generalError}
                  autoHide={true}
                  duration={3000} // Auto-hide after 3 seconds
                  onClose={() => setGeneralError(null)} // Reset error after closing
                />
              )}

              <div className="mb-3">
                <FormLabel>Email Address or Username</FormLabel>
                <FormControl
                  type="text"
                  placeholder="Enter email or username"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  isInvalid={!!inputError}
                />
                {inputError && <FormControl.Feedback type="invalid">{inputError}</FormControl.Feedback>}
              </div>

              <div className="mb-4">
                <FormLabel>Password</FormLabel>
                <FormControl
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!passwordError}
                  autoComplete="off"
                />
                {passwordError && <FormControl.Feedback type="invalid">{passwordError}</FormControl.Feedback>}
              </div>

              <Button variant="primary" className="w-100" onClick={handleLogin}>
                Login
              </Button>

              <div className="text-center mt-3">
                <Link to="/auth/forgot-password">Forgot Password?</Link>
              </div>

              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/auth/signup">Sign Up</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;