
export type UserRole = 'admin' | 'medecin' | 'patient';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  age?: number;
  contact?: string;
  specialite?: string;
}

export interface Medecin extends User {
  role: 'medecin';
  specialite: string;
}

export interface Patient extends User {
  role: 'patient';
  age: number;
  contact: string;
}

export interface Admin extends User {
  role: 'admin';
}

export interface Consultation {
  id: string;
  medecinId: string;
  patientId: string;
  date: string;
  heure: string;
  statut: 'programmee' | 'validee' | 'annulee';
  symptomes?: string;
  ordonnance?: Ordonnance;
}

export interface Ordonnance {
  id: string;
  consultationId: string;
  medicaments: string;
  posologie: string;
  remarques: string;
  dateCreation: string;
}

export interface RendezVous {
  id: string;
  patientId: string;
  medecinId: string;
  date: string;
  heure: string;
  statut: 'demande' | 'confirme' | 'annule';
}
