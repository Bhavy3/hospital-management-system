import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect significantly based on role to avoid getting stuck
        if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (userRole === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
        if (userRole === 'patient') return <Navigate to="/patient-dashboard" replace />;
        if (userRole === 'receptionist') return <Navigate to="/reception-dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
