"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/design-system";
import {
  HeartIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();

  const navigations = [
    { path: "/", name: "Accueil" },
    { path: "/features", name: "Solutions" },
    { path: "/plan_demo", name: "Démo" },
    { path: "/pricing", name: "Tarifs" },
    { path: "/support", name: "Support" },
    { path: "/about", name: "À Propos" },
    { path: "/contact", name: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            {/* <Image src="/images/medpharma.png" width="150" height="70" alt="MEDPharma"/> */}
            <span className="font-display font-bold text-2xl text-emerald-600 tracking-tight">Syntix<span className="text-slate-900">Pharma</span></span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            <Link href="/features" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors uppercase tracking-widest">Solutions</Link>
            {/* <Link href="/solutions" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors uppercase tracking-widest">Solutions</Link> */}
            <Link href="/pricing" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors uppercase tracking-widest">Tarifs</Link>
            <Link href="/about" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors uppercase tracking-widest">À Propos</Link>
            <Link href="/contact" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors uppercase tracking-widest">Contact</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest">Connexion</Link>
            <Link href="/auth/register" className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
              Essai Gratuit
            </Link>
        </div>

          {/* <nav className="hidden md:flex items-center space-x-8">
            {navigations.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className={`text-gray-600 hover:text-sky-600 transition-colors font-medium text-sm ${
                  pathname === item.path ||
                  pathname?.startsWith(item.path + "/")
                    ? "text-sky-600"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav> */}

          {/* <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="default" className="font-medium">
                Se connecter
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="default" className="font-medium shadow-lg">
                Démo Gratuite
              </Button>
            </Link>
          </div> */}
        </div>
      </div>
    </header>
  );
}
