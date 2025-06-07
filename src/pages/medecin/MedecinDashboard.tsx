
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

const MedecinDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Données mockées pour la démo
  const consultations = [
    {
      id: '1',
      patient: 'Pierre Durand',
      date: '2024-06-07',
      heure: '09:00',
      statut: 'programmee' as const,
      symptomes: 'Douleurs thoraciques'
    },
    {
      id: '2',
      patient: 'Marie Dubois',
      date: '2024-06-07',
      heure: '10:30',
      statut: 'programmee' as const,
      symptomes: 'Contrôle de routine'
    },
    {
      id: '3',
      patient: 'Jean Martin',
      date: '2024-06-07',
      heure: '14:00',
      statut: 'validee' as const,
      symptomes: 'Essoufflement'
    }
  ];

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'programmee':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Programmée</Badge>;
      case 'validee':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Validée</Badge>;
      case 'annulee':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const validerConsultation = (consultationId: string) => {
    console.log('Validation consultation:', consultationId);
    // Logique de validation
  };

  const annulerConsultation = (consultationId: string) => {
    console.log('Annulation consultation:', consultationId);
    // Logique d'annulation
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mes Consultations</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/medecin/planning')}>
            <Calendar className="mr-2 h-4 w-4" />
            Planning
          </Button>
          <Button variant="outline" onClick={() => navigate('/medecin/ordonnances')}>
            <FileText className="mr-2 h-4 w-4" />
            Ordonnances
          </Button>
        </div>
      </div>

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations du jour</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.length}</div>
            <p className="text-xs text-muted-foreground">Total planifiées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consultations.filter(c => c.statut === 'programmee').length}
            </div>
            <p className="text-xs text-muted-foreground">À valider</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consultations.filter(c => c.statut === 'validee').length}
            </div>
            <p className="text-xs text-muted-foreground">Terminées</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des consultations */}
      <Card>
        <CardHeader>
          <CardTitle>Consultations d'aujourd'hui</CardTitle>
          <CardDescription>Gérez vos rendez-vous médicaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{consultation.patient}</h3>
                      {getStatutBadge(consultation.statut)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{consultation.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{consultation.heure}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      <strong>Motif:</strong> {consultation.symptomes}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/medecin/consultation/${consultation.id}`)}
                    >
                      Détails
                    </Button>
                    
                    {consultation.statut === 'programmee' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => validerConsultation(consultation.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Valider
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => annulerConsultation(consultation.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      </>
                    )}
                    
                    {consultation.statut === 'validee' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/medecin/ordonnance/${consultation.id}`)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Ordonnance
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {consultations.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune consultation</h3>
              <p className="text-gray-500">Aucune consultation programmée pour aujourd'hui</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedecinDashboard;
