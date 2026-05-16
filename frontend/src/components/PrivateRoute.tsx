import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
  const { user } = useAuth();

  const isAuthenticated = !!user;
  const userIsAdmin = user?.role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && !userIsAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;