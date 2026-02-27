"use client";
import React from "react";
import Link from "next/link";
import { motion } from 'motion/react';
import { Globe, MessageSquare, Mail } from 'lucide-react';
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
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
              <span className="font-display font-bold text-2xl text-emerald-600 tracking-tight">Syntix<span className="text-white">Pharma</span></span>
              </div>
              <p className="text-slate-400 max-w-sm mb-10 text-lg leading-relaxed">
                La plateforme de gestion de pharmacie leader en Afrique Centrale. Modernisez votre officine dès aujourd&apos;hui avec nos outils intelligents.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors group">
                  <Globe className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </Link>
                <Link href="#" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors group">
                  <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-8 text-emerald-500 uppercase tracking-widest text-xs">Produit</h4>
              <ul className="space-y-5 text-slate-400 text-lg">
                <li><Link href="/features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link href="/plan_demo" className="hover:text-white transition-colors">Démo</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 text-emerald-500 uppercase tracking-widest text-xs">Support</h4>
              <ul className="space-y-5 text-slate-400 text-lg">
                <li><Link href="#" className="hover:text-white transition-colors">Centre d&apos;aide</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
              </ul>
            </div>

            <div className="md:col-span-full">
            <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-slate-900 font-display mb-4 leading-tight">Restez à la pointe de <span className="text-emerald-600 italic">l&apos;innovation</span>.</h2>
                <p className="text-slate-500 text-lg">Recevez nos conseils experts et les dernières mises à jour de SyntixPharma directement dans votre boîte mail.</p>
              </div>
              <div className="flex-1 w-full">
                <form className="flex flex-col gap-4">
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="votre@email.com"
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>
                  <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                    S&apos;abonner à la newsletter
                  </button>
                </form>
                <p className="text-center text-xs text-slate-400 mt-4">Nous respectons votre vie privée. Désabonnez-vous à tout moment.</p>
              </div>
            </div>
          </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
            <p>© 2026 SyntixPharma. Tous droits réservés. Conçu avec passion pour les pharmaciens.</p>
            <div className="flex gap-10">
              <Link href="/terms" className="hover:text-white transition-colors">Conditions d&apos;utilisation</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Mentions légales</Link>
            </div>
          </div>
        </div>
      </footer>
  );
}
