'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black mb-8 border border-emerald-100 uppercase tracking-[0.2em]">
            Légal
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-8 tracking-[-0.04em] leading-[0.9]">
            Politique de <br />
            <span className="text-emerald-600">Confidentialité</span>
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-500 mb-10 font-medium leading-relaxed">
              Chez SyntixPharma, la protection de vos données de santé est notre priorité absolue. Nous nous engageons à une transparence totale sur la manière dont nous traitons vos informations.
            </p>

            <div className="space-y-10">
              <section className="grid lg:grid-cols-12 gap-10 border-t border-slate-100 pt-16">
                <div className="lg:col-span-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">01. Collecte</h2>
                </div>
                <div className="lg:col-span-8">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">Quelles données collectons-nous ?</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Nous collectons les informations nécessaires à la fourniture de nos services, notamment les informations sur votre pharmacie, vos employés et les données transactionnelles. Toutes les données de santé sont traitées avec le plus haut niveau de confidentialité.
                  </p>
                </div>
              </section>

              <section className="grid lg:grid-cols-12 gap-10 border-t border-slate-100 pt-16">
                <div className="lg:col-span-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">02. Utilisation</h2>
                </div>
                <div className="lg:col-span-8">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">Comment utilisons-nous vos données ?</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Vos données sont utilisées exclusivement pour assurer le bon fonctionnement de la plateforme, améliorer nos services et vous fournir un support technique de qualité. Nous ne vendons jamais vos données à des tiers.
                  </p>
                </div>
              </section>

              <section className="grid lg:grid-cols-12 gap-10 border-t border-slate-100 pt-16">
                <div className="lg:col-span-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">03. Sécurité</h2>
                </div>
                <div className="lg:col-span-8">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">Sécurité de niveau bancaire</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles avancées, incluant le chiffrement AES-256, pour protéger vos données contre tout accès non autorisé, perte ou altération.
                  </p>
                </div>
              </section>

              <section className="grid lg:grid-cols-12 gap-10 border-t border-slate-100 pt-16">
                <div className="lg:col-span-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">04. Vos Droits</h2>
                </div>
                <div className="lg:col-span-8">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">Contrôle total</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ces droits à tout moment en nous contactant à privacy@medpharma.cd.
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-32 pt-16 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Dernière mise à jour : 21 Février 2026</p>
              {/* <Link href="/" className="text-emerald-600 font-black uppercase tracking-widest text-sm hover:text-emerald-700 transition-colors">Retour à l&apos;accueil</Link> */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
