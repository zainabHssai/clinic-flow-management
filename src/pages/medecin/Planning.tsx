
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, User, FileText } from 'lucide-react';

const Planning: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Données mockées pour la démo
  const planningData = [
    {
      id: '1',
      patient: 'Pierre Durand',
      heure: '09:00',
      type: 'Consultation',
      statut: 'confirme',
      duree: '30 min'
    },
    {
      id: '2',
      patient: 'Marie Leblanc',
      heure: '10:30',
      type: 'Contrôle',
      statut: 'confirme',
      duree: '20 min'
    },
    {
      id: '3',
      patient: 'Jean Moreau',
      heure: '14:00',
      type: 'Consultation',
      statut: 'en_attente',
      duree: '30 min'
    },
    {
      id: '4',
      patient: 'Créneaux libres',
      heure: '15:30',
      type: 'Disponible',
      statut: 'libre',
      duree: '30 min'
    }
  ];

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'confirme':
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'libre':
        return <Badge variant="outline" className="border-blue-200 text-blue-600">Libre</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mon Planning</h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="mr-2 h-4 w-4" />
            Nouveau créneau
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Planning du jour */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Planning du {selectedDate}</CardTitle>
              <CardDescription>Vos rendez-vous et créneaux disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planningData.map((creneau) => (
                  <div key={creneau.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-lg">{creneau.heure}</span>
                          </div>
                          {getStatutBadge(creneau.statut)}
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">{creneau.patient}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>{creneau.type} • {creneau.duree}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {creneau.statut !== 'libre' && (
                          <>
                            <Button size="sm" variant="outline">
                              Modifier
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4 mr-1" />
                              Dossier
                            </Button>
                          </>
                        )}
                        {creneau.statut === 'libre' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Réserver
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résumé de la journée */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé du jour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-blue-800">Consultations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">2</div>
                <div className="text-sm text-green-800">Confirmées</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-yellow-800">En attente</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Bloquer un créneau
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Modifier horaires
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Modèles d'ordonnance
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Planning;
