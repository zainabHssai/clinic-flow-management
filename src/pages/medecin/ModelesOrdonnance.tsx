
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { FileText, Plus, Save, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../hooks/use-toast';

const ModelesOrdonnance: React.FC = () => {
  const navigate = useNavigate();
  const [modeles, setModeles] = useState([
    {
      id: '1',
      nom: 'Hypertension artérielle',
      medicaments: 'Amlodipine 5mg\nLisinopril 10mg',
      posologie: '1 comprimé le matin\n1 comprimé le soir',
      remarques: 'Contrôle tension dans 15 jours'
    },
    {
      id: '2',
      nom: 'Infection respiratoire',
      medicaments: 'Amoxicilline 1g\nParacétamol 500mg',
      posologie: '3 fois par jour pendant 7 jours\n1 comprimé si fièvre',
      remarques: 'Repos recommandé'
    }
  ]);

  const [nouveauModele, setNouveauModele] = useState({
    nom: '',
    medicaments: '',
    posologie: '',
    remarques: ''
  });

  const [modeAjout, setModeAjout] = useState(false);
  const [modeModification, setModeModification] = useState(false);
  const [modeleEnCours, setModeleEnCours] = useState<string | null>(null);

  const handleAjouterModele = (e: React.FormEvent) => {
    e.preventDefault();
    const modele = {
      id: Date.now().toString(),
      ...nouveauModele
    };
    setModeles([...modeles, modele]);
    setNouveauModele({ nom: '', medicaments: '', posologie: '', remarques: '' });
    setModeAjout(false);
    toast({
      title: "Modèle ajouté",
      description: "Le modèle d'ordonnance a été créé avec succès",
    });
  };

  const handleModifierModele = (e: React.FormEvent) => {
    e.preventDefault();
    setModeles(modeles.map(m => 
      m.id === modeleEnCours 
        ? { ...m, ...nouveauModele }
        : m
    ));
    setNouveauModele({ nom: '', medicaments: '', posologie: '', remarques: '' });
    setModeModification(false);
    setModeleEnCours(null);
    toast({
      title: "Modèle modifié",
      description: "Le modèle d'ordonnance a été mis à jour avec succès",
    });
  };

  const commencerModification = (modele: any) => {
    setNouveauModele({
      nom: modele.nom,
      medicaments: modele.medicaments,
      posologie: modele.posologie,
      remarques: modele.remarques
    });
    setModeleEnCours(modele.id);
    setModeModification(true);
    setModeAjout(false);
  };

  const supprimerModele = (id: string) => {
    setModeles(modeles.filter(m => m.id !== id));
    toast({
      title: "Modèle supprimé",
      description: "Le modèle d'ordonnance a été supprimé",
    });
  };

  const annulerOperation = () => {
    setModeAjout(false);
    setModeModification(false);
    setModeleEnCours(null);
    setNouveauModele({ nom: '', medicaments: '', posologie: '', remarques: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/medecin/planning')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour au planning</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Modèles d'ordonnance</h1>
        </div>
        <Button 
          onClick={() => setModeAjout(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
          disabled={modeModification}
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau modèle</span>
        </Button>
      </div>

      {(modeAjout || modeModification) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {modeModification ? 'Modifier le modèle' : 'Créer un nouveau modèle'}
            </CardTitle>
            <CardDescription>
              {modeModification 
                ? 'Modifiez les informations du modèle d\'ordonnance'
                : 'Créez un modèle d\'ordonnance réutilisable pour vos consultations'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={modeModification ? handleModifierModele : handleAjouterModele} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du modèle</Label>
                <Input
                  id="nom"
                  placeholder="Ex: Hypertension, Grippe, Contrôle routine..."
                  value={nouveauModele.nom}
                  onChange={(e) => setNouveauModele({...nouveauModele, nom: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicaments">Médicaments</Label>
                <Textarea
                  id="medicaments"
                  placeholder="Listez les médicaments (un par ligne)"
                  value={nouveauModele.medicaments}
                  onChange={(e) => setNouveauModele({...nouveauModele, medicaments: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="posologie">Posologie</Label>
                <Textarea
                  id="posologie"
                  placeholder="Indications de prise (une par ligne)"
                  value={nouveauModele.posologie}
                  onChange={(e) => setNouveauModele({...nouveauModele, posologie: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarques">Remarques</Label>
                <Textarea
                  id="remarques"
                  placeholder="Instructions particulières, suivi recommandé..."
                  value={nouveauModele.remarques}
                  onChange={(e) => setNouveauModele({...nouveauModele, remarques: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{modeModification ? 'Sauvegarder' : 'Créer le modèle'}</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={annulerOperation}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {modeles.map((modele) => (
          <Card key={modele.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>{modele.nom}</span>
                  </CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => commencerModification(modele)}
                    disabled={modeAjout || modeModification}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => supprimerModele(modele.id)}
                    className="text-red-600 hover:bg-red-50"
                    disabled={modeAjout || modeModification}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="outline" className="mb-2">Médicaments</Badge>
                <p className="text-sm whitespace-pre-line bg-gray-50 p-3 rounded">
                  {modele.medicaments}
                </p>
              </div>
              <div>
                <Badge variant="outline" className="mb-2">Posologie</Badge>
                <p className="text-sm whitespace-pre-line bg-blue-50 p-3 rounded">
                  {modele.posologie}
                </p>
              </div>
              {modele.remarques && (
                <div>
                  <Badge variant="outline" className="mb-2">Remarques</Badge>
                  <p className="text-sm whitespace-pre-line bg-yellow-50 p-3 rounded">
                    {modele.remarques}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModelesOrdonnance;
