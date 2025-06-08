
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, UserPlus, Activity, Calendar } from 'lucide-react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
  totalMedecins: 0,
  totalPatients: 0,
  consultationsAujourdhui: 0,
  rendezvousEnAttente: 0
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getTotalMedecins = async (): Promise<number> => {
    const response = await axios.get('http://127.0.0.1:5000/medecins/count');
    console.log('Total Médecins:', response.data);
    return response.data.total; // Exemple: { total: 5 }
    };

  const getTotalPatients = async (): Promise<number> => {
    const response = await axios.get('http://127.0.0.1:5000/patients/count');
    console.log('Total Patients:', response.data);
    return response.data.total;
  };
  const getConsultationsAujourdHui = async (): Promise<number> => {
    const response = await axios.get('http://127.0.0.1:5000/consultations/today/count');
    console.log('Consultations Aujourd\'hui:', response.data);
    return response.data.total;
  };

  const getRendezvousEnAttente = async (): Promise<number> => {
    const response = await axios.get('http://127.0.0.1:5000/rendezvous/pending/count');
    console.log('Rendez-vous en attente:', response.data);
    return response.data.total;
  };

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const [medecins, patients, consultations, rendezvous] = await Promise.all([
        getTotalMedecins(),
        getTotalPatients(),
        getConsultationsAujourdHui(),
        getRendezvousEnAttente(),
      ]);

      setStats({
        totalMedecins: medecins,
        totalPatients: patients,
        consultationsAujourdhui: consultations,
        rendezvousEnAttente: rendezvous
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false); // Indiquer que le chargement est terminé
    }
  };

  fetchStats();
}, []);



  return (
    loading ? (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl font-medium text-gray-600">Chargement des statistiques...</p>
    </div>
  ) : (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
      </div>

      {/* Statistiques étendues */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="h-40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Médecins</CardTitle>
            <Users className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalMedecins}</div>
            <p className="text-sm text-muted-foreground mt-2">Total des médecins</p>
          </CardContent>
        </Card>

        <Card className="h-40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Patients</CardTitle>
            <Users className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalPatients}</div>
            <p className="text-sm text-muted-foreground mt-2">Total des patients</p>
          </CardContent>
        </Card>

        <Card className="h-40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Consultations</CardTitle>
            <Activity className="h-6 w-6 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.consultationsAujourdhui}</div>
            <p className="text-sm text-muted-foreground mt-2">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card className="h-40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">RDV en attente</CardTitle>
            <Calendar className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.rendezvousEnAttente}</div>
            <p className="text-sm text-muted-foreground mt-2">À confirmer</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ))
};

export default AdminDashboard;
