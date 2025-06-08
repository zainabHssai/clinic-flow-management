
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, User, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const MesRendezVous: React.FC = () => {
  // const [rendezVous, setRendezVous] = useState([
  //   {
  //     id: '1',
  //     medecin: 'Dr. Sophie Martin',
  //     specialite: 'Cardiologie',
  //     date: '2024-06-10',
  //     heure: '14:30',
  //     statut: 'confirme',
  //     motif: 'Contrôle de routine'
  //   },
  //   {
  //     id: '2',
  //     medecin: 'Dr. Michel Leroy',
  //     specialite: 'Dermatologie',
  //     date: '2024-06-15',
  //     heure: '10:00',
  //     statut: 'en_attente',
  //     motif: 'Consultation dermatologique'
  //   },
  //   {
  //     id: '3',
  //     medecin: 'Dr. Sophie Martin',
  //     specialite: 'Cardiologie',
  //     date: '2024-05-20',
  //     heure: '09:30',
  //     statut: 'termine',
  //     motif: 'Douleurs thoraciques',
  //     ordonnance: true
  //   }
  // ]);
  const [rendezVous, setRendezVous] = useState([]);
  const [rendezVousAvenir, setRendezVousAvenir] = useState([]);
  const [rendezVousTermines, setRendezVousTermines] = useState([]);
  const [rendezVousAnnules, setRendezVousAnnules] = useState([]);
  const [prochainRdv, setProchainRdv] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');


  useEffect(() => {
  const patientId = user.id;
  if (!patientId) return;

  const fetchRendezVous = async () => {
  try {
    const res = await fetch(`http://localhost:5000/patient/${patientId}/rdvs`);
    let data = await res.json();

    // Conversion _id en id
    data = data.map((rdv: any) => ({
      ...rdv,
      id: rdv._id, // Pour éviter les erreurs avec key dans le rendu
    }));

    // Tri par date croissante
    data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const maintenant = new Date();

    const rdvsAvenir: any[] = [];
    const rdvsTermines: any[] = [];
    const rdvsAnnules: any[] = [];

    for (const rdv of data) {
      const dateObj = new Date(rdv.date);

      // Formatage de la date/heure pour affichage
      rdv.date = dateObj.toLocaleDateString();
      rdv.heure = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Enrichissement avec infos médecin
      try {
        const medecinRes = await fetch(`http://localhost:5000/admin/medecins/${rdv.medecinId}`);
        const medecinData = await medecinRes.json();
        rdv.medecin = `${medecinData.nom}`;
        rdv.specialite = medecinData.specialite;
      } catch (err) {
        console.warn(`Erreur lors de la récupération du médecin ${rdv.medecinId}`, err);
        rdv.medecin = "Inconnu";
        rdv.specialite = "";
      }

      // Classement selon statut
      if (rdv.statut === "annule") {
        rdvsAnnules.push(rdv);
      } else if (dateObj > maintenant) {
        rdvsAvenir.push(rdv);
      } else {
        rdvsTermines.push(rdv);
      }
    }

    // Affectation des listes filtrées
    setRendezVous(data);         // Tous
    setRendezVousAvenir(rdvsAvenir);
    setRendezVousTermines(rdvsTermines);
    setRendezVousAnnules(rdvsAnnules);

    // Prochain RDV (le plus proche dans le futur)
    if (rdvsAvenir.length > 0) {
      setProchainRdv(rdvsAvenir[0]);
    }

  } catch (err) {
    console.error("Erreur fetch rdvs:", err);
  } finally {
    setLoading(false);
  }
};


  fetchRendezVous();
}, []);

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'confirme':
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'termine':
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>;
      case 'annule':
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const handleModifier = (rdvId: string) => {
    toast({
      title: "Modification de rendez-vous",
      description: "Fonctionnalité de modification en cours de développement",
    });
  };

  const handleAnnuler = async (rdvId: string) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/patient/rdv/${rdvId}/annuler`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Échec de l'annulation du rendez-vous");
    }

    // Mettre à jour l'état local
    const updatedRdv = rendezVous.map(rdv =>
      rdv.id === rdvId ? { ...rdv, statut: 'annule' } : rdv
    );
    setRendezVous(updatedRdv);

    toast({
      title: "Rendez-vous annulé",
      description: "Votre rendez-vous a été annulé avec succès",
    });

  } catch (error) {
    console.error("Erreur lors de l'annulation :", error);
    toast({
      title: "Erreur",
      description: "Impossible d'annuler le rendez-vous",
      variant: "destructive",
    });
  }
};


  const handleVoirOrdonnance = (rdvId: string) => {
    toast({
      title: "Ordonnance",
      description: "Affichage de l'ordonnance en cours de développement",
    });
  };

  const rdvAVenir = rendezVous.filter(rdv => rdv.statut === 'confirme' || rdv.statut === 'en_attente');
  const rdvPasses = rendezVous.filter(rdv => rdv.statut === 'termine' || rdv.statut === 'annule');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Mes Rendez-vous</h1>

      {/* Rendez-vous à venir */}
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous à venir</CardTitle>
          <CardDescription>Vos prochains rendez-vous médicaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rdvAVenir.map((rdv) => (
              <div key={rdv.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{rdv.medecin}</h3>
                      {getStatutBadge(rdv.statut)}
                    </div>
                    <p className="text-blue-700 mb-2">{rdv.specialite}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{rdv.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{rdv.heure}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      <strong>Motif:</strong> {rdv.motif}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleModifier(rdv.id)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Modifier</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleAnnuler(rdv.id)}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Annuler</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {rdvAVenir.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous à venir</h3>
                <p className="text-gray-500">Vous n'avez pas de rendez-vous programmé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>Vos rendez-vous passés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rdvPasses.map((rdv) => (
              <div key={rdv.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{rdv.medecin}</h3>
                      {getStatutBadge(rdv.statut)}
                    </div>
                    <p className="text-blue-700 mb-2">{rdv.specialite}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{rdv.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{rdv.heure}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      <strong>Motif:</strong> {rdv.motif}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      Détails
                    </Button>
                    {rdv.ordonnance && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVoirOrdonnance(rdv.id)}
                        className="flex items-center space-x-1"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Ordonnance</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MesRendezVous;
