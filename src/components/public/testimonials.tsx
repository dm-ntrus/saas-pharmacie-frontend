'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Dr. Sarah Mensah',
      role: 'Propriétaire, Pharmacie de l\'Espoir',
      content: 'SyntixPharma a transformé ma gestion quotidienne. Je peux enfin suivre mes stocks à distance et mes ventes ont augmenté de 20% en 6 mois.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      name: 'Jean-Pierre Talla',
      role: 'Gérant, Pharmacie du Centre',
      content: 'L\'interface est tellement simple que mes employés l\'ont prise en main en une matinée. Le support technique est toujours là quand on en a besoin.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JP'
    },
    {
      name: 'Dr. Amina Diallo',
      role: 'Pharmacienne, Clinique BioSanté',
      content: 'La conformité réglementaire était un cauchemar avant SyntixPharma. Maintenant, tout est automatisé et sécurisé. Je recommande vivement.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-display">
            Ce que disent nos <span className="text-emerald-600">utilisateurs</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Rejoignez une communauté de pharmaciens qui modernisent la santé.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group hover:bg-white hover:shadow-2xl hover:border-emerald-100 transition-all duration-500"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-emerald-600/10 group-hover:text-emerald-600/20 transition-colors" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-emerald-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-8 relative z-10">
                &quot;{t.content}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md relative">
                  {/* <Image 
                    src={t.avatar} 
                    alt={t.name} 
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  /> */}
                  {/* {t.name} */}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
