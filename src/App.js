import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import AppRoutes from './routes/AppRoutes';
import { setToken, clearToken } from './store/authSlice'; 
import { fetchUser } from './store/userSlice'; 
import { fetchPosts } from './store/postSlice'; 

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('mentorMeeToken');
    if (token) {
      const email = token.split('-')[0]; 
      dispatch(setToken(token)); 

      if (!userInfo) {
        dispatch(fetchUser(email)); 
      }
    } else {
      dispatch(clearToken()); 
    }
    setLoading(false);
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      dispatch(fetchPosts()); 
    }
  }, [loading, isAuthenticated, dispatch]);

  // useEffect(() => {
  //   if (!loading && !isAuthenticated) {
  //     navigate('/auth/login'); // Redirect to login if not authenticated
  //   }
  // }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/*" element={isAuthenticated ? <AppRoutes /> : <Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default App;