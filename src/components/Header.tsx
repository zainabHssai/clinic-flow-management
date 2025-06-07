
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut, User, Heart } from 'lucide-react';

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
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                MediCare Pro
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Gestion Cabinet Médical</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
              <div className="bg-blue-50 p-2 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <span className="font-medium text-gray-900">{user.prenom} {user.nom}</span>
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  {getRoleLabel(user.role)}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {user && (
          <Button 
            variant="outline" 
            onClick={logout}
            className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
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
