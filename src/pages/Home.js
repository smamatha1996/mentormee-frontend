import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Button from '../components/Button';

const Home = () => {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1>Welcome to MentorMee!</h1>
          <p>Your platform for educational content and career counseling.</p>
          <p>Join our community to share knowledge and grow together.</p>
          <Link to="/signup">
            <Button variant="primary" className="me-2">
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">
              Login
            </Button>
          </Link>
          <Link to="/social-media" className="d-block mt-3">
            <Button variant="link">Go to Social Media</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;