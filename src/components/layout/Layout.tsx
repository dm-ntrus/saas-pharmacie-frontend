"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/appStore";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Loader } from "@/design-system";
import { useRouter } from "@/i18n/navigation";
import { SkipLinks } from "@/components/accessibility/SkipLink";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "PharmacySaaS",
  requireAuth = true,
  allowedRoles,
  showSidebar = true,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, loading, hasAnyRole } = useAuth();
  const {sidebarOpen, setSidebarOpen} = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialiser la navigation clavier
  useKeyboardNavigation();

  // Initialiser les WebSockets pour les notifications temps réel
  // const { connectionStatus } = useRealtimeNotifications();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Vérification de l'authentification et des permissions
  useEffect(() => {
    if (!mounted || loading) return;

    if (requireAuth && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (allowedRoles && user && !hasAnyRole(allowedRoles)) {
      router.push("/unauthorized");
      return;
    }
  }, [
    mounted,
    loading,
    isAuthenticated,
    user,
    requireAuth,
    allowedRoles,
    router,
    hasAnyRole,
  ]);

  // Affichage du loader pendant le chargement initial
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader size="lg" />
          {/* <p className="mt-4 text-gray-600">Chargement...</p> */}
        </div>
      </div>
    );
  }

  // Redirection si l'authentification est requise mais l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    return null; // Le useEffect va rediriger
  }

  // Vérification des rôles
  if (allowedRoles && user && !hasAnyRole(allowedRoles)) {
    return null; // Le useEffect va rediriger
  }

  const isPublicPage = !requireAuth;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Skip links pour la navigation clavier */}
        {/* <SkipLinks /> */}
        {isPublicPage ? (
          // Layout pour les pages publiques
          <div>
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        ) : (
          // Layout pour les pages privées avec sidebar
          <div className="flex h-screen">
            {/* Sidebar for Desktop - Fixed width transition */}
            <aside
              className={`hidden lg:block bg-gray-900 transition-all duration-300 ease-in-out ${
                sidebarOpen ? "w-64" : "w-[4.5rem]"
              }`}
            >
              <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
            </aside>

            {/* Mobile Sidebar - Overlay */}
            {isMobile && sidebarOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
                  onClick={closeSidebar}
                />

                {/* Sidebar */}
                <aside className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden">
                  <Sidebar isOpen={true} onClose={closeSidebar} />
                </aside>
              </>
            )}

            {/* Contenu principal */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <TopBar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />

              <main className="flex-1 overflow-y-auto">
                <div className="py-6">
                  <div className="mx-auto px-4 sm:px-6">{children}</div>
                </div>
              </main>
            </div>
          </div>
        )}

        {/* Indicateur de statut WebSocket (en développement) */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              WS: Connecté
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;
