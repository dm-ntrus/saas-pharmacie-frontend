'use client';

import { motion } from 'motion/react';
import { 
  Stethoscope, 
  Truck, 
  Building, 
  ShieldPlus, 
  ArrowRight,
  CheckCircle2,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const solutions = [
  {
    id: "officine",
    icon: Stethoscope,
    title: "Pharmacie d'Officine",
    desc: "Optimisez vos ventes au comptoir et la fidélisation de vos patients.",
    features: ["Ventes POS rapides", "Gestion des ordonnances", "Alertes de stock", "Fidélité client"],
    image: "/images/hero.png"
  },
  {
    id: "grossiste",
    icon: Truck,
    title: "Grossistes & Répartiteurs",
    desc: "Gérez des volumes massifs et une logistique complexe en toute simplicité.",
    features: ["Gestion d'entrepôt", "Suivi des livraisons", "Portail clients B2B", "Analytique avancée"],
    image: "/images/hero.png"
  },
  {
    id: "hopital",
    icon: Building,
    title: "Pharmacie Hospitalière",
    desc: "Intégrez la pharmacie au parcours de soins de l'établissement.",
    features: ["Dossier patient partagé", "Gestion des services", "Traçabilité unitaire", "Inventaire centralisé"],
    image: "/images/hero.png"
  }
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-white">
      {/* Header */}
      <section className="px-6 mb-12 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black mb-4 border border-emerald-100 uppercase tracking-[0.2em]">
              Nos Solutions
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-8 tracking-[-0.04em] leading-[0.9]">
              Adapté à chaque <br />
              <span className="text-emerald-600">Métier</span> de la santé.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
              Que vous soyez une petite officine de quartier ou un grand répartiteur national, SyntixPharma a la solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions List */}
      <section className="px-6 space-y-24 pb-16">
        {solutions.map((solution, i) => (
          <div key={solution.id} className="max-w-7xl mx-auto">
            <div className={`grid lg:grid-cols-12 gap-20 items-center`}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mb-4 shadow-2xl shadow-slate-900/20">
                  <solution.icon className="w-10 h-10" />
                </div>
                <h2 className="text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight">{solution.title}</h2>
                <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium">
                  {solution.desc}
                </p>
                <div className="grid sm:grid-cols-2 gap-8 mb-16">
                  {solution.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-4 text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-lg font-bold">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/auth/register" className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-emerald-600 transition-all group shadow-2xl shadow-slate-900/20">
                  Démarrer avec cette solution
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className={`lg:col-span-6 relative aspect-[3/3] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ${i % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      {/* Success Stories / Case Study */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black mb-4 border border-emerald-200 uppercase tracking-[0.2em]">
              Impact Réel
            </div>
            <h2 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-8 tracking-tight">Histoires de <span className="text-emerald-600">Succès.</span></h2>
            <p className="text-2xl text-slate-500 max-w-3xl mx-auto font-medium">
              Découvrez comment SyntixPharma transforme le quotidien des professionnels de santé.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {[
              {
                title: "Pharmacie de la Paix",
                location: "Lubumbashi, RDC",
                impact: "+45% de rentabilité en 6 mois",
                quote: "Grâce à la gestion prédictive des stocks, nous avons réduit nos pertes par péremption de 80%.",
                image: "/images/hero.png"
              },
              {
                title: "Groupe Médical Horizon",
                location: "Abidjan, Côte d'Ivoire",
                impact: "Zéro erreur de délivrance",
                quote: "La traçabilité unitaire a sécurisé tout notre circuit du médicament, de l'entrepôt au patient.",
                image: "/images/hero.png"
              }
            ].map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image src={story.image} alt={story.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                      {story.impact}
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white">{story.title}</h3>
                    <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest">{story.location}</p>
                  </div>
                </div>
                <div className="p-12">
                  <p className="text-2xl font-display font-bold text-slate-900 italic leading-relaxed">
                    &quot;{story.quote}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solution CTA */}
      <section className="mt-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-10 mx-auto">
                <ShieldPlus className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-8">Besoin d&apos;une solution sur mesure ?</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Notre équipe d&apos;ingénieurs peut adapter SyntixPharma aux besoins spécifiques de votre organisation de santé.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact" className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
                  Contacter un expert
                </Link>
                <Link href="/pricing" className="px-12 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                  Voir les tarifs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
