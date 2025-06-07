
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Clock, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../hooks/use-toast';

const ModifierHoraires: React.FC = () => {
  const navigate = useNavigate();
  const [horaires, setHoraires] = useState({
    lundi: { actif: true, debut: '08:00', fin: '17:00' },
    mardi: { actif: true, debut: '08:00', fin: '17:00' },
    mercredi: { actif: true, debut: '08:00', fin: '12:00' },
    jeudi: { actif: true, debut: '08:00', fin: '17:00' },
    vendredi: { actif: true, debut: '08:00', fin: '17:00' },
    samedi: { actif: false, debut: '09:00', fin: '12:00' },
    dimanche: { actif: false, debut: '09:00', fin: '12:00' }
  });

  const jours = [
    { key: 'lundi', label: 'Lundi' },
    { key: 'mardi', label: 'Mardi' },
    { key: 'mercredi', label: 'Mercredi' },
    { key: 'jeudi', label: 'Jeudi' },
    { key: 'vendredi', label: 'Vendredi' },
    { key: 'samedi', label: 'Samedi' },
    { key: 'dimanche', label: 'Dimanche' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Modification des horaires:', horaires);
    toast({
      title: "Horaires modifiés",
      description: "Vos horaires de consultation ont été mis à jour",
    });
    navigate('/medecin/planning');
  };

  const updateHoraire = (jour: string, field: string, value: string | boolean) => {
    setHoraires(prev => ({
      ...prev,
      [jour]: {
        ...prev[jour as keyof typeof prev],
        [field]: value
      }
    }));
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
        <h1 className="text-3xl font-bold text-gray-900">Modifier mes horaires</h1>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Horaires de consultation</span>
          </CardTitle>
          <CardDescription>
            Définissez vos horaires de consultation pour chaque jour de la semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {jours.map((jour) => (
              <div key={jour.key} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-24">
                  <Label className="font-medium">{jour.label}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={horaires[jour.key as keyof typeof horaires].actif}
                    onCheckedChange={(checked) => updateHoraire(jour.key, 'actif', checked)}
                  />
                  <span className="text-sm text-gray-600">Actif</span>
                </div>

                {horaires[jour.key as keyof typeof horaires].actif && (
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Début</Label>
                      <Input
                        type="time"
                        value={horaires[jour.key as keyof typeof horaires].debut}
                        onChange={(e) => updateHoraire(jour.key, 'debut', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Fin</Label>
                      <Input
                        type="time"
                        value={horaires[jour.key as keyof typeof horaires].fin}
                        onChange={(e) => updateHoraire(jour.key, 'fin', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Enregistrer les horaires</span>
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

export default ModifierHoraires;
