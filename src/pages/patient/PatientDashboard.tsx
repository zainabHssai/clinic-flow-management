
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, Plus, FileText, User } from 'lucide-react';
import { useEffect, useState } from 'react';




const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [prochainRdv, setProchainRdv] = useState<any | null>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prochainsRdv, setProchainsRdv] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  // Données mockées pour la démo
  // const prochainRdv = {
  //   id: '1',
  //   medecin: 'Dr. Sophie Martin',
  //   specialite: 'Cardiologie',
  //   date: '2024-06-10',
  //   heure: '14:30',
  //   statut: 'confirme'
  // };

  // const dernieresConsultations = [
  //   {
  //     id: '1',
  //     medecin: 'Dr. Sophie Martin',
  //     date: '2024-05-15',
  //     diagnostic: 'Contrôle de routine - RAS',
  //     ordonnance: true
  //   },
  //   {
  //     id: '2',
  //     medecin: 'Dr. Michel Leroy',
  //     date: '2024-04-20',
  //     diagnostic: 'Consultation dermatologique',
  //     ordonnance: false
  //   }
  // ];

  useEffect(() => {
  const patientId = user.id; // suppose que tu stockes l'id quelque part
  if (!patientId) return;

  // Fetch consultations
  fetch(`http://localhost:5000/patient/${patientId}/consultations`)
    .then(res => res.json())
    .then(data => {
      setConsultations(data);

      // Si tu veux que le prochain RDV soit le plus récent dans le futur
      const futurs = data.filter((c: any) => new Date(c.date) > new Date());
      if (futurs.length > 0) {
        // Tu peux trier pour prendre le plus proche si nécessaire
        setProchainRdv(futurs[0]);
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));

  
    fetch(`http://localhost:5000/patient/${patientId}/prochains-rdv`)
  .then(res => res.json())
  .then(async (data) => {
    const futurs = data.filter((rdv: any) => new Date(rdv.date) > new Date());
    futurs.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log(data);

    if (futurs.length > 0) {
      const prochain = futurs[0];

      // Récupérer les infos du médecin via son ID
      const medecinRes = await fetch(`http://localhost:5000/admin/medecins/${prochain.medecinId}`);
      const medecinData = await medecinRes.json();

      // Ajouter les infos nécessaires dans le rendez-vous
      prochain.medecin = `${medecinData.nom}`;
      prochain.specialite = medecinData.specialite;

      // Formater date/heure
      const dateObj = new Date(prochain.date);
      prochain.date = dateObj.toLocaleDateString();
      prochain.heure = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setProchainRdv(prochain);
      console.log("Prochain RDV:", prochain);
    }
  })
  .catch(console.error);

}, []);

const get_state = (rdv: any) => {
  if (rdv.etat === "validé") {
    return "Validé";
  } else if (rdv.etat === "annulé") {
    return "Annulé";
  } else if (rdv.etat === "en attente") {
    return "En attente";
  } else if (rdv.etat === "terminé") {
    return "Terminé";
  } else {
    return "Inconnu";
  }
}

const getStateColor = (rdv: any) => {
  if (rdv.etat === "validé") {
    return "bg-green-600";
  } else if (rdv.etat === "annulé") {
    return "bg-red-100 text-red-800";
  } else if (rdv.etat === "en attente") {
    return "bg-blue-600";
  } else if (rdv.etat === "terminé") {
    return "bg-gray-200 text-gray-800";
  } else {
    return "bg-gray-100 text-gray-800";
  }
}

const annulerRdv = async () => {
  if (!prochainRdv || !prochainRdv._id) return;

  try {
    const response = await fetch(`http://127.0.0.1:5000/patient/rdv/${prochainRdv._id}/annuler`, {
      method: "PUT",
    });

    console.log(response)


    if (!response.ok) {
      throw new Error("Échec de l'annulation");
    }

    // Réinitialiser le prochain rendez-vous après annulation
    setProchainRdv(null);
    console.log("Rendez-vous annulé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'annulation du rendez-vous :", error);
    // Optionnel : afficher une alerte utilisateur
  }
};



  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mon Espace Patient</h1>
        <Button 
          onClick={() => navigate('/patient/reserver')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau RDV
        </Button>
      </div>

      {/* Prochain rendez-vous */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Prochain rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          {prochainRdv ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{prochainRdv.medecin}</h3>
                  <p className="text-blue-700">{prochainRdv.specialite}</p>
                </div>
                <Badge className={getStateColor(prochainRdv)}>{get_state(prochainRdv)}</Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{prochainRdv.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{prochainRdv.heure}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Modifier</Button>
                <Button size="sm" variant="destructive" onClick={annulerRdv}>Annuler</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="mx-auto h-8 w-8 text-blue-400 mb-2" />
              <p className="text-blue-700">Aucun rendez-vous programmé</p>
              <Button 
                className="mt-3" 
                size="sm"
                onClick={() => navigate('/patient/reserver')}
              >
                Réserver un RDV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => navigate('/patient/reserver')}>
          <CardContent className="p-6 text-center">
            <Calendar className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="font-semibold mb-2">Réserver un RDV</h3>
            <p className="text-sm text-gray-600">Prendre rendez-vous avec un médecin</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/patient/rendez-vous')}>
          <CardContent className="p-6 text-center">
            <Clock className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="font-semibold mb-2">Mes RDV</h3>
            <p className="text-sm text-gray-600">Consulter mes rendez-vous</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <h3 className="font-semibold mb-2">Mes Ordonnances</h3>
            <p className="text-sm text-gray-600">Accéder à mes prescriptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Dernières consultations */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières consultations</CardTitle>
          <CardDescription>Historique de vos consultations récentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div key={consultation._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold">{consultation.medecin || "Médecin inconnu"}</h3>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{consultation.date || "Date inconnue"}</span>
                    </div>
                    <p className="text-gray-700">{consultation.diagnostic || "Aucun diagnostic"}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {consultation.ordonnance && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Ordonnance
                      </Badge>
                    )}
                    <Button size="sm" variant="outline">
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {consultations.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune consultation</h3>
              <p className="text-gray-500">Vous n'avez pas encore de consultations</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
