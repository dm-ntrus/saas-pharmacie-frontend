import type { Metadata } from "next";
import type { ReactNode } from "react";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Plateforme & modules",
  description:
    "Catalogue des modules SyntixPharma : point de vente, inventaire, patients, prescriptions, supply chain, finance, livraisons, fidélité, conformité et pilotage.",
  alternates: { canonical: `${base.replace(/\/$/, "")}/modules` },
  openGraph: {
    title: "Plateforme & modules | SyntixPharma",
    description:
      "Découvrez toutes les capacités métier : de la caisse à la chaîne d’approvisionnement et au journal d’audit.",
    url: "/modules",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plateforme & modules | SyntixPharma",
    description:
      "Tout ce que votre officine peut faire avec SyntixPharma, module par module.",
  },
};

export default function ModulesMarketingLayout({ children }: { children: ReactNode }) {
  return children;
}
