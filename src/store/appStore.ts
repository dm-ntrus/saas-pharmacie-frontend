import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  notifications: AppNotification[];

  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  addNotification: (notification: AppNotification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      sidebarOpen: false,
      theme: "light",
      notifications: [],

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== "undefined") {
          localStorage.setItem("pharmacy-theme", theme);
        }
      },

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: "pharmacy-app-store" },
  ),
);

export const useNotificationCount = () =>
  useAppStore((state) => state.notifications.filter((n) => !n.read).length);

export const useThemeState = () =>
  useAppStore((state) => ({ theme: state.theme, setTheme: state.setTheme }));

if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("pharmacy-theme") as
    | "light"
    | "dark"
    | null;
  if (savedTheme) {
    useAppStore.getState().setTheme(savedTheme);
  }
}
