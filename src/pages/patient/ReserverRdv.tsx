
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from '../../hooks/use-toast';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const ReserverRdv: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medecinId: '',
    date: '',
    heure: '',
    motif: ''
  });
  const [loading, setLoading] = useState(false);

  // Données mockées pour la démo
  const medecins = [
    { id: '1', nom: 'Dr. Sophie Martin', specialite: 'Cardiologie' },
    { id: '2', nom: 'Dr. Michel Leroy', specialite: 'Dermatologie' },
    { id: '3', nom: 'Dr. Anne Dubois', specialite: 'Pédiatrie' }
  ];

  const creneauxDisponibles = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation de réservation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Rendez-vous réservé avec succès",
        description: "Votre demande de rendez-vous a été envoyée au médecin",
      });
      
      navigate('/patient');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Date minimum = aujourd'hui
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/patient')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Réserver un Rendez-vous</h1>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Nouveau rendez-vous</span>
            </CardTitle>
            <CardDescription>
              Choisissez votre médecin et votre créneau préféré
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="medecin">Médecin</Label>
                <Select onValueChange={(value) => handleChange('medecinId', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un médecin" />
                  </SelectTrigger>
                  <SelectContent>
                    {medecins.map((medecin) => (
                      <SelectItem key={medecin.id} value={medecin.id}>
                        {medecin.nom} - {medecin.specialite}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date souhaitée</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure">Heure souhaitée</Label>
                  <Select onValueChange={(value) => handleChange('heure', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un créneau" />
                    </SelectTrigger>
                    <SelectContent>
                      {creneauxDisponibles.map((creneau) => (
                        <SelectItem key={creneau} value={creneau}>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{creneau}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motif">Motif de la consultation (optionnel)</Label>
                <Input
                  id="motif"
                  placeholder="Ex: Contrôle de routine, douleurs..."
                  value={formData.motif}
                  onChange={(e) => handleChange('motif', e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Information importante</h4>
                <p className="text-sm text-blue-800">
                  Votre demande de rendez-vous sera envoyée au médecin choisi. 
                  Vous recevrez une confirmation par email une fois le rendez-vous validé.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/patient')}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Réservation...' : 'Réserver le RDV'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReserverRdv;
