
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from '../../hooks/use-toast';
import { ArrowLeft, User, Calendar, Clock, FileText, Save } from 'lucide-react';

const ConsultationDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [diagnostic, setDiagnostic] = useState('');

  // Données mockées pour la démo
  const consultation = {
    id: id || '1',
    patient: {
      nom: 'Durand',
      prenom: 'Pierre',
      age: 35,
      contact: '0123456789',
      email: 'pierre.durand@email.com'
    },
    date: '2024-06-07',
    heure: '09:00',
    motif: 'Douleurs thoraciques',
    symptomes: 'Douleurs thoraciques depuis 2 jours, essoufflement lors d\'efforts',
    statut: 'programmee' as const,
    antecedents: 'Hypertension, diabète de type 2',
    allergies: 'Pénicilline'
  };

  const handleSaveNotes = () => {
    toast({
      title: "Notes sauvegardées",
      description: "Les notes de consultation ont été enregistrées",
    });
  };

  const handleValiderConsultation = () => {
    toast({
      title: "Consultation validée",
      description: "La consultation a été marquée comme terminée",
    });
    navigate('/medecin');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/medecin')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Détails de la Consultation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations patient */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Patient</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{consultation.patient.prenom} {consultation.patient.nom}</h3>
                <p className="text-gray-600">{consultation.patient.age} ans</p>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Téléphone:</span>
                  <p className="text-gray-600">{consultation.patient.contact}</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-gray-600">{consultation.patient.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Voir le dossier complet
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations médicales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Antécédents:</span>
                <p className="text-gray-600">{consultation.antecedents}</p>
              </div>
              <div>
                <span className="font-medium">Allergies:</span>
                <p className="text-gray-600">{consultation.allergies}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détails consultation */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Consultation du {consultation.date}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{consultation.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{consultation.heure}</span>
                    </div>
                  </CardDescription>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Motif de consultation</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{consultation.motif}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Symptômes décrits</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{consultation.symptomes}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnostic">Diagnostic</Label>
                <Textarea
                  id="diagnostic"
                  placeholder="Saisir le diagnostic..."
                  value={diagnostic}
                  onChange={(e) => setDiagnostic(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes de consultation</Label>
                <Textarea
                  id="notes"
                  placeholder="Ajouter des notes sur la consultation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleSaveNotes}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </Button>
                <Button 
                  onClick={() => navigate(`/medecin/ordonnance/${consultation.id}`)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
                >
                  <FileText className="h-4 w-4" />
                  <span>Créer ordonnance</span>
                </Button>
                <Button 
                  onClick={handleValiderConsultation}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <span>Valider consultation</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetails;
