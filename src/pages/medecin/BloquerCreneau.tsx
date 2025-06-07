
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Calendar, Clock, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../hooks/use-toast';

const BloquerCreneau: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    heureDebut: '',
    heureFin: '',
    motif: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Blocage de créneau:', formData);
    toast({
      title: "Créneau bloqué",
      description: "Le créneau a été bloqué avec succès",
    });
    navigate('/medecin/planning');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/medecin/planning')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au planning</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Bloquer un créneau</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Nouveau blocage</span>
          </CardTitle>
          <CardDescription>
            Bloquez un créneau dans votre planning pour une indisponibilité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heureDebut">Heure de début</Label>
                <Input
                  id="heureDebut"
                  type="time"
                  value={formData.heureDebut}
                  onChange={(e) => setFormData({...formData, heureDebut: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heureFin">Heure de fin</Label>
                <Input
                  id="heureFin"
                  type="time"
                  value={formData.heureFin}
                  onChange={(e) => setFormData({...formData, heureFin: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motif">Motif (optionnel)</Label>
              <Textarea
                id="motif"
                placeholder="Ex: Formation, congés, urgence personnelle..."
                value={formData.motif}
                onChange={(e) => setFormData({...formData, motif: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Bloquer le créneau</span>
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/medecin/planning')}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloquerCreneau;
