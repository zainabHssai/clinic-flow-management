import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Planning: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [planningData, setPlanningData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRendezVous = async (date, setPlanningData, setLoading, setError) => {
  setLoading(true);
  setError(null);
  try {
    // 1. Récupérer les RDV avec patient_id
    const resRdv = await axios.get(`http://localhost:5000/medecin/rendezvous`, { params: { date } });
    const rendezvousList = resRdv.data;

    // 2. Extraire les patient_id uniques
    const patientIds = [...new Set(rendezvousList.map(rdv => rdv.patient_id))];

    // 3. Récupérer les infos patients
    const params = new URLSearchParams();
    patientIds.forEach((id: string) => params.append("id", id));
    const resPatients = await axios.get(`http://localhost:5000/patients`, { params });
    const patientsList = resPatients.data;

    // 4. Créer un mapping patient_id => patient_info
    const patientsMap = {};
    patientsList.forEach(p => {
      patientsMap[p._id] = p;
    });

    // 5. Fusionner les infos dans les rendez-vous
    const enrichedRendezvous = rendezvousList.map(rdv => ({
      ...rdv,
      patient: patientsMap[rdv.patient_id] || null,
    }));

    setPlanningData(enrichedRendezvous);
    console.log("Rendez-vous enrichis :", enrichedRendezvous);
  } catch (error) {
    setError("Erreur lors de la récupération des rendez-vous.");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchRendezVous(selectedDate, setPlanningData, setLoading, setError);
  }, [selectedDate]);

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "validé":
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case "en attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "annulé":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mon Planning</h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Planning du {selectedDate}</CardTitle>
              <CardDescription>Vos rendez-vous et créneaux disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Chargement des rendez-vous...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : planningData.length === 0 ? (
                <p className="text-center text-gray-500">Aucun rendez-vous pour cette date.</p>
              ) : (
                <div className="space-y-4">
                  {planningData.map((creneau) => (
                    <div
                      key={creneau._id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        {/* Partie infos, prend tout l’espace sauf ce que prennent les boutons */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold text-lg">{creneau.heure}</span>
                            </div>
                            {getStatutBadge(creneau.etat)}
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">
                              {creneau.patient ? `${creneau.patient.nom} ${creneau.patient.prenom}` : "Patient inconnu"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span>
                              {creneau.motif ? `Motif: ${creneau.motif}` : "Aucun motif spécifié"}
                            </span>
                          </div>
                        </div>

                        {/* Partie boutons à droite */}
                        <div className="flex space-x-2 ml-4">
                          {creneau.statut !== 'libre' && (
                            <>
                              {/* <Button size="sm" variant="outline">
                                Modifier
                              </Button> */}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => navigate(`/medecin/consultation/${creneau._id}`)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Dossier
                              </Button>
                            </>
                          )}
                          {creneau.statut === 'libre' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Réserver
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Résumé de la journée */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé du jour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {planningData.filter((c) => c.type === "Consultation").length}
                </div>
                <div className="text-sm text-blue-800">Consultations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {planningData.filter((c) => c.statut === "confirme").length}
                </div>
                <div className="text-sm text-green-800">Confirmées</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {planningData.filter((c) => c.statut === "en_attente").length}
                </div>
                <div className="text-sm text-yellow-800">En attente</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Planning;