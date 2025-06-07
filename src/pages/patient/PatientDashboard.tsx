
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, Plus, FileText, User } from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Données mockées pour la démo
  const prochainRdv = {
    id: '1',
    medecin: 'Dr. Sophie Martin',
    specialite: 'Cardiologie',
    date: '2024-06-10',
    heure: '14:30',
    statut: 'confirme'
  };

  const dernieresConsultations = [
    {
      id: '1',
      medecin: 'Dr. Sophie Martin',
      date: '2024-05-15',
      diagnostic: 'Contrôle de routine - RAS',
      ordonnance: true
    },
    {
      id: '2',
      medecin: 'Dr. Michel Leroy',
      date: '2024-04-20',
      diagnostic: 'Consultation dermatologique',
      ordonnance: false
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mon Espace Patient</h1>
        <Button 
          onClick={() => navigate('/patient/reserver')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau RDV
        </Button>
      </div>

      {/* Prochain rendez-vous */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Prochain rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          {prochainRdv ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{prochainRdv.medecin}</h3>
                  <p className="text-blue-700">{prochainRdv.specialite}</p>
                </div>
                <Badge className="bg-blue-600">Confirmé</Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{prochainRdv.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{prochainRdv.heure}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Modifier</Button>
                <Button size="sm" variant="destructive">Annuler</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="mx-auto h-8 w-8 text-blue-400 mb-2" />
              <p className="text-blue-700">Aucun rendez-vous programmé</p>
              <Button 
                className="mt-3" 
                size="sm"
                onClick={() => navigate('/patient/reserver')}
              >
                Réserver un RDV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => navigate('/patient/reserver')}>
          <CardContent className="p-6 text-center">
            <Calendar className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="font-semibold mb-2">Réserver un RDV</h3>
            <p className="text-sm text-gray-600">Prendre rendez-vous avec un médecin</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/patient/rendez-vous')}>
          <CardContent className="p-6 text-center">
            <Clock className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="font-semibold mb-2">Mes RDV</h3>
            <p className="text-sm text-gray-600">Consulter mes rendez-vous</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <h3 className="font-semibold mb-2">Mes Ordonnances</h3>
            <p className="text-sm text-gray-600">Accéder à mes prescriptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Dernières consultations */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières consultations</CardTitle>
          <CardDescription>Historique de vos consultations récentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dernieresConsultations.map((consultation) => (
              <div key={consultation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold">{consultation.medecin}</h3>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{consultation.date}</span>
                    </div>
                    <p className="text-gray-700">{consultation.diagnostic}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {consultation.ordonnance && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Ordonnance
                      </Badge>
                    )}
                    <Button size="sm" variant="outline">
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {dernieresConsultations.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune consultation</h3>
              <p className="text-gray-500">Vous n'avez pas encore de consultations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
