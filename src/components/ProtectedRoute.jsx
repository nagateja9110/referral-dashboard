import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = Cookies.get('jwt_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
