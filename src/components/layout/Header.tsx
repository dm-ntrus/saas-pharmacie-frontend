import React from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
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

export default function Header() {
  const pathname = usePathname();

  const navigations = [
    { path: "/", name: "Accueil" },
    { path: "/features", name: "Solutions" },
    { path: "/pricing", name: "Tarifs" },
    { path: "/support", name: "Support" },
    { path: "/about", name: "À Propos" },
    { path: "/contact", name: "Contact" },
  ];

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">NakiCode</span>
              <span className="text-sm text-sky-600 block leading-none">
                PharmacySaaS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigations.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className={`text-gray-600 hover:text-sky-600 transition-colors font-medium text-sm ${
                  pathname === item.path || pathname?.startsWith(item.path + "/") ? "text-sky-600" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="default" className="font-medium">
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button size="default" className="font-medium shadow-lg">
                Démo Gratuite
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
