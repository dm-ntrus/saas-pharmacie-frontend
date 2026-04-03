"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FooterNewsletter from "@/layouts/public/FooterNewsletter";
import { Link } from "@/i18n/navigation";

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
    id: "dev",
    titleKey: "devReliability",
    links: [
      { href: "/api-docs", labelKey: "apiDocumentation" },
      { href: "/status", labelKey: "serviceStatus" },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-bold text-2xl text-emerald-500 tracking-tight">
                Syntix<span className="text-white">Pharma</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
              {t("brandDesc")}
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <a
                  key={s.labelKey}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:border-emerald-500/40 transition-colors"
                >
                  {t(s.labelKey)}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.id} aria-label={t(col.titleKey)}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500 mb-5">
                {t(col.titleKey)}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      {t(link.labelKey)}
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
          <p>
            {t("copyright", { year: new Date().getFullYear().toString() })}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              {t("terms")}
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t("privacy")}
            </Link>
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
