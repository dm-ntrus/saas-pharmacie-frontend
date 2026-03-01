'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: 'Est-ce que SyntixPharma fonctionne sans internet ?',
      a: 'Oui ! SyntixPharma dispose d\'un mode hors-ligne complet. Vous pouvez continuer à effectuer des ventes et gérer vos stocks. Les données seront synchronisées automatiquement dès que la connexion sera rétablie.'
    },
    {
      q: 'Mes données sont-elles sécurisées ?',
      a: 'Absolument. Nous utilisons un chiffrement de niveau bancaire (AES-256) et nos serveurs sont conformes aux normes de santé internationales. Vos données sont sauvegardées quotidiennement.'
    },
    {
      q: 'Combien de temps prend l\'installation ?',
      a: 'L\'inscription prend moins de 2 minutes. L\'importation de vos stocks peut prendre entre 30 minutes et quelques heures selon la taille de votre inventaire. Notre équipe peut vous assister gratuitement.'
    },
    {
      q: 'Puis-je utiliser mon propre matériel ?',
      a: 'Oui, SyntixPharma est compatible avec la plupart des lecteurs de codes-barres, imprimantes thermiques et tiroirs-caisses standard du marché.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-display">
              Questions <span className="text-emerald-600">Fréquentes</span>
            </h2>
            <p className="text-slate-600">
              Tout ce que vous devez savoir pour démarrer sereinement.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-emerald-200 shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === i ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8 text-slate-600 leading-relaxed text-sm">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
