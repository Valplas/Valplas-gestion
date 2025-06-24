import { Navigate } from 'react-router-dom';
import { useAuth } from '../../feature/Auth/AuthContext';
import Loader from '../Loader/Loader';

interface PrivateRouteProps {
  children: JSX.Element[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />; // o tu <Loader />
  }
  if (!isAuthenticated && !isLoading) {
    console.log('asdf')
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;

