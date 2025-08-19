import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import PharmacistDashboard from '@/components/dashboards/PharmacistDashboard';
import CashierDashboard from '@/components/dashboards/CashierDashboard';
import TechnicianDashboard from '@/components/dashboards/TechnicianDashboard';
import { useAuthStore } from '@/lib/store/authStore';
import { Card, Button } from '@/design-system';
import { 
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';

const TenantDashboard: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <Layout title="Chargement...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" role="status" aria-label="Chargement en cours">
            <span className="sr-only">Chargement...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Accès non autorisé">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <Card className="p-8 text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h2>
              <p className="text-gray-600 mb-6">
                Vous devez être connecté pour accéder au tableau de bord.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => router.push('/login')}
                  aria-label="Se connecter à la plateforme"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Se connecter
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleGoHome}
                  aria-label="Retourner à l'accueil"
                >
                  <HomeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Accueil
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'pharmacien':
        return <PharmacistDashboard />;
      case 'caissier':
        return <CashierDashboard />;
      case 'technicien':
        return <TechnicianDashboard />;
      default:
        return (
          <Card className="p-8 text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500 mb-4" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rôle non reconnu</h2>
            <p className="text-gray-600 mb-6">
              Votre rôle utilisateur n'est pas configuré correctement. 
              Contactez votre administrateur système.
            </p>
            <Button variant="outline" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </Card>
        );
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      {renderDashboard()}
    </>
  );
};

export default TenantDashboard;