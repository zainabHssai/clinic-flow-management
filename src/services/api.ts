// services/api.ts
import axios from 'axios';
import { Consultation, RendezVous } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchProchainRdv = async (patientId: string): Promise<RendezVous | null> => {
  try {
    const response = await axios.get<{ rdv: RendezVous | null }>(
      `${API_URL}/patient/${patientId}/prochain-rdv`
    );
    return response.data.rdv;
  } catch (error) {
    console.error('Erreur lors de la récupération du RDV:', error);
    return null;
  }
};

export const fetchDernieresConsultations = async (patientId: string): Promise<Consultation[]> => {
  try {
    const response = await axios.get<{ consultations: Consultation[] }>(
      `${API_URL}/patient/${patientId}/consultations?limit=3`
    );
    return response.data.consultations;
  } catch (error) {
    console.error('Erreur lors de la récupération des consultations:', error);
    return [];
  }
};

export const fetchMedecinDetails = async (medecinId: string): Promise<{
  nom: string;
  prenom: string;
  specialite: string;
}> => {
  const response = await axios.get(`${API_URL}/medecins/${medecinId}/details`);
  return response.data;
};

export const annulerRendezVous = async (rdvId: string): Promise<void> => {
  await axios.put(`${API_URL}/rendezvous/${rdvId}/annuler`);
};