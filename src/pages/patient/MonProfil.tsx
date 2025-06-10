import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { toast } from '../../hooks/use-toast';
import { User, Mail, Phone, Calendar, Camera, Save } from 'lucide-react';

const MonProfil: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    age: '',
    adress: '',
    dateNaissance: '',
    numeroSecu: ''
  });

  // MODIF : état pour gérer les erreurs
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const user = JSON.parse(localStorage.getItem("currentUser")); 

  useEffect(() => {
    const fetchPatientData = async () => {
      const patientId = user.id;
      if (!patientId) {
        console.error("Aucun ID d'utilisateur trouvé");
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du profil.",
          variant: "destructive"
        });
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/admin/patients/${patientId}`);
        const data = await res.json();

        const age = data.dateNaissance
          ? `${Math.floor((new Date().getTime() - new Date(data.dateNaissance).getTime()) / (1000 * 3600 * 24 * 365))}`
          : '';

        setFormData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          telephone: data.telephone || '',
          age,
          adress: data.adress || '',
          dateNaissance: data.dateNaissance?.split("T")[0] || '',
          numeroSecu: data.numeroSecu || '',
        });
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du profil.",
          variant: "destructive"
        });
      }
    };

    fetchPatientData();
  }, [user.id]);

  // MODIF : Validation simple du téléphone (exemple)
  const validateField = (field: string, value: string) => {
    let errorMsg = '';

    if (field === 'telephone') {
      // Validation téléphone : doit être une suite de 10 chiffres par ex.
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        errorMsg = 'Le numéro de téléphone doit contenir 10 chiffres.';
      }
    }

    if (field === 'email') {
      // Validation email simple
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = "L'email n'est pas valide.";
      }
    }

    setErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  // MODIF : vérifie si tout est valide (pas d'erreurs, champs requis remplis)
  const isFormValid = () => {
    // Par exemple, téléphone et email doivent être valides, et nom/prenom non vides
    return (
      formData.nom.trim() !== '' &&
      formData.prenom.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.telephone.trim() !== '' &&
      !errors.email &&
      !errors.telephone
    );
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      toast({
        title: "Formulaire invalide",
        description: "Veuillez corriger les erreurs avant de sauvegarder.",
        variant: "destructive"
      });
      return;
    }
    const patientId = user.id;
    if (!patientId) {
      console.error("Aucun ID d'utilisateur trouvé");
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations du profil.",
        variant: "destructive"
      });
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/admin/patients/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });
      setIsEditing(false);
    } catch {
      toast({
        title: "Erreur",
        description: "La mise à jour du profil a échoué.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = () => {
    toast({
      title: "Upload de photo",
      description: "Fonctionnalité d'upload en cours de développement",
    });
  };

  // MODIF : on valide le champ à chaque changement
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
          disabled={isEditing && !isFormValid()} // MODIF : désactivation si invalide
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </>
          ) : (
            <>
              <User className="mr-2 h-4 w-4" />
              Modifier
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo de profil */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Avatar className="w-32 h-32 mx-auto">
                <AvatarImage src="" alt="Photo de profil" />
                <AvatarFallback className="text-2xl">
                  {formData.prenom.charAt(0)}{formData.nom.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImageUpload}
                className="flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Changer la photo</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Informations rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">{formData.prenom} {formData.nom}</div>
                  <div className="text-sm text-gray-600">{formData.age} ans</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div className="text-sm text-gray-600 break-all">{formData.email}</div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div className="text-sm text-gray-600">{formData.telephone}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations détaillées */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                {isEditing ? "Modifiez vos informations personnelles" : "Vos informations personnelles"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    disabled={!isEditing}
                    className={errors.prenom ? "border-red-500" : ""}
                  />
                  {errors.prenom && <p className="text-red-600 text-sm mt-1">{errors.prenom}</p>} {/* MODIF */}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    disabled={!isEditing}
                    className={errors.nom ? "border-red-500" : ""}
                  />
                  {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom}</p>} {/* MODIF */}
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
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    disabled={!isEditing}
                    className={errors.telephone ? "border-red-500" : ""}
                  />
                  {errors.telephone && <p className="text-red-600 text-sm mt-1">{errors.telephone}</p>} {/* MODIF */}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!isEditing}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>} {/* MODIF */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adress">Adresse</Label>
                <Input
                  id="adress"
                  value={formData.adress}
                  onChange={(e) => handleChange('adress', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!isFormValid()}
                  >
                    Sauvegarder
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MonProfil;
