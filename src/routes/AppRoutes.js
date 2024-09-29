import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';
import Header from '../components/Header';

const AppRoutes = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Feed />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default AppRoutes;