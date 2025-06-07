
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, UserPlus, Activity, Calendar } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Données mockées pour la démo
  const stats = {
    totalMedecins: 5,
    totalPatients: 23,
    consultationsAujourdhui: 8,
    rendezvousEnAttente: 3
  };

  const recentActivity = [
    { type: 'Nouveau patient', description: 'Marie Dubois inscrite', time: 'Il y a 2h' },
    { type: 'Consultation', description: 'Dr. Martin - Pierre Durand', time: 'Il y a 3h' },
    { type: 'Nouveau médecin', description: 'Dr. Leroy ajouté', time: 'Il y a 1j' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médecins</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMedecins}</div>
            <p className="text-xs text-muted-foreground">Total des médecins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Total des patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultationsAujourdhui}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RDV en attente</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rendezvousEnAttente}</div>
            <p className="text-xs text-muted-foreground">À confirmer</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Gérer votre cabinet médical</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/medecins')}
            >
              <Users className="mr-2 h-4 w-4" />
              Gérer les médecins
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/patients')}
            >
              <Users className="mr-2 h-4 w-4" />
              Gérer les patients
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/ajouter-medecin')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un médecin
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/ajouter-patient')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un patient
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions dans le cabinet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
