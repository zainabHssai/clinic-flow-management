import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Pages d'authentification
import Login from "./pages/Login";
import Register from "./pages/Register";

// Pages Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import MedecinsList from "./pages/admin/MedecinsList";
import PatientsList from "./pages/admin/PatientsList";
import AjouterMedecin from "./pages/admin/AjouterMedecin";
import AjouterPatient from "./pages/admin/AjouterPatient";

// Pages Médecin
import MedecinDashboard from "./pages/medecin/MedecinDashboard";
import Planning from "./pages/medecin/Planning";
import ConsultationDetails from "./pages/medecin/ConsultationDetails";

// Pages Patient
import PatientDashboard from "./pages/patient/PatientDashboard";
import ReserverRdv from "./pages/patient/ReserverRdv";
import MesRendezVous from "./pages/patient/MesRendezVous";
import MonProfil from "./pages/patient/MonProfil";

// Page NotFound
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Composant pour rediriger selon le rôle
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'medecin':
      return <Navigate to="/medecin" replace />;
    case 'patient':
      return <Navigate to="/patient" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Layout principal avec sidebar
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              {/* Route par défaut - redirige selon le rôle */}
              <Route path="/" element={<RoleBasedRedirect />} />
              
              {/* Pages d'authentification */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes Admin */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/medecins" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MedecinsList />
                </ProtectedRoute>
              } />
              <Route path="/admin/patients" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PatientsList />
                </ProtectedRoute>
              } />
              <Route path="/admin/ajouter-medecin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AjouterMedecin />
                </ProtectedRoute>
              } />
              <Route path="/admin/ajouter-patient" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AjouterPatient />
                </ProtectedRoute>
              } />
              
              {/* Routes Médecin */}
              <Route path="/medecin" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedecinDashboard />
                </ProtectedRoute>
              } />
              <Route path="/medecin/planning" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <Planning />
                </ProtectedRoute>
              } />
              <Route path="/medecin/ordonnances" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Mes Ordonnances</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/medecin/consultation/:id" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <ConsultationDetails />
                </ProtectedRoute>
              } />
              <Route path="/medecin/ordonnance/:id" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Créer une Ordonnance</h1>
                    <p className="text-gray-600 mt-2">Fonctionnalité en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Routes Patient */}
              <Route path="/patient" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/patient/reserver" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <ReserverRdv />
                </ProtectedRoute>
              } />
              <Route path="/patient/rendez-vous" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <MesRendezVous />
                </ProtectedRoute>
              } />
              <Route path="/patient/profil" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <MonProfil />
                </ProtectedRoute>
              } />
              
              {/* Page d'erreur non autorisé */}
              <Route path="/unauthorized" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Accès non autorisé</h1>
                    <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page</p>
                  </div>
                </div>
              } />
              
              {/* Route catch-all pour 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
