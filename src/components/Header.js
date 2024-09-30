import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { FaRss, FaUser } from 'react-icons/fa'; 
import './Header.scss';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation(); 

   
    const userInfo = useSelector((state) => state.user.userInfo);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth/login', { replace: true });
    };

    return (
        <Navbar expand="lg" className="header-navbar shadow-sm">
            <Container>
                <Navbar.Brand href="/" className="brand-name">
                    MentorMee
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            href="/"
                            className={`nav-link-custom ${location.pathname === '/' || location.pathname.startsWith('/feed') ? 'active' : ''}`}>
                            <FaRss className="me-1" /> Feed
                        </Nav.Link>
                        <Nav.Link
                            href="/profile"
                            className={`nav-link-custom ${location.pathname === '/profile' ? 'active' : ''}`}>
                            <FaUser className="me-1" /> Profile
                        </Nav.Link>
                    </Nav>
                    <Nav className="d-flex align-items-center">
                        {userInfo && (
                            <span className="user-name me-3">
                                {userInfo.firstName} {userInfo.lastName}
                            </span>
                        )}
                        <Button
                            variant="outline-light"
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;