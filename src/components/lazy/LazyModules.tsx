import dynamic from 'next/dynamic';
import { Loader } from '@/design-system';

// Lazy loading des dashboards
export const LazyAdminDashboard = dynamic(
  () => import('@/components/dashboards/AdminDashboard'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyPharmacistDashboard = dynamic(
  () => import('@/components/dashboards/PharmacistDashboard'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyCashierDashboard = dynamic(
  () => import('@/components/dashboards/CashierDashboard'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyTechnicianDashboard = dynamic(
  () => import('@/components/dashboards/TechnicianDashboard'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

// Lazy loading des modules lourds
export const LazyAnalyticsModule = dynamic(
  () => import('@/pages/modules/analytics'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyReportsModule = dynamic(
  () => import('@/pages/modules/reports'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyAccountingModule = dynamic(
  () => import('@/pages/modules/accounting'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyInventoryModule = dynamic(
  () => import('@/pages/modules/inventory'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazySalesModule = dynamic(
  () => import('@/pages/modules/sales'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyPrescriptionsModule = dynamic(
  () => import('@/pages/modules/prescriptions'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyCustomersModule = dynamic(
  () => import('@/pages/modules/customers'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazySuppliersModule = dynamic(
  () => import('@/pages/modules/suppliers'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyLaboratoryModule = dynamic(
  () => import('@/pages/modules/laboratory'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyQualityModule = dynamic(
  () => import('@/pages/modules/quality'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyHrModule = dynamic(
  () => import('@/pages/modules/hr'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyCommunicationModule = dynamic(
  () => import('@/pages/modules/communication'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazyNotificationsModule = dynamic(
  () => import('@/pages/modules/notifications'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
);

export const LazySettingsModule = dynamic(
  () => import('@/pages/modules/settings'),
  {
    loading: () => <Loader size="lg" />,
    ssr: false,
  }
); 