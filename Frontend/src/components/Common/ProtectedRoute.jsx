import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { user } = useSelector((state) => state.auth);

    // If no user is logged in, navigate to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If a role is specified and the user does not have that role, navigate to login
    if (role && user.role !== role) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
