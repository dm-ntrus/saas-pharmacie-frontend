'use client';

import { motion } from 'motion/react';

export default function TrustedBy() {
  const logos = [
    'Pharmacie Centrale',
    'Groupe Santé',
    'BioMed Lab',
    'PharmaPlus',
    'MediCare Africa',
    'Global Health',
    'Kinshasa Pharma',
    'Lubumbashi Med'
  ];

  return (
    <section className="py-16 overflow-hidden border-y border-slate-100 bg-slate-50/50">
      <div className="container mx-auto px-4 mb-12">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
          Ils nous font confiance à travers le continent
        </p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-32">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="text-2xl md:text-4xl font-bold text-slate-200 hover:text-emerald-600 transition-colors duration-500 font-display cursor-default select-none"
            >
              {logo}
            </div>
          ))}
        </div>

        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
