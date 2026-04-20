"use client";

import { ArrowUpRight, Shield, Award, Lock, Heart } from "lucide-react";
import { useTranslations } from "@/lib/i18n-simple";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FooterNewsletter from "@/layouts/public/FooterNewsletter";
import { Link } from "@/i18n/navigation";
import { useMarketingFooter } from "@/hooks/api/usePublicDynamicModules";

const socials = [
  { labelKey: "socialLinkedIn", href: "#" },
  { labelKey: "socialTwitter", href: "#" },
  { labelKey: "socialFacebook", href: "#" },
  { labelKey: "socialWhatsApp", href: "#" },
] as const;

type FooterColumn = {
  id: string;
  titleKey: string;
  links: { href: string; labelKey: string }[];
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "product",
    titleKey: "product",
    links: [
      { href: "/", labelKey: "home" },
      { href: "/modules", labelKey: "modulesCapabilities" },
      { href: "/solutions", labelKey: "businessSolutions" },
      { href: "/features", labelKey: "featuresLabel" },
      { href: "/pricing", labelKey: "pricingLabel" },
      { href: "/plan_demo", labelKey: "demoLabel" },
      { href: "/signup", labelKey: "offersLabel" },
    ],
  },
  {
    id: "pharmacy",
    titleKey: "pharmacySolutions",
    links: [
      { href: "/modules/inventory", labelKey: "inventoryManagement" },
      { href: "/modules/pos", labelKey: "posSystem" },
      { href: "/modules/patients", labelKey: "patientManagement" },
      { href: "/modules/prescriptions", labelKey: "prescriptionModule" },
      { href: "/modules/compliance", labelKey: "complianceModule" },
      { href: "/modules/delivery", labelKey: "deliveryModule" },
    ],
  },
  {
    id: "dev",
    titleKey: "devReliability",
    links: [
      { href: "/api-docs", labelKey: "apiDocumentation" },
      { href: "/status", labelKey: "serviceStatus" },
      { href: "/security", labelKey: "securityLabel" },
    ],
  },
  {
    id: "help",
    titleKey: "helpAccess",
    links: [
      { href: "/support", labelKey: "helpCenter" },
      { href: "/contact", labelKey: "contactUs" },
      { href: "/auth/login", labelKey: "loginLabel" },
      { href: "/auth/register", labelKey: "trialSignup" },
    ],
  },
  {
    id: "legal",
    titleKey: "companyLegal",
    links: [
      { href: "/about", labelKey: "aboutLabel" },
      { href: "/privacy", labelKey: "privacyLabel" },
      { href: "/terms", labelKey: "termsLabel" },
    ],
  },
];

export default function Footer() {
  const t = useTranslations("layout.footer");
  const { data } = useMarketingFooter();
  const company = data?.company_info;
  const socialsData =
    data?.social_links?.length
      ? data.social_links.map((s: any) => ({ label: s.label, href: s.url }))
      : socials.map((s) => ({ label: t(s.labelKey), href: s.href }));
  const columns =
    data?.columns?.length
      ? data.columns.map((column: any) => ({
          id: column.column_key,
          title: column.title,
          links: (column.links ?? []).map((link: any) => ({
            href: link.url,
            label: link.title,
          })),
        }))
      : FOOTER_COLUMNS.map((col) => ({
          id: col.id,
          title: t(col.titleKey),
          links: col.links.map((link) => ({ href: link.href, label: t(link.labelKey) })),
        }));
  const legalLinks = data?.legal_links ?? [];

  return (
    <footer className="bg-slate-950 text-white" aria-label={t("footerAriaLabel")}>
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold leading-tight mb-2">
                {t("newsletterTitle")}{" "}
                <span className="text-emerald-400 italic">{t("newsletterHighlight")}</span>.
              </h2>
              <p className="text-sm text-slate-400 max-w-md">
                {t("newsletterDesc")}
              </p>
            </div>
            <div className="max-w-md lg:ml-auto w-full">
              <FooterNewsletter />
            </div>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 mb-4 lg:mb-0">
            <Link href="/" className="inline-block mb-4 group">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                    <rect x="9" y="3" width="6" height="18" rx="1" fill="currentColor" opacity="0.9" />
                    <rect x="3" y="9" width="18" height="6" rx="1" fill="currentColor" />
                  </svg>
                </div>
                <span className="font-display font-bold text-2xl text-emerald-400 tracking-tight">
                  Syntix<span className="text-white">Pharma</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
              {company?.description ?? t("brandDesc")}
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {socialsData.map((s: any) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:border-emerald-500/40 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
            {/* Health Certifications */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3">
                Certifications & Compliance
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-300">GDP</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-300">ISO 27001</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-300">HIPAA</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <Heart className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-300">HAI Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col: any) => (
            <nav key={col.id} aria-label={col.title}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500 mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link: any) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      {link.href.startsWith("http") && (
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left leading-relaxed">
            {(company?.copyright_text ??
              t("copyright", { year: new Date().getFullYear().toString() })).replace(
              "{{year}}",
              new Date().getFullYear().toString(),
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6">
            {(legalLinks.length
              ? legalLinks.map((l: any) => ({ href: l.url, label: l.title }))
              : [
                  { href: "/terms", label: t("terms") },
                  { href: "/privacy", label: t("privacy") },
                ]).map((item: any) => (
              <Link key={item.href} href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
            <Link href="/status" className="hover:text-white transition-colors">
              {t("status")}
            </Link>
            <LanguageSwitcher variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
