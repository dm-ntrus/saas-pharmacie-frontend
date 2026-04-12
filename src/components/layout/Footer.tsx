"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("layout.footer");
  const columns = [
    {
      id: "product",
      title: t("product"),
      links: [
        { href: "/", label: t("home") },
        { href: "/modules", label: t("modulesCapabilities") },
        { href: "/pricing", label: t("pricingLabel") },
        { href: "/api-docs", label: t("apiDocumentation") },
      ],
    },
    {
      id: "support",
      title: t("helpAccess"),
      links: [
        { href: "/support", label: t("helpCenter") },
        { href: "/contact", label: t("contactUs") },
        { href: "/status", label: t("serviceStatus") },
      ],
    },
    {
      id: "legal",
      title: t("companyLegal"),
      links: [
        { href: "/about", label: t("aboutLabel") },
        { href: "/privacy", label: t("privacyLabel") },
        { href: "/terms", label: t("termsLabel") },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <span className="font-display font-bold text-xl text-emerald-500 tracking-tight">
                Syntix<span className="text-white">Pharma</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("brandDesc")}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.id}>
              <h4 className="font-bold mb-4 text-emerald-500 uppercase tracking-widest text-xs">
                {col.title}
              </h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              {t("termsLabel")}
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              {t("privacyLabel")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
