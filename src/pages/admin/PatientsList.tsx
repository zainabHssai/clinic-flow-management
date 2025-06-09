
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { UserPlus, Mail, Phone, Users, Calendar } from 'lucide-react';

const PatientsList: React.FC = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://localhost:5000/admin/patients/last');
        const data = await res.json();
        setPatients(data);
        console.log('Patients fetched:', data);
      } catch (error) {
        console.error('Erreur fetch patients:', error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div>Chargement des patients...</div>;
  }

  const getAge = (dateNaissance: string) => {
    const birthDate = new Date(dateNaissance);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleDelete = async (id: string) => {
  if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) return;
    try {
    const response = await fetch(`http://localhost:5000/admin/patients/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    setPatients(prev => prev.filter(p => p._id !== id));
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Liste des Patients</h1>
        <Button
          onClick={() => navigate('/admin/ajouter-patient')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un patient
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun patient</h3>
              <p className="text-gray-500 mb-4">Commencez par ajouter votre premier patient</p>
              <Button onClick={() => navigate('/admin/ajouter-patient')}>
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un patient
              </Button>
            </CardContent>
          </Card>
        )}
        {patients.map((patient) => (
          <Card key={patient._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {patient.prenom} {patient.nom}
                  </CardTitle>
                  <div className="mt-1 inline-block">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {getAge(patient.dateNaissance)} ans
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Dernière visite</div>
                  <div className="text-sm font-medium text-gray-700">
                    {patient.derniereVisite || 'Aucun rendez-vous'}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{patient.telephone}</span>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Modifier
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleDelete(patient._id)}
                  >
                  Supprimer
                  </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientsList;