import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { Heart, Stethoscope } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace",
        });
        navigate('/');
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')`,
          filter: 'blur(3px)',
          transform: 'scale(1.1)',
        }}
      />
      <div className="absolute inset-0 bg-blue-900/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-blue-800/30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-4">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-2xl shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              MediCare Pro
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Connectez-vous à votre espace médical sécurisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                  onClick={() => navigate('/register')}
                >
                  Créer un compte
                </Button>
              </p>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <Stethoscope className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-800">Comptes de démonstration</p>
              </div>
              <div className="space-y-2 text-xs text-blue-700">
                <div className="flex justify-between">
                  <span className="font-medium">Admin:</span>
                  <span>admin@cabinet.com / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Médecin:</span>
                  <span>dr.martin@cabinet.com / medecin123</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Patient:</span>
                  <span>pierre.durand@email.com / patient123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
