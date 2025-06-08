
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from '../../hooks/use-toast';
import { ArrowLeft, UserPlus } from 'lucide-react';

const AjouterPatient: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  nom: '',
  prenom: '',
  dateNaissance: '',
  sexe: '',
  adresse: '',
  telephone: '',
  email: '',
  password: ''
});

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch('http://127.0.0.1:5000/admin/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Échec de la requête');
    }

    toast({
      title: "Patient ajouté avec succès",
      description: `${formData.prenom} ${formData.nom} a été ajouté à la liste des patients`,
    });

    navigate('/admin/patients');
  } catch (error) {
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'ajout du patient",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
  <div className="p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/patients')}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour</span>
      </Button>
      <h1 className="text-3xl font-bold text-gray-900">Ajouter un Patient</h1>
    </div>

    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <span>Nouveau patient</span>
          </CardTitle>
          <CardDescription>
            Ajoutez les informations du nouveau patient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  placeholder="Entrez le prénom"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  placeholder="Entrez le nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => handleChange('dateNaissance', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexe">Sexe</Label>
                <select
                  id="sexe"
                  value={formData.sexe}
                  onChange={(e) => handleChange('sexe', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionner le sexe</option>
                  <option value="H">Homme</option>
                  <option value="F">Femme</option>

                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                placeholder="Entrez l'adresse du patient"
                value={formData.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="06XXXXXXXX"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@mail.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Définir un mot de passe pour ce patient"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>

            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/patients')}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Ajout...' : 'Ajouter le patient'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
);
}

export default AjouterPatient;
