import React from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/store/authStore';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import PharmacistDashboard from '@/components/dashboards/PharmacistDashboard';
import CashierDashboard from '@/components/dashboards/CashierDashboard';
import TechnicianDashboard from '@/components/dashboards/TechnicianDashboard';
import Layout from '@/components/layout/Layout';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'PHARMACIST':
        return <PharmacistDashboard />;
      case 'CASHIER':
        return <CashierDashboard />;
      case 'TECHNICIAN':
        return <TechnicianDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout title="Tableau de Bord">
      {renderDashboard()}
    </Layout>
  );
};

export default DashboardPage;