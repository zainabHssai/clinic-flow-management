
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Rediriger selon le rôle
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'medecin':
          navigate('/medecin');
          break;
        case 'patient':
          navigate('/patient');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
};

export default Index;
