
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from '../../hooks/use-toast';
import { ArrowLeft, User, Calendar, Clock, FileText, Save } from 'lucide-react';
import axios from 'axios';

const ConsultationDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id de la consultation ou du patient à récupérer

  const [consultation, setConsultation] = useState(null);
  const [patient, setPatient] = useState(null);
  const [diagnostic, setDiagnostic] = useState('');
  const [notes, setNotes] = useState('');

  

  // Fonction pour récupérer les données patient
  const fetchPatient = async (patientId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/patients/${patientId}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération du patient');
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Exemple de récupération de la consultation (à adapter selon ton API)
  const fetchConsultation = async (consultationId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/rdv/${consultationId}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de la consultation');
      const data = await response.json();
      console.log('Consultation data:', data);
      setConsultation(data);
      // On récupère les données patient une fois la consultation chargée
      fetchPatient(data.patient_id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConsultation(id);
    }
  }, [id]);

  if (!consultation || !patient) {
    return <div>Chargement...</div>;
  }

  // Sauvegarder diagnostic + notes
  const handleSave = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/rdv/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diagnostic, notes }),
    });
    if (!response.ok) throw new Error("Erreur lors de la sauvegarde");
    toast({
        title: "Consultation sauvegardée",
        description: "L'état de la consultation a été mis à jour.",
        variant: "default"
      });
  } catch (error) {
    toast({
        title: "Erreur de sauvegarde",
        description: error.message || "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
  }
};

  // Valider consultation = changer état en "terminé"
  const handleValiderConsultation = async () => {
    if (!consultation || !consultation._id) {
      console.error("Consultation non trouvée ou ID manquant");
      console.log("Consultation:", consultation);
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/terminer/rdv/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etat: "terminé" }),
      });
      if (!response.ok) throw new Error("Erreur lors de la validation");
      console.log("Consultation validée !");
      toast({
        title: "Consultation validée",
        description: "L'état de la consultation a été mis à jour.",
        variant: "default"
      });
      handleSave(); // Sauvegarder les notes et le diagnostic avant de valider
      fetchConsultation(id); // Rafraîchir les données de la consultation

      // Optionnel : redirection ou rafraîchissement
    } catch (error) {
      console.error("Erreur: " + error.message);
    }
  };

  const getState = (etat) => {
    switch (etat) {
      case 'terminé':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/medecin')}
          className="flex items-center space-x-2 border border-gray-300 rounded px-3 py-1"
        >
          ← <span>Retour</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Détails de la Consultation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations patient */}
        <div className="lg:col-span-1 space-y-4">
          <div className="border rounded shadow p-4">
            <h2 className="flex items-center space-x-2 text-blue-600 text-lg font-semibold">
              <span>👤 Patient</span>
            </h2>
            <div>
              <h3 className="font-semibold text-lg">{patient.prenom} {patient.nom}</h3>
              <p className="text-gray-600">
                {patient.dateNaissance
                  ? Math.floor(
                      (Date.now() - new Date(patient.dateNaissance).getTime()) /
                      (1000 * 60 * 60 * 24 * 365)
                    ) + ' ans'
                  : 'Âge non renseigné'}
              </p>
            </div>
            <div className="space-y-2 text-sm mt-4">
              <div>
                <span className="font-medium">Téléphone:</span>
                <p className="text-gray-600">{patient.telephone}</p>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <p className="text-gray-600">{patient.email}</p>
              </div>
              <div>
                <span className="font-medium">Adresse:</span>
                <p className="text-gray-600">{patient.adress}</p>
              </div>
              <div>
                <span className="font-medium">Sexe:</span>
                <p className="text-gray-600">{patient.sexe === 'H' ? 'Homme' : 'Femme'}</p>
              </div>
            </div>
            <button className="mt-4 w-full border border-gray-300 rounded py-1">Voir le dossier complet</button>
          </div>

          {/* Ici tu peux ajouter la carte infos médicales, à condition de l'avoir dans consultation */}
          <div className="border rounded shadow p-4 mt-6 text-sm">
            <h3 className="font-semibold mb-2">Informations médicales</h3>
            <div>
              <span className="font-medium">Antécédents:</span>
              <p className="text-gray-600">{consultation.antecedents || 'Aucun renseigné'}</p>
            </div>
            <div>
              <span className="font-medium">Allergies:</span>
              <p className="text-gray-600">{consultation.allergies || 'Aucune renseignée'}</p>
            </div>
          </div>
        </div>

        {/* Détails consultation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border rounded shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">Consultation du {consultation.date}</h3>
                <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    📅 <span>{consultation.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    ⏰ <span>{consultation.heure}</span>
                  </div>
                </div>
              </div>
              {/* <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">En cours</span> */}
              {getState(consultation.etat)}
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Motif de consultation</h4>
              <p className="bg-gray-50 p-3 rounded">{consultation.motif || "Aucun motif"}</p>
            </div>

            <div className="mt-4">
              <label htmlFor="diagnostic" className="font-medium block mb-1">Diagnostic</label>
              <textarea
                id="diagnostic"
                placeholder="Saisir le diagnostic..."
                value={consultation.diagnostic || diagnostic}
                onChange={(e) => setDiagnostic(e.target.value)}
                rows={3}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="notes" className="font-medium block mb-1">Notes de consultation</label>
              <textarea
                id="notes"
                placeholder="Ajouter des notes sur la consultation..."
                value={consultation.notes || notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              {/* Bouton Sauvegarder */}
              <button 
                onClick={() => handleSave()}
                className={`flex items-center space-x-2 border border-gray-300 rounded px-3 py-1
                  ${consultation.etat === 'terminé' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                `}
                disabled={consultation.etat === 'terminé'}
              >
                💾 <span>Sauvegarder</span>
              </button>

              {/* Bouton Créer ordonnance */}
              <button 
                onClick={() => navigate(`/medecin/ordonnance/${consultation.id}`)}
                className="flex items-center space-x-2 bg-purple-600 text-white rounded px-3 py-1 hover:bg-purple-700"
              >
                📄 <span>Créer ordonnance</span>
              </button>

              {/* Bouton conditionnel : Valider ou Retour */}
              {consultation.etat === 'terminé' ? (
                <button
                  onClick={() => navigate('/medecin')}
                  className="flex items-center space-x-2 bg-gray-500 text-white rounded px-3 py-1 hover:bg-gray-600"
                >
                  🔙 <span>Retour</span>
                </button>
              ) : (
                <button 
                  onClick={handleValiderConsultation}
                  className="flex items-center space-x-2 bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700"
                >
                  ✅ <span>Valider consultation</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetails;
