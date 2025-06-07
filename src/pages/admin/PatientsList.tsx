
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { UserPlus, Mail, Phone, Users, Calendar } from 'lucide-react';

const PatientsList: React.FC = () => {
  const navigate = useNavigate();

  // Données mockées pour la démo
  const patients = [
    {
      id: '1',
      nom: 'Durand',
      prenom: 'Pierre',
      age: 35,
      contact: '0123456789',
      email: 'pierre.durand@email.com',
      derniereVisite: '2024-05-15'
    },
    {
      id: '2',
      nom: 'Leblanc',
      prenom: 'Marie',
      age: 42,
      contact: '0123456788',
      email: 'marie.leblanc@email.com',
      derniereVisite: '2024-06-01'
    },
    {
      id: '3',
      nom: 'Moreau',
      prenom: 'Jean',
      age: 28,
      contact: '0123456787',
      email: 'jean.moreau@email.com',
      derniereVisite: '2024-05-20'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Liste des Patients</h1>
        <Button 
          onClick={() => navigate('/admin/ajouter-patient')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un patient
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{patient.prenom} {patient.nom}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {patient.age} ans
                    </Badge>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Dernière visite</div>
                  <div className="text-sm font-medium text-gray-700">{patient.derniereVisite}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{patient.contact}</span>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Modifier
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  RDV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {patients.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun patient</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter votre premier patient</p>
            <Button onClick={() => navigate('/admin/ajouter-patient')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un patient
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientsList;
