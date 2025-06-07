
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  ClipboardList, 
  FileText,
  Home
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const getMenuItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { icon: Home, label: 'Tableau de bord', path: '/admin' },
          { icon: Users, label: 'Médecins', path: '/admin/medecins' },
          { icon: Users, label: 'Patients', path: '/admin/patients' },
          { icon: UserPlus, label: 'Ajouter Médecin', path: '/admin/ajouter-medecin' },
          { icon: UserPlus, label: 'Ajouter Patient', path: '/admin/ajouter-patient' }
        ];
      case 'medecin':
        return [
          { icon: Home, label: 'Mes consultations', path: '/medecin' },
          { icon: Calendar, label: 'Planning', path: '/medecin/planning' },
          { icon: FileText, label: 'Ordonnances', path: '/medecin/ordonnances' }
        ];
      case 'patient':
        return [
          { icon: Home, label: 'Accueil', path: '/patient' },
          { icon: Calendar, label: 'Réserver RDV', path: '/patient/reserver' },
          { icon: ClipboardList, label: 'Mes RDV', path: '/patient/rendez-vous' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm border-r border-blue-100">
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start space-x-3 ${
                  isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
