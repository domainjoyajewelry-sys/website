import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
  // Replace with actual authentication logic
  const isAuthenticated = true; // Placeholder for authenticated user
  const userIsAdmin = isAuthenticated && isAdmin; // Placeholder for admin check

  return isAuthenticated ? (
    userIsAdmin ? <Outlet /> : <Navigate to="/unauthorized" replace /> // Redirect non-admin to unauthorized
  ) : (
    <Navigate to="/login" replace /> // Redirect unauthenticated to login
  );
};

export default PrivateRoute;