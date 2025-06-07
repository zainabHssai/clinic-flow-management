
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { UserPlus, Mail, Phone } from 'lucide-react';

const MedecinsList: React.FC = () => {
  const navigate = useNavigate();

  // Données mockées pour la démo
  const medecins = [
    {
      id: '1',
      nom: 'Martin',
      prenom: 'Dr. Sophie',
      specialite: 'Cardiologie',
      email: 'dr.martin@cabinet.com',
      phone: '0123456789',
      consultations: 15
    },
    {
      id: '2',
      nom: 'Leroy',
      prenom: 'Dr. Michel',
      specialite: 'Dermatologie',
      email: 'dr.leroy@cabinet.com',
      phone: '0123456790',
      consultations: 8
    },
    {
      id: '3',
      nom: 'Dubois',
      prenom: 'Dr. Anne',
      specialite: 'Pédiatrie',
      email: 'dr.dubois@cabinet.com',
      phone: '0123456791',
      consultations: 22
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Liste des Médecins</h1>
        <Button 
          onClick={() => navigate('/admin/ajouter-medecin')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un médecin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medecins.map((medecin) => (
          <Card key={medecin.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{medecin.prenom} {medecin.nom}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {medecin.specialite}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{medecin.consultations}</div>
                  <div className="text-xs text-gray-500">consultations</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{medecin.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{medecin.phone}</span>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Modifier
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Planning
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {medecins.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun médecin</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter votre premier médecin</p>
            <Button onClick={() => navigate('/admin/ajouter-medecin')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un médecin
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedecinsList;
