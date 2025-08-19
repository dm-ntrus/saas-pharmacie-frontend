"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Loader } from "@/design-system";
import { useRouter } from "next/navigation";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      router.push("/login");
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

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Plateforme SaaS de gestion des pharmacies"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0066cc" />
        <meta name="color-scheme" content="light dark" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Skip links pour la navigation clavier */}
        <SkipLinks />
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
            {showSidebar && (
              <>
                {/* Sidebar pour desktop */}
                <div
                  className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${
                    sidebarOpen ? "lg:w-64" : "lg:w-16"
                  }`}
                >
                  <Sidebar />
                </div>

                {/* Overlay pour mobile */}
                {sidebarOpen && (
                  <div
                    className="fixed inset-0 flex z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="fixed inset-0 bg-gray-600/75" />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                      <Sidebar />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Contenu principal */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <TopBar />

              <main className="flex-1 overflow-y-auto">
                <div className="py-6">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                  </div>
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
