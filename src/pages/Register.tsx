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
import { Heart, UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '' as UserRole,
    dateNaissance: '',
    sexe: '',
    telephone: '',
    adress: '',
    specialite: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
  telephone: null as string | null,
  password: null as string | null,
});


  const isPhoneValid = /^(0[5-7])[0-9]{8}$/.test(formData.telephone);
  const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password);


  const isValidForm = () => {
  const baseValid =
    formData.nom &&
    formData.prenom &&
    formData.email &&
    formData.password &&
    isPhoneValid &&
    isPasswordValid && // 🔴 Ajout de la validation du mot de passe
    formData.role;

  if (formData.role === 'patient') {
    return baseValid &&
      formData.dateNaissance &&
      formData.sexe &&
      formData.adress;
  }

  if (formData.role === 'medecin') {
    return baseValid && formData.specialite;
  }

  return baseValid;
};






  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
    const userData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      telephone: formData.telephone,
      ...(formData.role === 'patient' && {
          dateNaissance: formData.dateNaissance,
          adress: formData.adress,
          sexe: formData.sexe
      }),
      ...(formData.role === 'medecin' && {
          specialite: formData.specialite
      })
    };

    const response = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    });

    if (!response.ok) throw new Error('Erreur lors de la création du compte');

    const responseData = await response.json();
    console.log(responseData);

    // Stockage des données
    localStorage.setItem('authToken', responseData.token || '');
    
    const userToStore = {
        id: responseData.id,
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        role: userData.role,
    };

    console.log(userToStore);
    
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    
    // Mise à jour de l'état via AuthProvider
    await register(userData);

      toast({
          title: "Compte créé avec succès",
          description: "Bienvenue dans votre espace",
      });
      navigate(`/${userData.role}`);
      console.log(localStorage.getItem("currentUser"));

      } catch (error) {
        toast({
            title: "Erreur",
            description: error.message || "Une erreur est survenue",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };


  const handleChange = (field: string, value: string) => {
  if (field === 'telephone') {
    if (!/^(0[5-7])[0-9]{8}$/.test(value)) {
      setFormErrors((prev) => ({ ...prev, telephone: 'Le numéro doit contenir 10 chiffres et commencer par 05, 06 ou 07.' }));
    } else {
      setFormErrors((prev) => ({ ...prev, telephone: null }));
    }
  }

  setFormData((prev) => ({ ...prev, [field]: value }));
};


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
     
      <div className="absolute inset-0 bg-green-900/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-transparent to-blue-800/30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-4">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-2xl shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              Rejoindre MediCare Pro
            </CardTitle>
            <CardDescription className="text-gray-600">
              Créez votre compte médical sécurisé
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
                  className={!isPasswordValid && formData.password ? 'border-red-500' : ''}
                  />

                    {formData.password && !isPasswordValid && (
                      <p className="text-red-500 text-sm mt-1">
                        Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
                      </p>
                    )}
              </div>

              <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      placeholder="06XXXXXXXX"
                      value={formData.telephone}
                      onChange={(e) => handleChange('telephone', e.target.value)}
                      required
                      className={!isPhoneValid ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formData.telephone && !isPhoneValid && (
                      <p className="text-sm text-red-500">{formErrors.telephone}</p>
                    )}

              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Type de compte</Label>
                <Select onValueChange={(value) => handleChange('role', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    {/* <SelectItem value="medecin">Médecin</SelectItem> */}
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'patient' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Date de Naissance</Label>
                    <Input
                      id="dateNaissance"
                      type="date"
                      placeholder="Date"
                      value={formData.dateNaissance}
                      onChange={(e) => handleChange('dateNaissance', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sexe">Sexe</Label>
                    <Select onValueChange={(value) => handleChange('sexe', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Homme ou Femme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="H">Homme</SelectItem>
                    <SelectItem value="M">Femme</SelectItem>
                  </SelectContent>
                </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                <Label htmlFor="adress">Adresse</Label>
                <Input
                  id="adress"
                  placeholder="Rue Ibn Sina..."
                  value={formData.adress}
                  onChange={(e) => handleChange('adress', e.target.value)}
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
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                disabled={loading || !isValidForm()}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {loading ? 'Création...' : 'Créer le compte'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                  onClick={() => navigate('/login')}
                >
                  Se connecter
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
