"use client";

import Link from "next/link";
import { TENANT_SHELL_FOOTER_COLUMNS } from "@/content/marketing-site";

export default function Footer() {
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
              La solution de gestion moderne pour les pharmacies.
            </p>
          </div>

          {TENANT_SHELL_FOOTER_COLUMNS.map((col) => (
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
            © {new Date().getFullYear()} SyntixPharma. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              CGU
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
