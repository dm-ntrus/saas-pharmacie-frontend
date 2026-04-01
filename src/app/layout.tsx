import type { Metadata } from "next";
import { Inter, Space_Grotesk } from 'next/font/google';
import "./globals.css";
import { AccessibilityProvider } from "@/design-system/AccessibilityProvider";
import QueryProvider from "@/providers/queryProvider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SoftwareApplicationJsonLd from "@/components/seo/SoftwareApplicationJsonLd";

function metadataBaseUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: {
    default: "SyntixPharma | Gestion intelligente de pharmacie",
    template: "%s | SyntixPharma",
  },
  description:
    "SaaS multi-tenant pour officines : point de vente, inventaire, patients, prescriptions, supply chain, facturation, conformité, analytics et fidélité.",
  keywords: [
    "SyntixPharma",
    "pharmacie",
    "POS",
    "inventaire",
    "ordonnance",
    "SaaS",
    "multi-tenant",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "SyntixPharma",
    title: "SyntixPharma | Gestion intelligente de pharmacie",
    description:
      "Plateforme cloud pour piloter votre officine : ventes, stocks, patients, achats et pilotage.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SyntixPharma | Gestion intelligente de pharmacie",
    description:
      "POS, inventaire, patients, supply chain et conformité — une seule plateforme.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <SoftwareApplicationJsonLd />
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#4ade80",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
              <AccessibilityProvider>
                {children}
              </AccessibilityProvider>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
