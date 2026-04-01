const site =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
  process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SyntixPharma",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Plateforme SaaS de gestion de pharmacie : point de vente, inventaire, patients, prescriptions, supply chain, facturation, conformité et analytics.",
  url: site,
  inLanguage: "fr",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/OnlineOnly",
    priceCurrency: "USD",
    description: "Essai et abonnements selon offre — voir page Tarifs.",
  },
  publisher: {
    "@type": "Organization",
    name: "SyntixPharma",
    url: site,
  },
};

export default function SoftwareApplicationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
