import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Feed from '../pages/Feed'; // Feed component
import Profile from '../pages/Profile'; // Profile component
import Header from '../components/Header';

const AppRoutes = () => {
    return (
        <>
            <Header />
            <Routes>
                {/* Render Feed on the root path */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Feed />  {/* Feed component for the root path */}
                        </PrivateRoute>
                    }
                />

                {/* Render Profile */}
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />  {/* Profile component */}
                        </PrivateRoute>
                    }
                />

                {/* Redirect any other route back to Feed */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default AppRoutes;