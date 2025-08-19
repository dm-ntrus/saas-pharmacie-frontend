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

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-sky-600 rounded-lg flex items-center justify-center mr-3">
                <HeartIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">PharmacySaaS</span>
            </div>
            <p className="text-gray-400">
              La solution de gestion moderne pour les pharmacies africaines.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#features" className="hover:text-white">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="/demo" className="hover:text-white">
                  Démo
                </a>
              </li>
              <li>
                <a href="/api-docs" className="hover:text-white">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/help" className="hover:text-white">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="/training" className="hover:text-white">
                  Formation
                </a>
              </li>
              <li>
                <a href="/status" className="hover:text-white">
                  Statut
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/about" className="hover:text-white">
                  À propos
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white">
                  Carrières
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white">
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © 2025 NakiCode. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
