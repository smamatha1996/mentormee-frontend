import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import AppRoutes from './routes/AppRoutes';
import { setToken, clearToken, fetchUser } from './store/userSlice'; // Import fetchUser
import { fetchPosts } from './store/postSlice'; // Action to fetch posts

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('mentorMeeToken');
    if (token) {
      const email = token.split('-')[0]; // Extract email from token (email-UUID format)
      dispatch(setToken(token)); // Set token in Redux
      dispatch(fetchUser(email)); // Fetch user profile using extracted email
    } else {
      dispatch(clearToken()); // Clear token if not found
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      dispatch(fetchPosts()); // Fetch posts after authentication
    }
  }, [loading, isAuthenticated, dispatch]);

  useEffect(() => {
    if (!loading) {
      // if (!isAuthenticated) {
      //   navigate('/auth/login'); // Redirect to login if not authenticated
      // }
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Add a spinner here if necessary
  }

  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/*" element={isAuthenticated ? <AppRoutes /> : <Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default App;