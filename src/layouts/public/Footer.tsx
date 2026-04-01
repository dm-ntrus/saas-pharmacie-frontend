"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MARKETING_FOOTER_COLUMNS } from "@/content/marketing-site";
import FooterNewsletter from "@/layouts/public/FooterNewsletter";

const socials = [
  { label: "LinkedIn", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "WhatsApp", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white" aria-label="Pied de page">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold leading-tight mb-2">
                Restez à la pointe de{" "}
                <span className="text-emerald-400 italic">l&apos;innovation</span>.
              </h2>
              <p className="text-sm text-slate-400 max-w-md">
                Recevez nos conseils, nos mises à jour produit et les meilleures
                pratiques officine directement dans votre boîte mail.
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
              La plateforme SaaS pour piloter votre officine, de la caisse à la
              conformité. Cloud, multi-tenant, prêt pour l&apos;Afrique et au-delà.
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
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
          </div>

          {/* Link columns */}
          {MARKETING_FOOTER_COLUMNS.map((col) => (
            <nav key={col.id} aria-label={col.title}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500 mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
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
          <p>
            © {new Date().getFullYear()} SyntixPharma. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Conditions d&apos;utilisation
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link href="/status" className="hover:text-white transition-colors">
              Statut
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
