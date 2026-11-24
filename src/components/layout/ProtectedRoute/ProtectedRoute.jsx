import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Sends signed-out visitors to the login screen and remembers where they were going.
export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}
