
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'medecin': return 'Médecin';
      case 'patient': return 'Patient';
      default: return '';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-blue-100 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-blue-900">Cabinet Médical</h1>
          {user && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.prenom} {user.nom}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {getRoleLabel(user.role)}
              </span>
            </div>
          )}
        </div>
        
        {user && (
          <Button 
            variant="outline" 
            onClick={logout}
            className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
