
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { UserRole } from '../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '' as UserRole,
    age: '',
    contact: '',
    specialite: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData: any = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'patient') {
        userData.age = parseInt(formData.age);
        userData.contact = formData.contact;
      } else if (formData.role === 'medecin') {
        userData.specialite = formData.specialite;
      }

      const success = await register(userData);
      if (success) {
        toast({
          title: "Compte créé avec succès",
          description: "Bienvenue dans votre espace",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du compte",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">
            Créer un compte
          </CardTitle>
          <CardDescription>
            Rejoignez notre cabinet médical
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Type de compte</Label>
              <Select onValueChange={(value) => handleChange('role', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="medecin">Médecin</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'patient' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Âge</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Téléphone</Label>
                  <Input
                    id="contact"
                    placeholder="0123456789"
                    value={formData.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {formData.role === 'medecin' && (
              <div className="space-y-2">
                <Label htmlFor="specialite">Spécialité</Label>
                <Input
                  id="specialite"
                  placeholder="Ex: Cardiologie, Dermatologie..."
                  value={formData.specialite}
                  onChange={(e) => handleChange('specialite', e.target.value)}
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer le compte'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-600"
                onClick={() => navigate('/login')}
              >
                Se connecter
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
