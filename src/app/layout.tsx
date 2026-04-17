import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { AccessibilityProvider } from "@/components/ui/AccessibilityProvider";
import QueryProvider from "@/providers/queryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SoftwareApplicationJsonLd from "@/components/seo/SoftwareApplicationJsonLd";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";
import { SkipToContent } from "@/components/ui";
import AppToaster from "@/components/providers/AppToaster";
import { SimpleI18nProvider } from "@/lib/i18n-simple";
import { locales, type Locale } from "@/i18n/routing";
import { I18N_CONFIG } from "@/i18n/i18n.config";

function metadataBaseUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
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
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PharmaSaaS",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = locales.includes(localeCookie as Locale)
    ? (localeCookie as Locale)
    : I18N_CONFIG.defaultLanguage;
  const languageSettings = I18N_CONFIG.languageSettings[locale];

  return (
    <html lang={locale} dir={languageSettings.direction}>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <SoftwareApplicationJsonLd />
        <ErrorBoundary>
          <SimpleI18nProvider locale={locale}>
            <QueryProvider>
              <AuthProvider>
                <AppToaster />
                <SkipToContent />
                <AccessibilityProvider>
                  <OfflineIndicator />
                  <div id="main-content" suppressHydrationWarning>
                    {children}
                  </div>
                  <InstallPrompt />
                </AccessibilityProvider>
              </AuthProvider>
            </QueryProvider>
          </SimpleI18nProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
