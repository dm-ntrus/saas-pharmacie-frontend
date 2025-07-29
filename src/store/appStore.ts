import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, Tenant, PharmacyConfig, Product, Patient, Notification } from '@/types';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Data State
  currentTenant: Tenant | null;
  pharmacyConfig: PharmacyConfig | null;
  notifications: Notification[];
  
  // Recent Data
  recentPatients: Patient[];
  recentProducts: Product[];
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  setPharmacyConfig: (config: PharmacyConfig | null) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  setRecentPatients: (patients: Patient[]) => void;
  setRecentProducts: (products: Product[]) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial State
      sidebarOpen: false,
      theme: 'light',
      currentTenant: null,
      pharmacyConfig: null,
      notifications: [],
      recentPatients: [],
      recentProducts: [],

      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setTheme: (theme) => {
        set({ theme });
        // Persist theme in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('pharmacy-theme', theme);
        }
      },
      
      setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
      
      setPharmacyConfig: (config) => set({ pharmacyConfig: config }),
      
      addNotification: (notification) => 
        set((state) => ({ 
          notifications: [notification, ...state.notifications].slice(0, 50) // Keep only 50 recent notifications
        })),
      
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      setRecentPatients: (patients) => set({ recentPatients: patients }),
      
      setRecentProducts: (products) => set({ recentProducts: products }),
    }),
    {
      name: 'pharmacy-app-store',
    }
  )
);

// Selectors for commonly used state
export const useNotificationCount = () => 
  useAppStore(state => state.notifications.filter(n => !n.read).length);

export const useSidebarState = () => 
  useAppStore(state => ({ 
    sidebarOpen: state.sidebarOpen, 
    setSidebarOpen: state.setSidebarOpen 
  }));

export const useThemeState = () => 
  useAppStore(state => ({ 
    theme: state.theme, 
    setTheme: state.setTheme 
  }));

// Initialize theme from localStorage
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('pharmacy-theme') as 'light' | 'dark';
  if (savedTheme) {
    useAppStore.getState().setTheme(savedTheme);
  }
}