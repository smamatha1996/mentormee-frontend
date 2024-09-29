import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    console.log("PrivateRoute - isAuthenticated:", isAuthenticated); // Debug log

    if (!isAuthenticated) {
        console.log("PrivateRoute - User not authenticated, redirecting to login");
        return <Navigate to="/auth/login" />;
    }
    console.log("PrivateRoute - User authenticated, rendering children");
    return children;
};

export default PrivateRoute;