
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from '../../hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const AjouterMedecin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    specialite: "",
    email: "",
    telephone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    telephone: null as string | null,
    password: null as string | null,
  });
  
  const isPhoneValid = /^(0[5-7])[0-9]{8}$/.test(formData.telephone);
  const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/admin/medecins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout du médecin");
      }

      toast({
        title: "Médecin ajouté avec succès",
        description: `Dr. ${formData.prenom} ${formData.nom} a été ajouté au cabinet`,
      });

      navigate("/admin/medecins");
    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message || "Une erreur est survenue lors de l'ajout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
  if (field === 'telephone') {
    if (!/^(0[5-7])[0-9]{8}$/.test(value)) {
      setFormErrors(prev => ({ ...prev, telephone: 'Le numéro doit contenir 10 chiffres et commencer par 05, 06 ou 07.' }));
    } else {
      setFormErrors(prev => ({ ...prev, telephone: null }));
    }
  }

  if (field === 'password') {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) {
      setFormErrors(prev => ({ ...prev, password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.' }));
    } else {
      setFormErrors(prev => ({ ...prev, password: null }));
    }
  }

  setFormData(prev => ({ ...prev, [field]: value }));
};

const isValidForm = () => {
  return (
    formData.nom &&
    formData.prenom &&
    formData.specialite &&
    formData.email &&
    isPhoneValid &&
    isPasswordValid &&
    !formErrors.telephone &&
    !formErrors.password
  );
};


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/medecins")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Ajouter un Médecin</h1>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Informations du médecin</CardTitle>
            <CardDescription>Saisissez les informations du nouveau médecin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    placeholder="Ex: Sophie"
                    value={formData.prenom}
                    onChange={(e) => handleChange("prenom", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    placeholder="Ex: Martin"
                    value={formData.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialite">Spécialité</Label>
                <Input
                  id="specialite"
                  placeholder="Ex: Cardiologie, Dermatologie, Pédiatrie..."
                  value={formData.specialite}
                  onChange={(e) => handleChange("specialite", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="dr.martin@cabinet.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  placeholder="0123456789"
                  value={formData.telephone}
                  onChange={(e) => handleChange("telephone", e.target.value)}
                  required
                className={!isPhoneValid && formData.telephone ? 'border-red-500 outline-red-500' : ''}
                />
                {formData.telephone && !isPhoneValid && (
                      <p className="text-sm text-red-500">{formErrors.telephone}</p>
                    )}
              </div>

              {/* Champ Password ajouté */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  className={!isPasswordValid && formData.password ? 'border-red-500 outline-red-500' : ''}
                />
                {formData.password && !isPasswordValid && (
                      <p className="text-red-500 text-sm mt-1">
                        Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
                      </p>
                    )}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/medecins")}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Ajout en cours..." : "Ajouter le médecin"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AjouterMedecin;
